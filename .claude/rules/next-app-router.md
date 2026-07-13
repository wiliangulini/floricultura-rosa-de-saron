---
paths:
  - "src/app/**/*"
  - "src/components/**/*"
  - "src/context/**/*"
---

# Regra Claude — Next.js App Router

Derivada de `PROJECT_RULES.md §3`. Se esta rule divergir da regra do projeto, atualize
`PROJECT_RULES.md` primeiro. Procedimento, validação e formato de relatório vivem no
protocolo comum (`AGENTS.md`, `PROJECT_RULES.md §12`).

## Invariantes

- Pages e layouts são Server Components por padrão.
- Use Client Components (`"use client"`) apenas para estado, event handlers, efeitos ou
  browser APIs (ex.: `localStorage` do carrinho).
- Não importe Prisma nem código de `src/server/**` em Client Components.
- Não exponha segredos via `NEXT_PUBLIC_*`.
- Respeite a separação `src/app/admin/**` (área administrativa) vs. `src/app/(public)/**`
  (área pública) — não misture lógica de uma na outra.
- `src/proxy.ts` é o middleware real do projeto (não `middleware.ts`); não crie um
  `middleware.ts` paralelo.
- Preserve `generateMetadata` e dados estruturados já existentes ao alterar uma página pública.
