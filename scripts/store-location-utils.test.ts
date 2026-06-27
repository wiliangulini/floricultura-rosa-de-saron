import { describe, expect, it } from "vitest";

import {
  getStoreLocationUpdate,
  replaceLegacyCity,
  shouldApplyStoreLocationUpdate,
} from "./store-location-utils";

describe("shouldApplyStoreLocationUpdate", () => {
  it("mantém dry-run por padrão e aceita somente --apply", () => {
    expect(shouldApplyStoreLocationUpdate([])).toBe(false);
    expect(shouldApplyStoreLocationUpdate(["--apply"])).toBe(true);
    expect(() => shouldApplyStoreLocationUpdate(["--force"])).toThrow(
      "Argumento não reconhecido",
    );
  });
});

describe("getStoreLocationUpdate", () => {
  it("corrige localização e textos relacionados sem apagar conteúdo personalizado", () => {
    expect(
      getStoreLocationUpdate({
        city: "Pato Branco",
        deliveryDescription: "Entregas em Pato Branco sob consulta.",
        seoDefaultDescription: "Flores em Pato Branco.",
        seoDefaultTitle: "Floricultura em Pato Branco",
        state: "PR",
      }),
    ).toEqual({
      city: "Coronel Vivida",
      deliveryDescription: "Entregas em Coronel Vivida sob consulta.",
      seoDefaultDescription: "Flores em Coronel Vivida.",
      seoDefaultTitle: "Floricultura em Coronel Vivida",
    });
  });

  it("é idempotente quando os dados já estão corretos", () => {
    expect(
      getStoreLocationUpdate({
        city: "Coronel Vivida",
        deliveryDescription: "Entregas em Coronel Vivida.",
        seoDefaultDescription: "Flores em Coronel Vivida.",
        seoDefaultTitle: "Floricultura em Coronel Vivida",
        state: "PR",
      }),
    ).toEqual({});
  });

  it("rejeita cidade inesperada", () => {
    expect(() =>
      getStoreLocationUpdate({
        city: "Outra cidade",
        deliveryDescription: null,
        seoDefaultDescription: null,
        seoDefaultTitle: null,
        state: "PR",
      }),
    ).toThrow("Cidade inesperada");
  });
});

describe("replaceLegacyCity", () => {
  it("preserva valores nulos e textos sem a cidade antiga", () => {
    expect(replaceLegacyCity(null)).toBeNull();
    expect(replaceLegacyCity("Texto personalizado")).toBe("Texto personalizado");
  });
});

