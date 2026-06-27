# Instruções operacionais do Claude Code

## Fontes de verdade

Leia, nesta ordem:

1. solicitação atual do usuário;
2. `PROJECT_RULES.md`;
3. `AGENTS.md`;
4. `CLAUDE.md`;
5. este arquivo;
6. comando ou skill invocado;
7. código, testes e documentação relacionados.

Leia `CODEX.md` e relatórios anteriores quando houver continuidade com Codex.

## Contexto fixo

O projeto é uma vitrine digital da Floricultura Rosa de Saron com Next.js App Router, React, TypeScript estrito, Tailwind CSS, Prisma/PostgreSQL, Vitest e Playwright.

Fluxos críticos:

- carrinho em `localStorage`;
- mensagem e redirecionamento para WhatsApp;
- SEO local e páginas públicas;
- painel e autenticação administrativa customizada;
- proteção em `src/proxy.ts`;
- upload validado para Cloudinary;
- performance e usabilidade mobile.

## Antes de editar

1. Confirme objetivo, escopo permitido e fora de escopo.
2. Verifique branch, `git status` e alterações preexistentes.
3. Leia os arquivos que pretende alterar e seus consumidores.
4. Identifique contratos, validações e testes que precisam ser preservados.
5. Liste estratégia, arquivos prováveis e riscos antes de mudanças multiarquivo ou sensíveis.

Não implemente com base apenas em nomes de arquivos, memória ou suposições.

## Implementação

- Faça a menor alteração suficiente.
- Preserve App Router, Server/Client Components e padrões existentes.
- Não crie abstração, estado global ou dependência sem necessidade comprovada.
- Não misture feature, correção e refatoração sem justificativa.
- Não altere `src/proxy.ts`, autenticação, Prisma, APIs, SEO, carrinho ou WhatsApp sem autorização explícita.
- Não remova validações, testes ou proteções para fazer uma validação passar.
- Não altere `.codex/` ou `CODEX.md` salvo quando isso fizer parte do escopo.
- Não exponha dados sensíveis em respostas, comandos, logs ou relatórios.

## Permissões compartilhadas

`.claude/settings.json`:

- libera apenas Git de leitura e os scripts seguros de lint, typecheck, build e teste unitário;
- exige confirmação para commit, troca de branch, instalação, `npx`, E2E e comandos Prisma;
- bloqueia arquivos reais de ambiente, credenciais, comandos destrutivos, push, acesso direto a banco e ferramentas remotas;
- preserva a leitura de `.env.example`, que contém somente documentação das variáveis esperadas.

As permissões reduzem risco, mas não substituem revisão humana, sandbox, hooks ou as regras deste repositório.

## Revisão final

1. Revise o diff completo.
2. Confirme que nenhum arquivo fora do escopo mudou.
3. Execute somente validações existentes, seguras e proporcionais à tarefa.
4. Não declare como executado o que não foi executado.
5. Informe arquivos criados/alterados, comandos, resultados, riscos e validações manuais.
6. Use `docs/ai-reports/TEMPLATE-agent-report.md` quando for necessário registrar continuidade.
