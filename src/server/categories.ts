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
