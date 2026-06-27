import { beforeEach, describe, expect, it, vi } from "vitest";

const { redirectMock, revalidatePathMock, prismaMock } = vi.hoisted(() => {
  const prismaMock = {
    product: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  };
  return {
    redirectMock: vi.fn(),
    revalidatePathMock: vi.fn(),
    prismaMock,
  };
});

vi.mock("next/navigation", () => ({ redirect: redirectMock }));
vi.mock("next/cache", () => ({ revalidatePath: revalidatePathMock }));
vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue({ value: "session-token" }),
  }),
}));
vi.mock("@/lib/auth", () => ({
  ADMIN_SESSION_COOKIE: "admin_session",
  readAdminSessionCookie: vi.fn().mockResolvedValue({ userId: "user-1" }),
}));
vi.mock("@/lib/db", () => ({ prisma: prismaMock }));

import { Prisma } from "@prisma/client";

import { deleteProduct } from "./actions";

const initialState = { status: "idle" as const, message: "" };

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    fd.append(key, value);
  }
  return fd;
}

describe("deleteProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna erro quando ID está vazio", async () => {
    const result = await deleteProduct(initialState, makeFormData({ productId: "" }));
    expect(result).toEqual({ status: "error", message: "ID do produto inválido." });
    expect(prismaMock.product.findUnique).not.toHaveBeenCalled();
  });

  it("retorna erro quando produto não é encontrado no banco", async () => {
    prismaMock.product.findUnique.mockResolvedValue(null);
    const result = await deleteProduct(initialState, makeFormData({ productId: "prod-1" }));
    expect(result).toEqual({ status: "error", message: "Produto não encontrado." });
    expect(prismaMock.product.delete).not.toHaveBeenCalled();
  });

  it("retorna erro P2025 quando produto foi excluído por concorrência", async () => {
    prismaMock.product.findUnique.mockResolvedValue({
      id: "prod-1",
      slug: "rosa-vermelha",
      active: true,
      featured: false,
      category: { slug: "flores" },
    });
    prismaMock.product.delete.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Record not found", {
        code: "P2025",
        clientVersion: "7.0.0",
      }),
    );
    const result = await deleteProduct(initialState, makeFormData({ productId: "prod-1" }));
    expect(result).toEqual({ status: "error", message: "Produto não encontrado." });
  });

  it("chama revalidatePath e redirect após exclusão bem-sucedida", async () => {
    prismaMock.product.findUnique.mockResolvedValue({
      id: "prod-1",
      slug: "rosa-vermelha",
      active: true,
      featured: false,
      category: { slug: "flores" },
    });
    prismaMock.product.delete.mockResolvedValue({});

    await deleteProduct(initialState, makeFormData({ productId: "prod-1" }));

    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/produtos");
    expect(revalidatePathMock).toHaveBeenCalledWith("/produto/rosa-vermelha");
    expect(revalidatePathMock).toHaveBeenCalledWith("/categoria/flores");
    expect(redirectMock).toHaveBeenCalledWith("/admin/produtos?resultado=produto-excluido");
  });

  it("propaga erros não esperados do Prisma", async () => {
    prismaMock.product.findUnique.mockResolvedValue({
      id: "prod-1",
      slug: "rosa-vermelha",
      active: true,
      featured: false,
      category: { slug: "flores" },
    });
    prismaMock.product.delete.mockRejectedValue(new Error("Conexão perdida"));

    await expect(
      deleteProduct(initialState, makeFormData({ productId: "prod-1" })),
    ).rejects.toThrow("Conexão perdida");
  });
});
