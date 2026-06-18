import { beforeEach, describe, expect, it, vi } from "vitest";

const { createTransportMock, sendMailMock } = vi.hoisted(() => ({
  createTransportMock: vi.fn(),
  sendMailMock: vi.fn(),
}));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: createTransportMock,
  },
}));

import {
  EmailConfigurationError,
  EmailDeliveryError,
  getSmtpDiagnostics,
  sendPasswordResetEmail,
} from "@/server/email";

const ORIGINAL_ENV = { ...process.env };

describe("sendPasswordResetEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...ORIGINAL_ENV };
    process.env.SMTP_HOST = "smtp.example.com";
    process.env.SMTP_PORT = "587";
    process.env.SMTP_USER = "admin@example.com";
    process.env.SMTP_PASS = "smtp-secret";
    process.env.SMTP_FROM = "Floricultura <admin@example.com>";
    createTransportMock.mockReturnValue({
      sendMail: sendMailMock,
    });
    sendMailMock.mockResolvedValue({ messageId: "message-id" });
  });

  it("envia email de redefinição com configuração SMTP válida", async () => {
    await sendPasswordResetEmail({
      expiresInMinutes: 30,
      resetUrl: "https://floricultura.test/admin/redefinir-senha?token=abc",
      to: "admin@floricultura.test",
    });

    expect(createTransportMock).toHaveBeenCalledWith({
      auth: {
        pass: "smtp-secret",
        user: "admin@example.com",
      },
      host: "smtp.example.com",
      port: 587,
      secure: false,
    });
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Floricultura <admin@example.com>",
        subject: "Redefinição de senha do painel",
        to: "admin@floricultura.test",
      }),
    );
  });

  it("lança EmailConfigurationError quando SMTP está incompleto", async () => {
    delete process.env.SMTP_PASS;

    await expect(
      sendPasswordResetEmail({
        expiresInMinutes: 30,
        resetUrl: "https://floricultura.test/admin/redefinir-senha?token=abc",
        to: "admin@floricultura.test",
      }),
    ).rejects.toBeInstanceOf(EmailConfigurationError);

    expect(createTransportMock).not.toHaveBeenCalled();
  });

  it("preserva causa e metadados seguros quando o SMTP rejeita o envio", async () => {
    const smtpError = Object.assign(new Error("auth failed"), {
      code: "EAUTH",
      command: "AUTH",
      response: "535 rejected",
      responseCode: 535,
    });
    sendMailMock.mockRejectedValue(smtpError);

    await expect(
      sendPasswordResetEmail({
        expiresInMinutes: 30,
        resetUrl: "https://floricultura.test/admin/redefinir-senha?token=abc",
        to: "admin@floricultura.test",
      }),
    ).rejects.toMatchObject({
      cause: smtpError,
      details: {
        code: "EAUTH",
        command: "AUTH",
        responseCode: 535,
      },
      name: "EmailDeliveryError",
    });

    await expect(
      sendPasswordResetEmail({
        expiresInMinutes: 30,
        resetUrl: "https://floricultura.test/admin/redefinir-senha?token=abc",
        to: "admin@floricultura.test",
      }),
    ).rejects.toBeInstanceOf(EmailDeliveryError);
  });
});

describe("getSmtpDiagnostics", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("retorna apenas dados seguros da configuração SMTP", () => {
    process.env.SMTP_HOST = "smtp.example.com";
    process.env.SMTP_PORT = "465";
    process.env.SMTP_USER = "admin@example.com";
    process.env.SMTP_PASS = "smtp-secret";
    process.env.SMTP_FROM = "Floricultura <admin@example.com>";

    expect(getSmtpDiagnostics()).toEqual({
      configured: {
        from: true,
        host: true,
        pass: true,
        port: true,
        user: true,
      },
      host: "smtp.example.com",
      port: 465,
      secure: true,
    });
  });
});
