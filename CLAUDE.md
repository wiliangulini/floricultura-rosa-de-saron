# CLAUDE.md

Leia e siga obrigatoriamente:

- `PROJECT_RULES.md`
- `AGENTS.md`
- `.claude/instructions.md`

Leia `CODEX.md` quando a tarefa envolver continuidade, revisão ou compatibilidade com Codex.

## Como trabalhar neste projeto com Claude Code

Este projeto deve ser tratado como um MVP real de cliente, com prioridade em:

- simplicidade;
- segurança;
- SEO local;
- UX mobile;
- código tipado;
- manutenibilidade;
- baixo overengineering.

## Regras para planejamento

Antes de implementar qualquer alteração relevante:

1. Leia os arquivos relacionados ao fluxo.
2. Explique o impacto da alteração.
3. Liste arquivos que serão alterados.
4. Justifique tecnicamente a solução.
5. Evite mudanças fora do escopo.

## Regras para implementação

- Faça a menor alteração correta.
- Preserve o padrão existente do projeto.
- Não crie arquitetura nova sem necessidade.
- Não misture feature, refatoração e correção de bug na mesma alteração sem motivo.
- Não altere autenticação customizada, `src/proxy.ts` ou schema Prisma sem autorização e análise de impacto.
- Não altere SEO sem validar metadata, canonical, sitemap e dados estruturados quando aplicável.
- Preserve o carrinho em `localStorage`, a montagem da mensagem do WhatsApp e a separação entre área pública e administrativa.
- Preserve Next.js App Router, TypeScript estrito, Tailwind CSS v4, Prisma 7 com PostgreSQL, Vitest e Playwright.
- Não adicione dependências nem execute migrations sem autorização explícita.

## Comandos do projeto

Os comandos em `.claude/commands/` são atalhos específicos do Claude Code:

- `/create-code`, `/review-code`, `/refactor-code`, `/architecture-decision` e `/debug-app`;
- `/continue-from-codex`, `/final-audit` e `/checklist-merge`;
- `/melhorar-ui-ux`, `/revisar-performance` e `/revisar-seguranca`.

## Skills do projeto

Use as skills em `.claude/skills/` somente quando o workflow correspondente for necessário:

- `senior-code-agent`;
- `senior-code-review`;
- `safe-refactor`;
- `legacy-code-audit`;
- `architecture-review`;
- `implementation-planning`.

Skills e comandos não ampliam o escopo autorizado pela tarefa.

## Compatibilidade com Codex

- Preserve `CODEX.md` e `.codex/`.
- Não desfaça alteração válida do Codex sem evidência no código ou no Git.
- Use o estado real do repositório como fonte de verdade quando houver divergência com um relatório anterior.
- Registre decisões, validações e próximo passo para permitir continuidade sem retrabalho.

## Regras para revisão final

Ao finalizar, responda com:

1. O que foi alterado.
2. Arquivos alterados.
3. Comandos executados.
4. Resultado de lint/build/testes.
5. Riscos remanescentes.
6. Pontos que precisam de validação manual.

Quando for necessário um relatório persistente, use `docs/ai-reports/TEMPLATE-agent-report.md`.
