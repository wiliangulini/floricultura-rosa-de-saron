import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { categoryCatalog } from "../prisma/category-catalog";
import {
  productCatalog,
  productCatalogImageRecords,
} from "../prisma/product-catalog";
import { LEGACY_DEMO_PRODUCT_SLUGS } from "./remove-legacy-products-utils";
import { LEGACY_CITY, STORE_CITY, STORE_STATE } from "./store-location-utils";

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL não definida. Configure a variável antes de verificar o catálogo.",
    );
  }

  return databaseUrl;
}

function getMissingValues(expected: readonly string[], existing: readonly string[]): string[] {
  const existingValues = new Set(existing);

  return expected.filter((value) => !existingValues.has(value));
}

async function verifyStoreCatalog(): Promise<void> {
  const adapter = new PrismaPg(getDatabaseUrl());
  const prisma = new PrismaClient({ adapter });

  try {
    const [
      settingsRecords,
      managedCategories,
      managedProducts,
      managedImages,
      legacyProducts,
      productsWithLegacySeo,
      totalCategories,
      totalProducts,
      totalImages,
    ] = await Promise.all([
      prisma.settings.findMany({
        orderBy: {
          createdAt: "asc",
        },
        select: {
          city: true,
          seoDefaultDescription: true,
          seoDefaultTitle: true,
          state: true,
        },
      }),
      prisma.category.findMany({
        select: {
          slug: true,
        },
        where: {
          slug: {
            in: categoryCatalog.map((category) => category.slug),
          },
        },
      }),
      prisma.product.findMany({
        select: {
          slug: true,
        },
        where: {
          slug: {
            in: productCatalog.map((product) => product.slug),
          },
        },
      }),
      prisma.productImage.findMany({
        select: {
          id: true,
        },
        where: {
          id: {
            in: productCatalogImageRecords.map((image) => image.id),
          },
        },
      }),
      prisma.product.findMany({
        select: {
          slug: true,
        },
        where: {
          slug: {
            in: [...LEGACY_DEMO_PRODUCT_SLUGS],
          },
        },
      }),
      prisma.product.count({
        where: {
          OR: [
            {
              seoTitle: {
                contains: LEGACY_CITY,
              },
            },
            {
              seoDescription: {
                contains: LEGACY_CITY,
              },
            },
          ],
        },
      }),
      prisma.category.count(),
      prisma.product.count(),
      prisma.productImage.count(),
    ]);

    if (settingsRecords.length !== 1) {
      throw new Error(
        `Esperado exatamente um registro Settings; encontrados: ${settingsRecords.length}.`,
      );
    }

    const settings = settingsRecords[0];
    const missingCategories = getMissingValues(
      categoryCatalog.map((category) => category.slug),
      managedCategories.map((category) => category.slug),
    );
    const missingProducts = getMissingValues(
      productCatalog.map((product) => product.slug),
      managedProducts.map((product) => product.slug),
    );
    const missingImages = getMissingValues(
      productCatalogImageRecords.map((image) => image.id),
      managedImages.map((image) => image.id),
    );
    const settingsSeo = [
      settings?.seoDefaultTitle,
      settings?.seoDefaultDescription,
    ].filter(Boolean).join(" ");

    const errors = [
      settings?.city !== STORE_CITY || settings.state !== STORE_STATE
        ? `Settings deve usar ${STORE_CITY} - ${STORE_STATE}.`
        : null,
      settingsSeo.includes(LEGACY_CITY)
        ? `Settings ainda contém ${LEGACY_CITY} nos metadados.`
        : null,
      missingCategories.length > 0
        ? `Categorias gerenciadas ausentes: ${missingCategories.join(", ")}.`
        : null,
      missingProducts.length > 0
        ? `Produtos gerenciados ausentes: ${missingProducts.join(", ")}.`
        : null,
      missingImages.length > 0
        ? `Imagens gerenciadas ausentes: ${missingImages.join(", ")}.`
        : null,
      legacyProducts.length > 0
        ? `Produtos demonstrativos ainda presentes: ${legacyProducts
            .map((product) => product.slug)
            .join(", ")}.`
        : null,
      productsWithLegacySeo > 0
        ? `${productsWithLegacySeo} produto(s) ainda contêm ${LEGACY_CITY} no SEO.`
        : null,
    ].filter((error): error is string => Boolean(error));

    console.log("Verificação do catálogo:");
    console.log(
      `- Gerenciados: ${managedCategories.length} categorias, ` +
        `${managedProducts.length} produtos, ${managedImages.length} imagens.`,
    );
    console.log(
      `- Totais preservados: ${totalCategories} categorias, ` +
        `${totalProducts} produtos, ${totalImages} imagens.`,
    );
    console.log(`- Localização: ${settings?.city ?? "(vazia)"} - ${settings?.state ?? "(vazio)"}.`);

    if (errors.length > 0) {
      throw new Error(`Verificação falhou:\n- ${errors.join("\n- ")}`);
    }

    console.log("Catálogo e localização verificados com sucesso.");
  } finally {
    await prisma.$disconnect();
  }
}

verifyStoreCatalog().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});

