import { beforeEach, describe, expect, it, vi } from "vitest";

const { redirectMock, revalidatePathMock, prismaMock } = vi.hoisted(() => {
  const prismaMock = {
    category: {
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

import { deleteCategory } from "./actions";

const initialState = { status: "idle" as const, message: "" };

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    fd.append(key, value);
  }
  return fd;
}

describe("deleteCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna erro quando ID está vazio", async () => {
    const result = await deleteCategory(initialState, makeFormData({ categoryId: "" }));
    expect(result).toEqual({ status: "error", message: "ID da categoria inválido." });
    expect(prismaMock.category.findUnique).not.toHaveBeenCalled();
  });

  it("retorna erro quando categoria não é encontrada no banco", async () => {
    prismaMock.category.findUnique.mockResolvedValue(null);
    const result = await deleteCategory(initialState, makeFormData({ categoryId: "cat-1" }));
    expect(result).toEqual({ status: "error", message: "Categoria não encontrada." });
    expect(prismaMock.category.delete).not.toHaveBeenCalled();
  });

  it("retorna erro com contagem quando categoria possui produtos vinculados", async () => {
    prismaMock.category.findUnique.mockResolvedValue({
      slug: "flores",
      _count: { products: 3 },
    });
    const result = await deleteCategory(initialState, makeFormData({ categoryId: "cat-1" }));
    expect(result).toMatchObject({ status: "error", productCount: 3 });
    expect(result.message).toContain("3 produto(s)");
    expect(prismaMock.category.delete).not.toHaveBeenCalled();
  });

  it("retorna erro P2025 quando categoria foi excluída por concorrência", async () => {
    prismaMock.category.findUnique.mockResolvedValue({
      slug: "flores",
      _count: { products: 0 },
    });
    prismaMock.category.delete.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Record not found", {
        code: "P2025",
        clientVersion: "7.0.0",
      }),
    );
    const result = await deleteCategory(initialState, makeFormData({ categoryId: "cat-1" }));
    expect(result).toEqual({ status: "error", message: "Categoria não encontrada." });
  });

  it("retorna erro P2003 quando produto é adicionado entre a contagem e a exclusão", async () => {
    prismaMock.category.findUnique.mockResolvedValue({
      slug: "flores",
      _count: { products: 0 },
    });
    prismaMock.category.delete.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("FK constraint", {
        code: "P2003",
        clientVersion: "7.0.0",
      }),
    );
    const result = await deleteCategory(initialState, makeFormData({ categoryId: "cat-1" }));
    expect(result).toMatchObject({ status: "error" });
    expect(result.message).toContain("produtos vinculados");
  });

  it("chama revalidatePath e redirect após exclusão bem-sucedida", async () => {
    prismaMock.category.findUnique.mockResolvedValue({
      slug: "flores",
      _count: { products: 0 },
    });
    prismaMock.category.delete.mockResolvedValue({});

    await deleteCategory(initialState, makeFormData({ categoryId: "cat-1" }));

    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/categorias");
    expect(revalidatePathMock).toHaveBeenCalledWith("/categoria/flores");
    expect(redirectMock).toHaveBeenCalledWith("/admin/categorias?resultado=categoria-excluida");
  });

  it("propaga erros não esperados do Prisma", async () => {
    prismaMock.category.findUnique.mockResolvedValue({
      slug: "flores",
      _count: { products: 0 },
    });
    prismaMock.category.delete.mockRejectedValue(new Error("Timeout na conexão"));

    await expect(
      deleteCategory(initialState, makeFormData({ categoryId: "cat-1" })),
    ).rejects.toThrow("Timeout na conexão");
  });
});
