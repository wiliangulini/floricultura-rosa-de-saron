import { describe, expect, it } from "vitest";

import {
  buildExistingUrlBySource,
  getSourcesRequiringUpload,
  normalizeCatalogPrice,
  shouldApplyProductImport,
} from "./import-products-utils";

const catalogImages = [
  { id: "product-a-0", sourcePath: "image-a.jpeg" },
  { id: "product-b-0", sourcePath: "shared.jpeg" },
  { id: "product-c-0", sourcePath: "shared.jpeg" },
] as const;

describe("shouldApplyProductImport", () => {
  it("mantém dry-run como padrão e aceita somente --apply", () => {
    expect(shouldApplyProductImport([])).toBe(false);
    expect(shouldApplyProductImport(["--apply"])).toBe(true);
    expect(() => shouldApplyProductImport(["--force"])).toThrow("Argumento não reconhecido");
  });
});

describe("controle idempotente de uploads", () => {
  it("não solicita novo upload para fontes já representadas no banco", () => {
    const existingImages = [
      { id: "product-a-0", url: "https://example.com/a.jpeg" },
      { id: "product-b-0", url: "https://example.com/shared.jpeg" },
    ];

    expect(getSourcesRequiringUpload(catalogImages, existingImages)).toEqual([]);
    expect(buildExistingUrlBySource(catalogImages, existingImages)).toEqual(
      new Map([
        ["image-a.jpeg", "https://example.com/a.jpeg"],
        ["shared.jpeg", "https://example.com/shared.jpeg"],
      ]),
    );
  });

  it("solicita somente uma vez o upload de uma fonte compartilhada ausente", () => {
    expect(getSourcesRequiringUpload(catalogImages, [])).toEqual([
      "image-a.jpeg",
      "shared.jpeg",
    ]);
  });

  it("rejeita URLs divergentes para a mesma fonte compartilhada", () => {
    expect(() =>
      buildExistingUrlBySource(catalogImages, [
        { id: "product-b-0", url: "https://example.com/first.jpeg" },
        { id: "product-c-0", url: "https://example.com/second.jpeg" },
      ]),
    ).toThrow("URLs divergentes");
  });
});

describe("normalizeCatalogPrice", () => {
  it("normaliza decimais do Prisma para duas casas", () => {
    expect(normalizeCatalogPrice({ toString: () => "158" })).toBe("158.00");
    expect(normalizeCatalogPrice({ toString: () => "29.5" })).toBe("29.50");
  });

  it("rejeita valores ausentes ou inválidos", () => {
    expect(normalizeCatalogPrice(null)).toBeNull();
    expect(normalizeCatalogPrice({ toString: () => "inválido" })).toBeNull();
  });
});
