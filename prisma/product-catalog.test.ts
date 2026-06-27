import { readdir } from "fs/promises";
import path from "path";

import { describe, expect, it } from "vitest";

import {
  productCatalog,
  productCatalogImageRecords,
} from "./product-catalog";

const expectedCountsByCategory = {
  buques: { imageRecords: 5, products: 4 },
  "flores-naturais": { imageRecords: 7, products: 7 },
  folhagens: { imageRecords: 6, products: 4 },
  orquideas: { imageRecords: 6, products: 4 },
};

async function listImageFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return listImageFiles(entryPath);
      }

      return [entryPath];
    }),
  );

  return files.flat();
}

describe("productCatalog", () => {
  it("mapeia 19 produtos, 23 arquivos e 24 registros ProductImage", () => {
    expect(productCatalog).toHaveLength(19);
    expect(productCatalogImageRecords).toHaveLength(24);
    expect(new Set(productCatalogImageRecords.map((image) => image.sourcePath))).toHaveLength(23);
  });

  it("mantém as contagens esperadas por categoria", () => {
    for (const [categorySlug, expected] of Object.entries(expectedCountsByCategory)) {
      const products = productCatalog.filter((product) => product.categorySlug === categorySlug);
      const imageRecords = products.flatMap((product) => product.images);

      expect(products).toHaveLength(expected.products);
      expect(imageRecords).toHaveLength(expected.imageRecords);
    }
  });

  it("usa preços fixos válidos e slugs únicos", () => {
    const slugs = productCatalog.map((product) => product.slug);

    expect(new Set(slugs).size).toBe(productCatalog.length);

    for (const product of productCatalog) {
      expect(product.price).toMatch(/^\d+\.\d{2}$/);
      expect(Number(product.price)).toBeGreaterThan(0);
    }
  });

  it("mantém exatamente uma imagem principal por produto", () => {
    for (const product of productCatalog) {
      expect(product.images.filter((image) => image.isMain)).toHaveLength(1);
      expect(product.images[0].isMain).toBe(true);
      expect(product.images.map((image) => image.sortOrder)).toEqual(
        product.images.map((_, index) => index),
      );
    }
  });

  it("agrupa como imagens secundárias os sufixos -1, -2 e (1)", () => {
    const groupedProducts = productCatalog.filter((product) => product.images.length > 1);

    expect(groupedProducts.map((product) => product.slug)).toEqual([
      "buque-6-rosas-vermelhas",
      "bambu-da-sorte-168",
      "orquidea-e-cymbidium-89",
      "orquidea-phap-cascata-110",
    ]);

    for (const product of groupedProducts) {
      expect(product.images.slice(1).every((image) => !image.isMain)).toBe(true);
    }
  });

  it("cria duas opções de Antúrio que compartilham o arquivo de preços 45 e 65", () => {
    const sourcePath =
      "src/assets/images/Categorias/Flores naturais/anturios-sem-cachepo-45-com-cachepo-65.jpeg";
    const products = productCatalog.filter((product) =>
      product.images.some((image) => image.sourcePath === sourcePath),
    );

    expect(products.map((product) => [product.slug, product.price])).toEqual([
      ["anturio-sem-cachepo-45", "45.00"],
      ["anturio-com-cachepo-65", "65.00"],
    ]);
  });

  it("possui IDs determinísticos sem repetição", () => {
    const ids = productCatalogImageRecords.map((image) => image.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("mapeia todos os arquivos reais e somente eles", async () => {
    const imageRoot = path.resolve("src/assets/images/Categorias");
    const actualFiles = (await listImageFiles(imageRoot))
      .map((filePath) => path.relative(process.cwd(), filePath))
      .sort();
    const catalogFiles = [
      ...new Set(productCatalogImageRecords.map((image) => image.sourcePath)),
    ].sort();

    expect(catalogFiles).toEqual(actualFiles);
  });
});
