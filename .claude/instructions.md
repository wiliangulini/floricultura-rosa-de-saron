# Instruções operacionais do Claude Code

A hierarquia de instruções, o padrão de trabalho e o protocolo de entrega vivem em
`AGENTS.md` (importado junto com este arquivo). Aqui ficam apenas os pontos que **não**
estão lá nem em `CLAUDE.md`.

## Contexto fixo

O projeto é uma vitrine digital da Floricultura Rosa de Saron com Next.js App Router,
React, TypeScript estrito, Tailwind CSS, Prisma/PostgreSQL, Vitest e Playwright.

Fluxos críticos e onde vivem:

- carrinho em `localStorage` — `src/lib/cart.ts`, `src/context/CartContext.tsx`;
- mensagem e redirecionamento para WhatsApp — `src/lib/whatsapp.ts`;
- SEO local e páginas públicas — `src/app/(public)/**`, `sitemap.ts`, `robots.ts`;
- painel e autenticação administrativa customizada — `src/lib/auth.ts`, `src/app/admin/**`;
- proteção de rotas em `src/proxy.ts`;
- upload validado para Cloudinary — `src/server/images.ts`;
- performance e usabilidade mobile.

## Proibições específicas do Claude Code

- Não altere `src/proxy.ts`, autenticação, Prisma, APIs, SEO, carrinho ou WhatsApp sem
  autorização explícita na tarefa.
- Não altere `.codex/` ou `CODEX.md` salvo quando isso fizer parte do escopo.
- Não exponha dados sensíveis em respostas, comandos, logs ou relatórios.
- Não implemente com base apenas em nomes de arquivos, memória ou suposições.

## Permissões compartilhadas

`.claude/settings.json` (escopo do projeto):

- **libera** Git de leitura e os scripts de `lint`, `typecheck`, `build` e teste unitário;
- **exige confirmação** para Git mutável, instalação, `npx`, E2E e todos os scripts `db:*`,
  incluindo os `:apply`, que gravam no banco;
- **bloqueia** arquivos reais de ambiente e credenciais, remoção de arquivos, push, acesso
  remoto (`ssh`/`scp`/`rsync`/`curl`/`wget`), acesso direto a banco, `deploy-to-vps.sh`,
  Vercel, `prisma migrate reset`/`db push` e execução inline via `node -e`/`python -c`;
- **preserva** a leitura de `.env.example`, que só documenta os nomes das variáveis.

Regras `deny` vencem `ask`, que vence `allow` — `deny` não admite exceção por allowlist.
Os caminhos usam o prefixo `/`, que ancora na **raiz do projeto**: as proteções valem
mesmo em sessões iniciadas em subpasta ou worktree.

Duas ressalvas importantes:

- regras `Read`/`Edit` **não** alcançam subprocessos arbitrários (um script Node ou Python
  que abre arquivos por conta própria). Só o sandbox do sistema operacional faria isso;
- `allowed-tools` em um command ou skill **concede** permissão durante o turno — não
  restringe. Trate qualquer `allowed-tools` como ampliação de privilégio.

As permissões reduzem risco, mas não substituem revisão humana nem as regras deste
repositório.
