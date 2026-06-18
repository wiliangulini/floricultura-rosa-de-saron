import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock, revalidatePathMock } = vi.hoisted(() => ({
  prismaMock: {
    category: {
      findMany: vi.fn(),
    },
    settings: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    user: {
      update: vi.fn(),
    },
  },
  revalidatePathMock: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: prismaMock,
}));

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue({ value: "valid-session-cookie" }),
  }),
}));

vi.mock("@/lib/auth", () => ({
  ADMIN_SESSION_COOKIE: "floricultura_admin_session",
  readAdminSessionCookie: vi.fn().mockResolvedValue({
    email: "admin@floricultura.test",
    userId: "user-1",
  }),
}));

import { saveSettings, type SettingsActionState } from "./actions";

const INITIAL_STATE: SettingsActionState = {
  fieldErrors: {},
  message: "",
  status: "idle",
};

const EXISTING_SETTINGS_ID = "default-settings";

function createSettingsFormData(overrides: Record<string, string> = {}) {
  const formData = new FormData();
  formData.set("businessName", "Floricultura Rosa de Saron");
  formData.set("whatsappNumber", "5546999197294");
  for (const [key, value] of Object.entries(overrides)) {
    formData.set(key, value);
  }
  return formData;
}

describe("saveSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("atualiza apenas Settings e não toca a tabela User", async () => {
    prismaMock.settings.findFirst.mockResolvedValue({ id: EXISTING_SETTINGS_ID });
    prismaMock.settings.update.mockResolvedValue({});
    prismaMock.category.findMany.mockResolvedValue([]);

    const result = await saveSettings(
      INITIAL_STATE,
      createSettingsFormData({ email: "novo-contato@floricultura.com.br" }),
    );

    expect(result.status).toBe("success");
    expect(prismaMock.settings.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ email: "novo-contato@floricultura.com.br" }),
        where: { id: EXISTING_SETTINGS_ID },
      }),
    );
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("salvar Settings.email com o mesmo valor de User.email não altera credenciais de nenhum usuário", async () => {
    const userEmail = "gulini.dev@gmail.com";
    prismaMock.settings.findFirst.mockResolvedValue({ id: EXISTING_SETTINGS_ID });
    prismaMock.settings.update.mockResolvedValue({});
    prismaMock.category.findMany.mockResolvedValue([]);

    const result = await saveSettings(
      INITIAL_STATE,
      createSettingsFormData({ email: userEmail }),
    );

    expect(result.status).toBe("success");
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("retorna erro de campo quando businessName está vazio", async () => {
    const formData = new FormData();
    formData.set("businessName", "");
    formData.set("whatsappNumber", "5546999197294");

    const result = await saveSettings(INITIAL_STATE, formData);

    expect(result.status).toBe("error");
    expect(result.fieldErrors.businessName).toBeTruthy();
    expect(prismaMock.settings.update).not.toHaveBeenCalled();
    expect(prismaMock.settings.create).not.toHaveBeenCalled();
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("retorna erro de campo quando email de contato é inválido", async () => {
    const result = await saveSettings(
      INITIAL_STATE,
      createSettingsFormData({ email: "nao-e-um-email" }),
    );

    expect(result.status).toBe("error");
    expect(result.fieldErrors.email).toBeTruthy();
    expect(prismaMock.settings.update).not.toHaveBeenCalled();
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("cria Settings quando não existe registro ainda", async () => {
    prismaMock.settings.findFirst.mockResolvedValue(null);
    prismaMock.settings.create.mockResolvedValue({});
    prismaMock.category.findMany.mockResolvedValue([]);

    const result = await saveSettings(INITIAL_STATE, createSettingsFormData());

    expect(result.status).toBe("success");
    expect(prismaMock.settings.create).toHaveBeenCalled();
    expect(prismaMock.settings.update).not.toHaveBeenCalled();
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });
});
