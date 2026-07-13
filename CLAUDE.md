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

> Moved to [`docs/resources/comandos-do-projeto.md`](docs/resources/comandos-do-projeto.md) — load on demand.

## Skills do projeto

> Moved to [`docs/resources/skills-do-projeto.md`](docs/resources/skills-do-projeto.md) — load on demand.

## Rules do projeto

As rules em `.claude/rules/` são invariantes curtas por domínio, lidas sob demanda por
`paths` (mapa completo em `AGENTS.md`). Elas não substituem `PROJECT_RULES.md`; apenas
apontam para a seção correspondente.

## Compatibilidade com Codex

> Moved to [`docs/areas/compatibilidade-codex.md`](docs/areas/compatibilidade-codex.md) — load on demand.

## Regras para revisão final

Ao finalizar, responda com:

1. O que foi alterado.
2. Arquivos alterados.
3. Comandos executados.
4. Resultado de lint/build/testes.
5. Riscos remanescentes.
6. Pontos que precisam de validação manual.

Quando for necessário um relatório persistente, use `docs/ai-reports/TEMPLATE-agent-report.md`.

<!-- drydocs:index:start -->
## Documentation index

### Areas
- [Compatibilidade com Codex](docs/areas/compatibilidade-codex.md)

### Resources
- [Comandos do projeto](docs/resources/comandos-do-projeto.md)
- [Skills do projeto](docs/resources/skills-do-projeto.md)

### Docs
- [Manual completo das configurações de IA](docs/MANUAL-AGENTES-COMPLETO.md)
- [Manual resumido das configurações de IA](docs/MANUAL-AGENTES-RESUMIDO.md)

### Ai-reports
- [Relatório de tarefa — [NOME]](docs/ai-reports/TEMPLATE-agent-report.md)

<!-- drydocs:index:end -->
