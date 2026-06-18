import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { hashPasswordResetToken } from "@/lib/password-reset";

const { getSmtpDiagnosticsMock, prismaMock, sendPasswordResetEmailMock } = vi.hoisted(() => ({
  getSmtpDiagnosticsMock: vi.fn(),
  prismaMock: {
    $transaction: vi.fn(),
    passwordResetToken: {
      create: vi.fn(),
      updateMany: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
  sendPasswordResetEmailMock: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: prismaMock,
}));

vi.mock("@/server/email", async (importActual) => {
  const actual = await importActual<typeof import("@/server/email")>();

  return {
    ...actual,
    getSmtpDiagnostics: getSmtpDiagnosticsMock,
    sendPasswordResetEmail: sendPasswordResetEmailMock,
  };
});

import { EmailConfigurationError, EmailDeliveryError } from "@/server/email";

import { requestPasswordReset, type ForgotPasswordActionState } from "./actions";

const ORIGINAL_ENV = { ...process.env };
const GENERIC_SUCCESS_MESSAGE =
  "Se o e-mail informado pertencer a uma administradora ativa, enviaremos as instruções de redefinição.";

const INITIAL_STATE: ForgotPasswordActionState = {
  fieldErrors: {},
  message: "",
  status: "idle",
};

const ACTIVE_ADMIN = {
  active: true,
  email: "admin@floricultura.test",
  id: "user-1",
  role: "ADMIN",
};

let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
let consoleInfoSpy: ReturnType<typeof vi.spyOn>;

describe("requestPasswordReset", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env = {
      ...ORIGINAL_ENV,
      NEXT_PUBLIC_SITE_URL: "https://floricultura.test",
      NODE_ENV: "test",
      SMTP_FROM: "Floricultura <admin@floricultura.test>",
      SMTP_HOST: "smtp.example.com",
      SMTP_PASS: "smtp-secret",
      SMTP_PORT: "587",
      SMTP_USER: "admin@floricultura.test",
    };

    prismaMock.passwordResetToken.updateMany.mockResolvedValue({ count: 1 });
    prismaMock.passwordResetToken.create.mockResolvedValue({ id: "reset-token-1" });
    prismaMock.$transaction.mockImplementation(async (operations: Array<Promise<unknown>>) =>
      Promise.all(operations),
    );
    sendPasswordResetEmailMock.mockResolvedValue(undefined);
    getSmtpDiagnosticsMock.mockReturnValue({
      configured: {
        from: true,
        host: true,
        pass: true,
        port: true,
        user: true,
      },
      host: "smtp.example.com",
      port: 587,
      secure: false,
    });

    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    consoleInfoSpy = vi.spyOn(console, "info").mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleInfoSpy.mockRestore();
    process.env = { ...ORIGINAL_ENV };
  });

  it("cria token e envia email para admin ativo com SMTP OK", async () => {
    prismaMock.user.findUnique.mockResolvedValue(ACTIVE_ADMIN);

    const result = await requestPasswordReset(INITIAL_STATE, createFormData("ADMIN@FLORICULTURA.TEST"));

    expect(result).toEqual({
      fieldErrors: {},
      message: GENERIC_SUCCESS_MESSAGE,
      status: "success",
    });
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          email: "admin@floricultura.test",
        },
      }),
    );
    expect(prismaMock.passwordResetToken.updateMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.passwordResetToken.create).toHaveBeenCalledWith({
      data: {
        expiresAt: expect.any(Date),
        tokenHash: expect.stringMatching(/^[a-f0-9]{64}$/),
        userId: ACTIVE_ADMIN.id,
      },
    });
    expect(sendPasswordResetEmailMock).toHaveBeenCalledWith({
      expiresInMinutes: 30,
      resetUrl: expect.stringMatching(
        /^https:\/\/floricultura\.test\/admin\/redefinir-senha\?token=[A-Za-z0-9_-]{43}$/,
      ),
      to: ACTIVE_ADMIN.email,
    });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("invalida o token, registra log seguro e mantém resposta genérica quando SMTP está mal configurado", async () => {
    prismaMock.user.findUnique.mockResolvedValue(ACTIVE_ADMIN);
    sendPasswordResetEmailMock.mockRejectedValue(
      new EmailConfigurationError("Configuração SMTP incompleta ou inválida."),
    );

    const result = await requestPasswordReset(INITIAL_STATE, createFormData(ACTIVE_ADMIN.email));

    const sentResetUrl = sendPasswordResetEmailMock.mock.calls[0]?.[0].resetUrl;
    const token = new URL(sentResetUrl).searchParams.get("token");

    expect(result.status).toBe("success");
    expect(result.message).toBe(GENERIC_SUCCESS_MESSAGE);
    expect(token).toBeTruthy();
    expect(prismaMock.passwordResetToken.updateMany).toHaveBeenCalledTimes(2);
    expect(prismaMock.passwordResetToken.updateMany).toHaveBeenLastCalledWith({
      data: {
        usedAt: expect.any(Date),
      },
      where: {
        tokenHash: hashPasswordResetToken(token ?? ""),
        usedAt: null,
      },
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[password-reset] email failure",
      expect.objectContaining({
        errorName: "EmailConfigurationError",
        errorType: "smtp_configuration",
        recipientDomain: "floricultura.test",
        userId: ACTIVE_ADMIN.id,
      }),
    );
    expect(JSON.stringify(consoleErrorSpy.mock.calls)).not.toContain("smtp-secret");
    expect(JSON.stringify(consoleErrorSpy.mock.calls)).not.toContain(token);
  });

  it("invalida o token, registra metadados seguros e mantém resposta genérica quando a entrega falha", async () => {
    prismaMock.user.findUnique.mockResolvedValue(ACTIVE_ADMIN);
    sendPasswordResetEmailMock.mockRejectedValue(
      new EmailDeliveryError("Não foi possível enviar o email de redefinição de senha.", {
        cause: new Error("Mensagem interna do provedor"),
        details: {
          code: "EAUTH",
          command: "AUTH",
          responseCode: 535,
        },
      }),
    );

    const result = await requestPasswordReset(INITIAL_STATE, createFormData(ACTIVE_ADMIN.email));

    const sentResetUrl = sendPasswordResetEmailMock.mock.calls[0]?.[0].resetUrl;
    const token = new URL(sentResetUrl).searchParams.get("token");

    expect(result.status).toBe("success");
    expect(prismaMock.passwordResetToken.updateMany).toHaveBeenCalledTimes(2);
    expect(prismaMock.passwordResetToken.updateMany).toHaveBeenLastCalledWith({
      data: {
        usedAt: expect.any(Date),
      },
      where: {
        tokenHash: hashPasswordResetToken(token ?? ""),
        usedAt: null,
      },
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[password-reset] email failure",
      expect.objectContaining({
        delivery: {
          code: "EAUTH",
          command: "AUTH",
          responseCode: 535,
        },
        errorName: "EmailDeliveryError",
        errorType: "smtp_delivery",
      }),
    );
    expect(JSON.stringify(consoleErrorSpy.mock.calls)).not.toContain("smtp-secret");
    expect(JSON.stringify(consoleErrorSpy.mock.calls)).not.toContain(token);
    expect(JSON.stringify(consoleErrorSpy.mock.calls)).not.toContain("Mensagem interna do provedor");
  });

  it.each([
    ["usuário inexistente", null],
    [
      "usuário inativo",
      {
        ...ACTIVE_ADMIN,
        active: false,
      },
    ],
  ])("não cria token nem chama SMTP para %s", async (_scenario, admin) => {
    prismaMock.user.findUnique.mockResolvedValue(admin);

    const result = await requestPasswordReset(INITIAL_STATE, createFormData("admin@floricultura.test"));

    expect(result).toEqual({
      fieldErrors: {},
      message: GENERIC_SUCCESS_MESSAGE,
      status: "success",
    });
    expect(prismaMock.passwordResetToken.create).not.toHaveBeenCalled();
    expect(prismaMock.passwordResetToken.updateMany).not.toHaveBeenCalled();
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
    expect(sendPasswordResetEmailMock).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("não cria token em produção quando NEXT_PUBLIC_SITE_URL aponta para localhost", async () => {
    process.env = {
      ...process.env,
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
      NODE_ENV: "production",
    };
    prismaMock.user.findUnique.mockResolvedValue(ACTIVE_ADMIN);

    const result = await requestPasswordReset(INITIAL_STATE, createFormData(ACTIVE_ADMIN.email));

    expect(result.status).toBe("success");
    expect(prismaMock.passwordResetToken.create).not.toHaveBeenCalled();
    expect(sendPasswordResetEmailMock).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[password-reset] email failure",
      expect.objectContaining({
        errorName: "PasswordResetSiteUrlConfigurationError",
        errorType: "reset_url_configuration",
      }),
    );
  });

  it("registra o link de reset apenas em modo de desenvolvimento habilitado", async () => {
    process.env = {
      ...process.env,
      NODE_ENV: "development",
      PASSWORD_RESET_DEV_LOG_LINK: "true",
    };
    prismaMock.user.findUnique.mockResolvedValue(ACTIVE_ADMIN);

    await requestPasswordReset(INITIAL_STATE, createFormData(ACTIVE_ADMIN.email));

    expect(consoleInfoSpy).toHaveBeenCalledWith(
      "[password-reset] development reset link",
      expect.objectContaining({
        event: "password_reset_development_link_created",
        recipientDomain: "floricultura.test",
        resetUrl: expect.stringContaining("/admin/redefinir-senha?token="),
        userId: ACTIVE_ADMIN.id,
      }),
    );
  });
});

function createFormData(email: string) {
  const formData = new FormData();
  formData.set("email", email);

  return formData;
}
