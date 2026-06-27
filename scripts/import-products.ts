import "dotenv/config";

import { readFile } from "fs/promises";
import path from "path";

import { PrismaPg } from "@prisma/adapter-pg";
import { PriceType, PrismaClient } from "@prisma/client";

import {
  productCatalog,
  productCatalogImageRecords,
  type ProductCatalogItem,
} from "../prisma/product-catalog";
import {
  ProductImageUploadError,
  uploadProductImage,
  validateProductImageFile,
} from "../src/server/images";
import {
  buildExistingUrlBySource,
  getSourcesRequiringUpload,
  normalizeCatalogPrice,
  shouldApplyProductImport,
} from "./import-products-utils";

type ExistingProduct = {
  categoryId: string;
  description: string | null;
  name: string;
  price: { toString(): string } | null;
  priceType: PriceType;
  seoDescription: string | null;
  seoTitle: string | null;
  shortDescription: string | null;
  slug: string;
};

const catalogCategorySlugs = [...new Set(productCatalog.map((product) => product.categorySlug))];

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL não definida. Configure a variável antes de importar os produtos.",
    );
  }

  return databaseUrl;
}

function getImageMimeType(sourcePath: string): string {
  const extension = path.extname(sourcePath).toLowerCase();

  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";

  return "application/octet-stream";
}

async function createImageFile(sourcePath: string): Promise<File> {
  const absolutePath = path.resolve(sourcePath);
  const contents = await readFile(absolutePath);

  return new File([new Uint8Array(contents)], path.basename(sourcePath), {
    type: getImageMimeType(sourcePath),
  });
}

async function validateCatalogFiles(): Promise<void> {
  const sourcePaths = [
    ...new Set(productCatalogImageRecords.map((image) => image.sourcePath)),
  ];

  for (const sourcePath of sourcePaths) {
    try {
      const file = await createImageFile(sourcePath);
      await validateProductImageFile(file);
    } catch (error) {
      if (error instanceof ProductImageUploadError) {
        throw new Error(`Imagem inválida em ${sourcePath}: ${error.message}`);
      }

      throw new Error(`Não foi possível validar ${sourcePath}.`, { cause: error });
    }
  }
}

function hasProductChanges(
  existing: ExistingProduct,
  product: ProductCatalogItem,
  categoryId: string,
): boolean {
  return (
    existing.categoryId !== categoryId ||
    existing.name !== product.name ||
    existing.shortDescription !== product.shortDescription ||
    existing.description !== product.description ||
    normalizeCatalogPrice(existing.price) !== product.price ||
    existing.priceType !== PriceType.FIXED ||
    existing.seoTitle !== product.seoTitle ||
    existing.seoDescription !== product.seoDescription
  );
}

function printCatalogTable(): void {
  console.table(
    productCatalogImageRecords.map((image) => {
      const product = productCatalog.find((item) => item.slug === image.productSlug);

      if (!product) {
        throw new Error(`Produto não encontrado no catálogo: ${image.productSlug}`);
      }

      return {
        arquivo: image.sourcePath,
        produto: product.name,
        slug: product.slug,
        categoria: product.categorySlug,
        preço: product.price,
        ordem: image.sortOrder,
        principal: image.isMain ? "sim" : "não",
      };
    }),
  );
}

