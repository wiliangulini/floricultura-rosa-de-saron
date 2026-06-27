import { describe, expect, it } from "vitest";

import {
  getLegacyProductSlugsToRemove,
  LEGACY_DEMO_PRODUCT_SLUGS,
  shouldApplyLegacyProductRemoval,
} from "./remove-legacy-products-utils";

describe("shouldApplyLegacyProductRemoval", () => {
  it("mantém dry-run por padrão e aceita somente --apply", () => {
    expect(shouldApplyLegacyProductRemoval([])).toBe(false);
    expect(shouldApplyLegacyProductRemoval(["--apply"])).toBe(true);
    expect(() => shouldApplyLegacyProductRemoval(["--all"])).toThrow(
      "Argumento não reconhecido",
    );
  });
});

describe("getLegacyProductSlugsToRemove", () => {
  it("seleciona somente os quatro slugs demonstrativos conhecidos", () => {
    expect(
      getLegacyProductSlugsToRemove([
        "produto-criado-no-admin",
        ...LEGACY_DEMO_PRODUCT_SLUGS,
      ]),
    ).toEqual(LEGACY_DEMO_PRODUCT_SLUGS);
  });

  it("preserva produtos externos ao catálogo", () => {
    expect(getLegacyProductSlugsToRemove(["produto-criado-no-admin"])).toEqual([]);
  });
});

