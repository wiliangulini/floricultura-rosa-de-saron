import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";

export const publicCategorySelect = {
  name: true,
  slug: true,
  description: true,
} satisfies Prisma.CategorySelect;

export type PublicCategory = Prisma.CategoryGetPayload<{
  select: typeof publicCategorySelect;
}>;

export const adminCategorySelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  active: true,
  sortOrder: true,
} satisfies Prisma.CategorySelect;

export type AdminCategory = Prisma.CategoryGetPayload<{
  select: typeof adminCategorySelect;
}>;

export async function getActiveCategories(): Promise<PublicCategory[]> {
  return prisma.category.findMany({
    where: {
      active: true,
    },
    select: publicCategorySelect,
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        name: "asc",
      },
    ],
  });
}

export async function getCategoryBySlug(slug: string): Promise<PublicCategory | null> {
  return prisma.category.findFirst({
    where: {
      slug,
      active: true,
    },
    select: publicCategorySelect,
  });
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  return prisma.category.findMany({
    select: adminCategorySelect,
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        name: "asc",
      },
    ],
  });
}

export async function getAdminCategoryById(id: string): Promise<AdminCategory | null> {
  return prisma.category.findUnique({
    where: {
      id,
    },
    select: adminCategorySelect,
  });
}
