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
- Não adicione dependências nem execute migrations sem autorização explícita.

Antes de editar um arquivo, consulte a rule em `.claude/rules/` cujo `paths` casa com o
caminho (mapa completo em `AGENTS.md`, seção "Roteamento por domínio"). As invariantes de
autenticação admin, `src/proxy.ts`, Prisma, SEO, carrinho/WhatsApp e UI mobile vivem nas
rules — não as repita aqui.

## Quando usar Plan Mode

Use Plan Mode antes de editar quando a tarefa:

- afetar mais de um arquivo ou módulo;
- envolver autenticação admin, `src/proxy.ts`, sessão ou permissões;
- envolver Prisma, migrations, seed ou schema;
- envolver SEO local, metadata ou dados estruturados;
- envolver carrinho, checkout ou a mensagem do WhatsApp;
- tiver escopo ambíguo ou risco de regressão.

Para correções triviais, localizadas e de baixo risco, a implementação direta é
permitida após leitura mínima e confirmação do escopo.

## Comandos do projeto

Os comandos em `.claude/commands/` são atalhos específicos do Claude Code:

- `/create-code`, `/review-code`, `/refactor-code`, `/architecture-decision` e `/debug-app`;
- `/continue-from-codex`, `/final-audit` e `/checklist-merge`;
- `/melhorar-ui-ux`, `/revisar-performance` e `/revisar-seguranca`;
- `/implementation-plan` e `/revisar-prisma-banco`.

## Skills do projeto

Use as skills em `.claude/skills/` somente quando o workflow correspondente for necessário:

- `senior-code-agent`;
- `senior-code-review`;
- `safe-refactor`;
- `legacy-code-audit`;
- `architecture-review`;
- `implementation-planning`;
- `seo-ux-review`.

Skills e comandos não ampliam o escopo autorizado pela tarefa.

## Rules do projeto

As rules em `.claude/rules/` são invariantes curtas por domínio, lidas sob demanda por
`paths` (mapa completo em `AGENTS.md`). Elas não substituem `PROJECT_RULES.md`; apenas
apontam para a seção correspondente.

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