async function importProducts(): Promise<void> {
  const applyChanges = shouldApplyProductImport(process.argv.slice(2));

  await validateCatalogFiles();

  const adapter = new PrismaPg(getDatabaseUrl());
  const prisma = new PrismaClient({ adapter });

  try {
    const categories = await prisma.category.findMany({
      where: {
        slug: {
          in: catalogCategorySlugs,
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });
    const categoryIdBySlug = new Map(categories.map((category) => [category.slug, category.id]));
    const missingCategories = catalogCategorySlugs.filter(
      (categorySlug) => !categoryIdBySlug.has(categorySlug),
    );

    if (missingCategories.length > 0) {
      throw new Error(
        `Categorias ausentes no banco: ${missingCategories.join(", ")}. Atualize as categorias antes da importação.`,
      );
    }

    const [existingProducts, existingImages] = await Promise.all([
      prisma.product.findMany({
        where: {
          slug: {
            in: productCatalog.map((product) => product.slug),
          },
        },
        select: {
          categoryId: true,
          description: true,
          name: true,
          price: true,
          priceType: true,
          seoDescription: true,
          seoTitle: true,
          shortDescription: true,
          slug: true,
        },
      }),
      prisma.productImage.findMany({
        where: {
          id: {
            in: productCatalogImageRecords.map((image) => image.id),
          },
        },
        select: {
          id: true,
          url: true,
        },
      }),
    ]);
    const existingProductBySlug = new Map(
      existingProducts.map((product) => [product.slug, product]),
    );
    const existingImageIdSet = new Set(existingImages.map((image) => image.id));
    const sourcesRequiringUpload = getSourcesRequiringUpload(
      productCatalogImageRecords,
      existingImages,
    );

    console.log(applyChanges ? "Aplicando importação de produtos:" : "Diagnóstico de produtos:");
    printCatalogTable();

    for (const product of productCatalog) {
      const existing = existingProductBySlug.get(product.slug);
      const categoryId = categoryIdBySlug.get(product.categorySlug);

      if (!categoryId) {
        throw new Error(`Categoria não encontrada: ${product.categorySlug}`);
      }

      const productStatus = !existing
        ? "CRIAR"
        : hasProductChanges(existing, product, categoryId)
          ? "ATUALIZAR"
          : "SEM ALTERAÇÃO";
      const missingImageCount = product.images.filter(
        (image) =>
          !existingImageIdSet.has(
            productCatalogImageRecords.find(
              (record) =>
                record.productSlug === product.slug &&
                record.sortOrder === image.sortOrder,
            )?.id ?? "",
          ),
      ).length;

      console.log(
        `- [${productStatus}] ${product.name} (${product.slug}); imagens ausentes: ${missingImageCount}`,
      );
    }

    console.log(
      `\nResumo: ${productCatalog.length} produtos, ${productCatalogImageRecords.length} registros ProductImage, ` +
        `${new Set(productCatalogImageRecords.map((image) => image.sourcePath)).size} arquivos locais.`,
    );
    console.log(`Uploads necessários: ${sourcesRequiringUpload.length}.`);

    if (!applyChanges) {
      console.log(
        "\nDry-run concluído. Nenhum dado foi alterado e nenhum upload foi realizado. " +
          "Use --apply somente após revisar este diagnóstico.",
      );
      return;
    }

    const urlBySource = buildExistingUrlBySource(
      productCatalogImageRecords,
      existingImages,
    );

    for (const product of productCatalog) {
      const categoryId = categoryIdBySlug.get(product.categorySlug);

      if (!categoryId) {
        throw new Error(`Categoria não encontrada: ${product.categorySlug}`);
      }

      for (const image of product.images) {
        if (urlBySource.has(image.sourcePath)) {
          continue;
        }

        const file = await createImageFile(image.sourcePath);
        const uploadedImage = await uploadProductImage({
          file,
          productName: product.name,
          productSlug: product.slug,
        });
        urlBySource.set(image.sourcePath, uploadedImage.url);
        console.log(`✔ Upload concluído: ${image.sourcePath}`);
      }

      await prisma.$transaction(async (transaction) => {
        const savedProduct = await transaction.product.upsert({
          where: {
            slug: product.slug,
          },
          update: {
            categoryId,
            description: product.description,
            name: product.name,
            price: product.price,
            priceType: PriceType.FIXED,
            seoDescription: product.seoDescription,
            seoTitle: product.seoTitle,
            shortDescription: product.shortDescription,
          },
          create: {
            active: true,
            available: true,
            categoryId,
            description: product.description,
            featured: false,
            name: product.name,
            price: product.price,
            priceType: PriceType.FIXED,
            seasonal: false,
            seoDescription: product.seoDescription,
            seoTitle: product.seoTitle,
            shortDescription: product.shortDescription,
            slug: product.slug,
          },
          select: {
            id: true,
          },
        });
        const mainImage = productCatalogImageRecords.find(
          (image) => image.productSlug === product.slug && image.isMain,
        );

        if (!mainImage) {
          throw new Error(`Imagem principal ausente para ${product.slug}`);
        }

        await transaction.productImage.updateMany({
          where: {
            id: {
              not: mainImage.id,
            },
            isMain: true,
            productId: savedProduct.id,
          },
          data: {
            isMain: false,
          },
        });

        for (const image of product.images) {
          const imageRecord = productCatalogImageRecords.find(
            (record) =>
              record.productSlug === product.slug &&
              record.sortOrder === image.sortOrder,
          );
          const imageUrl = urlBySource.get(image.sourcePath);

          if (!imageRecord || !imageUrl) {
            throw new Error(`URL ou registro ausente para ${image.sourcePath}`);
          }

          await transaction.productImage.upsert({
            where: {
              id: imageRecord.id,
            },
            update: {
              altText: image.altText,
              isMain: image.isMain,
              productId: savedProduct.id,
              sortOrder: image.sortOrder,
              url: imageUrl,
            },
            create: {
              altText: image.altText,
              id: imageRecord.id,
              isMain: image.isMain,
              productId: savedProduct.id,
              sortOrder: image.sortOrder,
              url: imageUrl,
            },
          });
        }
      });

      console.log(`✔ Produto importado: ${product.name} (${product.slug})`);
    }

    console.log("\nImportação concluída com sucesso.");
  } finally {
    await prisma.$disconnect();
  }
}

importProducts().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
