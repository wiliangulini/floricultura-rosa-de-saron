import { describe, expect, it } from "vitest";
import { slugify } from "@/lib/slug";

describe("slugify", () => {
  it("converte para minúsculas", () => {
    expect(slugify("ROSA")).toBe("rosa");
  });

  it("remove acentos", () => {
    expect(slugify("Rosas Vermelhas")).toBe("rosas-vermelhas");
  });

  it("converte cedilha", () => {
    expect(slugify("Buquê de Noiva")).toBe("buque-de-noiva");
  });

  it("converte ç para c", () => {
    expect(slugify("Arranjo de Flores Graciosas")).toBe("arranjo-de-flores-graciosas");
    expect(slugify("Crisântemo")).toBe("crisantemo");
  });

  it("substitui múltiplos espaços por um hífen", () => {
    expect(slugify("rosa  branca")).toBe("rosa-branca");
  });

  it("remove caracteres especiais", () => {
    expect(slugify("amor & flores!")).toBe("amor-flores");
  });

  it("remove hífens duplicados", () => {
    expect(slugify("rosa--branca")).toBe("rosa-branca");
  });

  it("remove espaços nas bordas", () => {
    expect(slugify("  rosa  ")).toBe("rosa");
  });

  it("não altera nome já limpo", () => {
    expect(slugify("cravos")).toBe("cravos");
  });

  it("lida com nome composto com acento e cedilha juntos", () => {
    expect(slugify("Lírios e Orquídeas")).toBe("lirios-e-orquideas");
  });

  it("preserva hífen simples já existente", () => {
    expect(slugify("rosa-branca")).toBe("rosa-branca");
  });
});
