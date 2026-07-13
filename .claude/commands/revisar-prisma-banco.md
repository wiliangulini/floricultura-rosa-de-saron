---
description: Revisa schema, migrations e seed do Prisma sem alterar banco ou implementação.
argument-hint: "[escopo Prisma/banco a revisar]"
disable-model-invocation: true
---

# Comando: revisar-prisma-banco

Escopo: $ARGUMENTS

## Modo

Revisão somente leitura. Não execute migration, seed, reset, deploy nem escreva no banco
ou na implementação.

## Leitura obrigatória

1. Leia `PROJECT_RULES.md` (§2, §3) e `.claude/rules/prisma-database.md`.
2. Leia `prisma/schema.prisma`, migrations relevantes, `prisma/seed*.ts` e os arquivos de
   `src/server/**` que consomem o Prisma Client.

## Checklist especializado

- Coerência do schema, tipos, enums (`UserRole`, `PriceType`) e relações.
- Políticas `onDelete` e risco de perda de dados ou registros órfãos.
- `Settings` mantém exatamente um registro; nenhuma alteração cria caminho para duplicar.
- Constraints, unicidade (slugs) e nulabilidade coerentes com o domínio.
- Migrations pequenas, ordenadas e não reescritas após aplicadas.
- Seed idempotente, sem senha real hard-coded, restrito ao ambiente correto
  (`DATABASE_URL_E2E` isolado para Playwright).
- A URL do banco está apenas em `prisma.config.ts`, nunca em `datasource` no schema.

## Saída

Classifique achados como bloqueador, alto, médio, baixo ou observação. Cite arquivo/linha,
risco para dados, evidência e correção mínima. Diferencie análise estática de comandos
realmente executados. Nunca recomende `prisma migrate reset` como correção automática.
