import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { publicCategorySelect } from "@/server/categories";

const publicProductImageSelect = {
  url: true,
  altText: true,
  isMain: true,
} satisfies Prisma.ProductImageSelect;

const adminProductImageSelect = {
  id: true,
  url: true,
  altText: true,
  isMain: true,
  sortOrder: true,
} satisfies Prisma.ProductImageSelect;

const publicProductSelect = {
  id: true,
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

const adminProductSelect = {
  id: true,
  categoryId: true,
  name: true,
  slug: true,
  shortDescription: true,
  description: true,
  price: true,
  priceType: true,
  active: true,
  available: true,
  featured: true,
  seasonal: true,
  seoTitle: true,
  seoDescription: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
      active: true,
    },
  },
  images: {
    select: adminProductImageSelect,
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

type PublicProductRecord = Prisma.ProductGetPayload<{
  select: typeof publicProductSelect;
}>;

type AdminProductRecord = Prisma.ProductGetPayload<{
  select: typeof adminProductSelect;
}>;

export type PublicProductImage = Prisma.ProductImageGetPayload<{
  select: typeof publicProductImageSelect;
}>;

export type AdminProductImage = Prisma.ProductImageGetPayload<{
  select: typeof adminProductImageSelect;
}>;

export type PublicProduct = Omit<PublicProductRecord, "price" | "images"> & {
  price: string | null;
  images: PublicProductImage[];
  mainImage: PublicProductImage | null;
};

export type AdminProduct = Omit<AdminProductRecord, "price" | "images"> & {
  price: string | null;
  images: AdminProductImage[];
  mainImage: AdminProductImage | null;
};

function mapPublicProduct(product: PublicProductRecord): PublicProduct {
  return {
    ...product,
    price: product.price?.toString() ?? null,
    mainImage: product.images[0] ?? null,
  };
}

function mapAdminProduct(product: AdminProductRecord): AdminProduct {
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

  return products.map(mapPublicProduct);
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

  return products.map(mapPublicProduct);
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

  return product ? mapPublicProduct(product) : null;
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

  return products.map(mapPublicProduct);
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const products = await prisma.product.findMany({
    select: adminProductSelect,
    orderBy: [
      {
        updatedAt: "desc",
      },
      {
        name: "asc",
      },
    ],
  });

  return products.map(mapAdminProduct);
}

export async function getAdminProductById(id: string): Promise<AdminProduct | null> {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    select: adminProductSelect,
  });

  return product ? mapAdminProduct(product) : null;
}
