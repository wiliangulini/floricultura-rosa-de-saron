import { describe, expect, it } from "vitest";

import { formatPhoneForDisplay } from "./format-phone";

describe("formatPhoneForDisplay", () => {
  it("formata celular com código do país", () => {
    expect(formatPhoneForDisplay("5546999197294")).toBe("(46) 99919-7294");
  });

  it("formata celular sem código do país", () => {
    expect(formatPhoneForDisplay("46999197294")).toBe("(46) 99919-7294");
  });

  it("formata telefone fixo com 10 dígitos", () => {
    expect(formatPhoneForDisplay("4632221111")).toBe("(46) 3222-1111");
  });

  it("mantém valor original quando não reconhecido", () => {
    expect(formatPhoneForDisplay("0800 123")).toBe("0800 123");
  });

  it("retorna null para valores vazios", () => {
    expect(formatPhoneForDisplay(null)).toBeNull();
    expect(formatPhoneForDisplay(undefined)).toBeNull();
    expect(formatPhoneForDisplay("   ")).toBeNull();
  });
});
