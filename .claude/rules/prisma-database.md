---
paths:
  - "prisma/schema.prisma"
  - "prisma/migrations/**/*"
  - "prisma/seed*.ts"
  - "prisma/seed-utils.ts"
  - "prisma.config.ts"
  - "src/server/**/*"
---

# Regra Claude — Prisma e banco de dados

Derivada de `PROJECT_RULES.md §2` e `§3`. Se esta rule divergir da regra do projeto,
atualize `PROJECT_RULES.md` primeiro. Procedimento, validação e formato de relatório
vivem no protocolo comum (`AGENTS.md`, `PROJECT_RULES.md §12`).

## Invariantes

- Prisma 7: a URL do banco fica exclusivamente em `prisma.config.ts`. Nunca adicione
  `url` no bloco `datasource` do `schema.prisma`.
- O modelo `Settings` deve ter sempre exatamente um registro.
- Migrations pequenas, versionadas e revisáveis; não edite migration já aplicada.
- Nunca rode `prisma migrate reset` sem autorização explícita.
- Seed (`prisma/seed.ts`, `seed.test.ts`, `seed.e2e.ts`) deve ser idempotente e nunca
  conter senha real hard-coded — usar `ADMIN_INITIAL_PASSWORD` via variável de ambiente.
- `DATABASE_URL_E2E` é um banco separado exclusivo para Playwright; nunca rode migration
  destrutiva contra o banco de desenvolvimento/produção para testar E2E.
- Dados do carrinho vindos do cliente são não confiáveis: recalcule/valide no servidor
  antes de persistir qualquer coisa relacionada a pedido.
