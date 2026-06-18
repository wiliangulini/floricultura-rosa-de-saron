type EnvLike = Record<string, string | undefined>;

type DatabaseIdentity = {
  protocol: string;
  hostname: string;
  port: string;
  database: string;
  schema: string;
};

const MIN_ADMIN_PASSWORD_LENGTH = 12;

function normalizeProtocol(protocol: string): string {
  const value = protocol.replace(/:$/, "").toLowerCase();
  if (value === "postgres") return "postgresql";
  return value;
}

function defaultPortFor(protocol: string): string {
  if (protocol === "postgresql") return "5432";
  return "";
}

export function getAdminInitialPassword(env: EnvLike = process.env): string {
  const password = env.ADMIN_INITIAL_PASSWORD;

  if (!password || password.trim().length === 0) {
    throw new Error(
      "ADMIN_INITIAL_PASSWORD não definida. Configure esta variável antes de criar o admin pela primeira vez."
    );
  }

  if (password.length < MIN_ADMIN_PASSWORD_LENGTH) {
    throw new Error(
      `ADMIN_INITIAL_PASSWORD deve ter no mínimo ${MIN_ADMIN_PASSWORD_LENGTH} caracteres (atual: ${password.length}).`
    );
  }

  return password;
}

export function parseDatabaseIdentity(rawUrl: string): DatabaseIdentity {
  let parsed: URL;

  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("URL de banco malformada.");
  }

  const protocol = normalizeProtocol(parsed.protocol);
  const hostname = parsed.hostname.toLowerCase();
  const port = parsed.port || defaultPortFor(protocol);
  const database = decodeURIComponent(parsed.pathname.replace(/^\/+/, "")).toLowerCase();
  const schema = (parsed.searchParams.get("schema") || "public").toLowerCase();

  if (!protocol) {
    throw new Error("URL de banco sem protocolo.");
  }

  if (!hostname) {
    throw new Error("URL de banco sem host.");
  }

  if (!database) {
    throw new Error("URL de banco sem nome do database.");
  }

  return { protocol, hostname, port, database, schema };
}

export function isSameDatabaseUrl(firstUrl: string, secondUrl: string): boolean {
  const first = parseDatabaseIdentity(firstUrl);
  const second = parseDatabaseIdentity(secondUrl);

  return (
    first.protocol === second.protocol &&
    first.hostname === second.hostname &&
    first.port === second.port &&
    first.database === second.database &&
    first.schema === second.schema
  );
}

export function hasE2EDatabaseName(rawUrl: string): boolean {
  const identity = parseDatabaseIdentity(rawUrl);
  return identity.database.includes("e2e") || identity.database.includes("test");
}

export function getE2EDatabaseUrl(env: EnvLike = process.env): string {
  const e2eUrl = env.DATABASE_URL_E2E;

  if (!e2eUrl || e2eUrl.trim().length === 0) {
    throw new Error(
      "DATABASE_URL_E2E não definida. Configure esta variável separada de DATABASE_URL antes de rodar seeds ou testes E2E."
    );
  }

  // Valida formato antes de qualquer outra verificação.
  // E2E_DB_CONFIRMED=true não dispensa URL bem formada.
  parseDatabaseIdentity(e2eUrl);

  if (env.DATABASE_URL && env.DATABASE_URL.trim().length > 0) {
    if (isSameDatabaseUrl(e2eUrl, env.DATABASE_URL)) {
      throw new Error(
        "DATABASE_URL_E2E aponta para o mesmo banco físico de DATABASE_URL. " +
          "Configure um banco PostgreSQL separado para testes E2E."
      );
    }
  }

  if (!hasE2EDatabaseName(e2eUrl)) {
    if (env.E2E_DB_CONFIRMED === "true") {
      return e2eUrl;
    }

    throw new Error(
      "DATABASE_URL_E2E não parece ser um banco de teste/e2e. " +
        "O nome do banco deve conter 'e2e' ou 'test'. " +
        "Para ignorar apenas esta regra de nome, defina E2E_DB_CONFIRMED=true. " +
        "Mesmo com override, a URL precisa ser válida e diferente de DATABASE_URL."
    );
  }

  return e2eUrl;
}
