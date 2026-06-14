"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_SESSION_COOKIE, readAdminSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";

type CategoryFieldErrors = {
  name?: string;
  sortOrder?: string;
};

export type CategoryActionState = {
  fieldErrors: CategoryFieldErrors;
  message: string;
  status: "idle" | "error";
};

type ValidatedCategoryData = {
  active: boolean;
  description: string | null;
  name: string;
  slug: string;
  sortOrder: number;
};

const duplicateCategoryMessage = "Já existe uma categoria com esse nome.";

async function requireAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const session = await readAdminSessionCookie(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) {
    redirect("/admin/login");
  }
}

export async function createCategory(
  _previousState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  await requireAdminSession();

  const validation = validateCategoryForm(formData);

  if (!validation.data) {
    return validation.state;
  }

  const existingCategory = await prisma.category.findUnique({
    select: {
      id: true,
    },
    where: {
      slug: validation.data.slug,
    },
  });

  if (existingCategory) {
    return createDuplicateSlugState();
  }

  try {
    await prisma.category.create({
      data: validation.data,
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return createDuplicateSlugState();
    }

    throw error;
  }

  revalidateCategoryPaths([validation.data.slug]);
  redirect("/admin/categorias?resultado=categoria-criada");
}

export async function updateCategory(
  categoryId: string,
  _previousState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  await requireAdminSession();

  const validation = validateCategoryForm(formData);

  if (!validation.data) {
    return validation.state;
  }

  const currentCategory = await prisma.category.findUnique({
    select: {
      id: true,
      slug: true,
    },
    where: {
      id: categoryId,
    },
  });

  if (!currentCategory) {
    return {
      fieldErrors: {},
      message: "Categoria não encontrada. Volte para a lista e tente novamente.",
      status: "error",
    };
  }

  const categoryWithSameSlug = await prisma.category.findUnique({
    select: {
      id: true,
    },
    where: {
      slug: validation.data.slug,
    },
  });

  if (categoryWithSameSlug && categoryWithSameSlug.id !== currentCategory.id) {
    return createDuplicateSlugState();
  }

  try {
    await prisma.category.update({
      data: validation.data,
      where: {
        id: currentCategory.id,
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return createDuplicateSlugState();
    }

    throw error;
  }

  revalidateCategoryPaths([currentCategory.slug, validation.data.slug]);
  redirect("/admin/categorias?resultado=categoria-atualizada");
}

export async function toggleCategoryActive(formData: FormData): Promise<void> {
  await requireAdminSession();

  const categoryId = getFormValue(formData, "categoryId").trim();

  if (!categoryId) {
    redirect("/admin/categorias?resultado=erro-alternar");
  }

  const category = await prisma.category.findUnique({
    select: {
      active: true,
      slug: true,
    },
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    redirect("/admin/categorias?resultado=erro-alternar");
  }

  const nextActive = !category.active;

  await prisma.category.update({
    data: {
      active: nextActive,
    },
    where: {
      id: categoryId,
    },
  });

  revalidateCategoryPaths([category.slug]);
  redirect(`/admin/categorias?resultado=${nextActive ? "categoria-ativada" : "categoria-desativada"}`);
}

function validateCategoryForm(formData: FormData):
  | {
      data: ValidatedCategoryData;
      state?: never;
    }
  | {
      data?: never;
      state: CategoryActionState;
    } {
  const name = getFormValue(formData, "name").trim();
  const description = getFormValue(formData, "description").trim();
  const sortOrderValue = getFormValue(formData, "sortOrder").trim();
  const fieldErrors: CategoryFieldErrors = {};
  const slug = slugify(name);

  if (!name) {
    fieldErrors.name = "Informe o nome da categoria.";
  } else if (!slug) {
    fieldErrors.name = "Informe um nome com letras ou números.";
  }

  const sortOrder = parseSortOrder(sortOrderValue);

  if (sortOrder === null) {
    fieldErrors.sortOrder = "Informe a ordem de exibição usando um número inteiro.";
  }

  if (Object.keys(fieldErrors).length > 0 || sortOrder === null) {
    return {
      state: {
        fieldErrors,
        message: "Corrija os campos destacados para salvar a categoria.",
        status: "error",
      },
    };
  }

  return {
    data: {
      active: formData.get("active") === "on",
      description: description || null,
      name,
      slug,
      sortOrder,
    },
  };
}

function parseSortOrder(value: string) {
  if (!value) {
    return 0;
  }

  if (!/^-?\d+$/.test(value)) {
    return null;
  }

  const parsedValue = Number.parseInt(value, 10);

  return Number.isSafeInteger(parsedValue) ? parsedValue : null;
}

function createDuplicateSlugState(): CategoryActionState {
  return {
    fieldErrors: {
      name: duplicateCategoryMessage,
    },
    message: "Não foi possível salvar a categoria.",
    status: "error",
  };
}

function getFormValue(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);

  return typeof value === "string" ? value : "";
}

function revalidateCategoryPaths(slugs: string[]) {
  revalidatePath("/admin/categorias");
  revalidatePath("/");
  revalidatePath("/produtos");

  for (const slug of new Set(slugs)) {
    revalidatePath(`/categoria/${slug}`);
  }
}

function isUniqueConstraintError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}
