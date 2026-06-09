import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { publicCategorySelect } from "@/server/categories";

const publicProductImageSelect = {
  url: true,
  altText: true,
  isMain: true,
} satisfies Prisma.ProductImageSelect;

const publicProductSelect = {
  name: true,
  slug: true,
  shortDescription: true,
  description: true,
  price: true,
  priceType: true,
  available: true,
  featured: true,
  seasonal: true,
  seoTitle: true,
  seoDescription: true,
  category: {
    select: publicCategorySelect,
  },
  images: {
    select: publicProductImageSelect,
    orderBy: [
      {
        isMain: "desc",
      },
      {
        sortOrder: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  },
} satisfies Prisma.ProductSelect;

type ProductRecord = Prisma.ProductGetPayload<{
  select: typeof publicProductSelect;
}>;

export type PublicProductImage = Prisma.ProductImageGetPayload<{
  select: typeof publicProductImageSelect;
}>;

export type PublicProduct = Omit<ProductRecord, "price" | "images"> & {
  price: string | null;
  images: PublicProductImage[];
  mainImage: PublicProductImage | null;
};

function mapProduct(product: ProductRecord): PublicProduct {
  return {
    ...product,
    price: product.price?.toString() ?? null,
    mainImage: product.images[0] ?? null,
  };
}

export async function getFeaturedProducts(): Promise<PublicProduct[]> {
  const products = await prisma.product.findMany({
    where: {
      active: true,
      featured: true,
      category: {
        active: true,
      },
    },
    select: publicProductSelect,
    orderBy: {
      createdAt: "desc",
    },
  });

  return products.map(mapProduct);
}

export async function getActiveProducts(): Promise<PublicProduct[]> {
  const products = await prisma.product.findMany({
    where: {
      active: true,
      category: {
        active: true,
      },
    },
    select: publicProductSelect,
    orderBy: [
      {
        featured: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  return products.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<PublicProduct | null> {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      active: true,
      category: {
        active: true,
      },
    },
    select: publicProductSelect,
  });

  return product ? mapProduct(product) : null;
}

export async function getProductsByCategorySlug(slug: string): Promise<PublicProduct[]> {
  const products = await prisma.product.findMany({
    where: {
      active: true,
      category: {
        slug,
        active: true,
      },
    },
    select: publicProductSelect,
    orderBy: [
      {
        featured: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  return products.map(mapProduct);
}
