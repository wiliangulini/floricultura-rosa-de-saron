import { describe, expect, it } from "vitest";
import { formatCurrencyBRL } from "@/lib/money";

// Intl.NumberFormat usa espaço não-separável (U+00A0) entre R$ e o número.
// Normalizamos para espaço regular antes de comparar.
function normalize(value: string): string {
  return value.replace(/\u00A0/g, " ");
}

describe("formatCurrencyBRL", () => {
  it("formata valor inteiro", () => {
    expect(normalize(formatCurrencyBRL(10))).toBe("R$ 10,00");
  });

  it("formata valor decimal", () => {
    expect(normalize(formatCurrencyBRL(9.99))).toBe("R$ 9,99");
  });

  it("formata zero", () => {
    expect(normalize(formatCurrencyBRL(0))).toBe("R$ 0,00");
  });

  it("formata valor grande com separador de milhar", () => {
    expect(normalize(formatCurrencyBRL(1234.56))).toBe("R$ 1.234,56");
  });

  it("sempre inclui o símbolo R$", () => {
    expect(formatCurrencyBRL(99)).toContain("R$");
  });

  it("usa vírgula como separador decimal", () => {
    expect(formatCurrencyBRL(1.5)).toContain(",");
  });

  it("formata decimal pequeno", () => {
    expect(normalize(formatCurrencyBRL(0.5))).toBe("R$ 0,50");
  });
});
