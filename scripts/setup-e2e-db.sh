#!/usr/bin/env bash
# scripts/setup-e2e-db.sh
#
# Configura o banco E2E pela primeira vez:
#   1. Cria o banco PostgreSQL, se possível
#   2. Roda migrations Prisma contra DATABASE_URL_E2E
#
# Pré-requisito: DATABASE_URL_E2E configurada em .env ou no ambiente.
# O seed E2E é executado automaticamente pelo global-setup do Playwright.

set -euo pipefail

source .env 2>/dev/null || true

if [ -z "${DATABASE_URL_E2E:-}" ]; then
  echo "ERRO: DATABASE_URL_E2E não definida." >&2
  exit 1
fi

DB_NAME=$(node -e "console.log(new URL('$DATABASE_URL_E2E').pathname.replace(/^\\//, ''))")

if [ -z "$DB_NAME" ]; then
  echo "ERRO: não foi possível extrair o nome do banco de DATABASE_URL_E2E." >&2
  exit 1
fi

echo "Criando banco E2E, se ainda não existir: $DB_NAME"
psql "${DATABASE_URL_E2E%/$DB_NAME*}/postgres" -c "CREATE DATABASE \"$DB_NAME\";" 2>/dev/null || \
  echo "(banco já existe ou usuário sem permissão de CREATE DATABASE — continuando)"

echo "Rodando migrations no banco E2E..."
DATABASE_URL="$DATABASE_URL_E2E" npx prisma migrate deploy

echo "Banco E2E pronto. Execute 'npm run test:e2e' para rodar os testes."
