import { describe, expect, it } from "vitest";

import {
  getAdminInitialPassword,
  getE2EDatabaseUrl,
  hasE2EDatabaseName,
  isSameDatabaseUrl,
  parseDatabaseIdentity,
} from "./seed-utils";

describe("getAdminInitialPassword", () => {
  it("lança erro se ADMIN_INITIAL_PASSWORD não estiver definida", () => {
    expect(() => getAdminInitialPassword({})).toThrow("ADMIN_INITIAL_PASSWORD não definida");
  });

  it("lança erro se ADMIN_INITIAL_PASSWORD estiver vazia", () => {
    expect(() => getAdminInitialPassword({ ADMIN_INITIAL_PASSWORD: "" })).toThrow(
      "ADMIN_INITIAL_PASSWORD não definida"
    );
  });

  it("lança erro se ADMIN_INITIAL_PASSWORD tiver menos de 12 caracteres", () => {
    expect(() => getAdminInitialPassword({ ADMIN_INITIAL_PASSWORD: "curta1234" })).toThrow(
      "mínimo 12"
    );
  });

  it("aceita senha com exatamente 12 caracteres", () => {
    expect(getAdminInitialPassword({ ADMIN_INITIAL_PASSWORD: "Senh@Forte12" })).toBe(
      "Senh@Forte12"
    );
  });

  it("aceita senha longa", () => {
    expect(
      getAdminInitialPassword({ ADMIN_INITIAL_PASSWORD: "UmaSenhaForteEBoa@2026!" })
    ).toBe("UmaSenhaForteEBoa@2026!");
  });
});

describe("parseDatabaseIdentity", () => {
  it("extrai identidade normalizada do banco", () => {
    expect(
      parseDatabaseIdentity(
        "postgresql://user:pass@LOCALHOST:5432/floricultura_e2e?schema=public"
      )
    ).toEqual({
      protocol: "postgresql",
      hostname: "localhost",
      port: "5432",
      database: "floricultura_e2e",
      schema: "public",
    });
  });

  it("normaliza protocolo postgres para postgresql", () => {
    expect(
      parseDatabaseIdentity("postgres://u:p@localhost/floricultura_e2e").protocol
    ).toBe("postgresql");
  });

  it("lança erro para URL malformada", () => {
    expect(() => parseDatabaseIdentity("not-a-url")).toThrow("URL de banco malformada");
  });

  it("lança erro para URL sem database", () => {
    expect(() => parseDatabaseIdentity("postgresql://u:p@localhost:5432")).toThrow(
      "sem nome do database"
    );
  });
});

describe("isSameDatabaseUrl", () => {
  it("retorna true para mesmo banco físico com credenciais diferentes", () => {
    expect(
      isSameDatabaseUrl(
        "postgresql://user1:pass1@localhost:5432/floricultura_dev?schema=public",
        "postgresql://user2:pass2@localhost:5432/floricultura_dev?schema=public"
      )
    ).toBe(true);
  });

  it("retorna false para bancos diferentes", () => {
    expect(
      isSameDatabaseUrl(
        "postgresql://u:p@localhost:5432/floricultura_dev?schema=public",
        "postgresql://u:p@localhost:5432/floricultura_e2e?schema=public"
      )
    ).toBe(false);
  });

  it("retorna false para schemas diferentes", () => {
    expect(
      isSameDatabaseUrl(
        "postgresql://u:p@localhost:5432/floricultura?schema=public",
        "postgresql://u:p@localhost:5432/floricultura?schema=e2e"
      )
    ).toBe(false);
  });
});

describe("hasE2EDatabaseName", () => {
  it("aceita banco com e2e no nome", () => {
    expect(hasE2EDatabaseName("postgresql://u:p@localhost:5432/floricultura_e2e")).toBe(true);
  });

  it("aceita banco com test no nome", () => {
    expect(hasE2EDatabaseName("postgresql://u:p@localhost:5432/floricultura_test")).toBe(true);
  });

  it("rejeita banco dev no nome", () => {
    expect(hasE2EDatabaseName("postgresql://u:p@localhost:5432/floricultura_dev")).toBe(false);
  });
});

describe("getE2EDatabaseUrl", () => {
  it("lança erro se DATABASE_URL_E2E não estiver definida", () => {
    expect(() => getE2EDatabaseUrl({})).toThrow("DATABASE_URL_E2E não definida");
  });

  it("lança erro se DATABASE_URL_E2E for malformada", () => {
    expect(() => getE2EDatabaseUrl({ DATABASE_URL_E2E: "not-a-url" })).toThrow(
      "URL de banco malformada"
    );
  });

  it("lança erro para URL malformada mesmo com E2E_DB_CONFIRMED=true", () => {
    expect(() =>
      getE2EDatabaseUrl({ DATABASE_URL_E2E: "not-a-url", E2E_DB_CONFIRMED: "true" })
    ).toThrow("URL de banco malformada");
  });

  it("lança erro se DATABASE_URL_E2E apontar para o mesmo banco físico de DATABASE_URL", () => {
    expect(() =>
      getE2EDatabaseUrl({
        DATABASE_URL: "postgresql://user1:pass1@localhost:5432/floricultura_dev?schema=public",
        DATABASE_URL_E2E: "postgresql://user2:pass2@localhost:5432/floricultura_dev?schema=public",
      })
    ).toThrow("mesmo banco físico");
  });

  it("lança erro para mesmo banco físico mesmo com E2E_DB_CONFIRMED=true", () => {
    expect(() =>
      getE2EDatabaseUrl({
        DATABASE_URL: "postgresql://user1:pass1@localhost:5432/floricultura_dev?schema=public",
        DATABASE_URL_E2E: "postgresql://user2:pass2@localhost:5432/floricultura_dev?schema=public",
        E2E_DB_CONFIRMED: "true",
      })
    ).toThrow("mesmo banco físico");
  });

  it("lança erro se banco não parecer e2e/test e não houver override", () => {
    expect(() =>
      getE2EDatabaseUrl({
        DATABASE_URL_E2E: "postgresql://u:p@localhost:5432/floricultura_dev?schema=public",
      })
    ).toThrow("não parece ser um banco de teste/e2e");
  });

  it("aceita banco sem e2e/test no nome se houver override e for diferente de DATABASE_URL", () => {
    const url = "postgresql://u:p@localhost:5432/floricultura_ci?schema=public";
    expect(
      getE2EDatabaseUrl({
        DATABASE_URL: "postgresql://u:p@localhost:5432/floricultura_dev?schema=public",
        DATABASE_URL_E2E: url,
        E2E_DB_CONFIRMED: "true",
      })
    ).toBe(url);
  });

  it("retorna URL válida de banco E2E", () => {
    const url = "postgresql://u:p@localhost:5432/floricultura_e2e?schema=public";
    expect(
      getE2EDatabaseUrl({
        DATABASE_URL: "postgresql://u:p@localhost:5432/floricultura_dev?schema=public",
        DATABASE_URL_E2E: url,
      })
    ).toBe(url);
  });
});
