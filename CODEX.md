# CODEX.md

## Leitura obrigatória

Antes de implementar, revisar, refatorar ou depurar:

1. Leia `PROJECT_RULES.md`.
2. Leia `AGENTS.md`.
3. Leia `CODEX.md`.
4. Leia `.codex/instructions.md`.
5. Leia arquivos e testes diretamente relacionados à tarefa.
6. Leia `CLAUDE.md` quando houver continuidade ou impacto na configuração do Claude Code.
7. Confirme branch, `git status` e diff existente.

`AGENTS.md` é carregado automaticamente pelo Codex. Os demais documentos são complementares e devem ser lidos conforme esta lista.

## Contexto do projeto

Este é um MVP real da Floricultura Rosa de Saron:

- Next.js 16 App Router e React 19;
- TypeScript 6 com modo estrito;
- Tailwind CSS v4;
- Prisma 7 e PostgreSQL;
- Vitest e Playwright;
- autenticação administrativa customizada protegida por `src/proxy.ts`;
- carrinho local e pedido pelo WhatsApp;
- SEO local e performance mobile como prioridades.

## Forma de trabalho

- Entenda o comportamento atual antes de editar.
- Faça a menor alteração correta e rastreável.
- Preserve contratos, rotas, validações, testes e padrões existentes.
- Não altere runtime, banco, autenticação, SEO, carrinho, WhatsApp ou admin sem autorização explícita.
- Não instale dependências, crie migrations, faça commit, push ou troque de branch sem solicitação.
- Não use `any` sem justificativa explícita.
- Não leia nem exponha arquivos reais de ambiente, tokens, credenciais ou segredos.
- Em revisão ou diagnóstico, não implemente correções salvo quando o pedido também autorizar a alteração.
- Antes de editar por domínio (auth admin, Prisma, SEO local, carrinho/WhatsApp, upload
  Cloudinary, UI mobile), consulte a rule equivalente em `.claude/rules/` — mesma tabela
  de roteamento usada pelo Claude Code, documentada em `AGENTS.md`.

## Compatibilidade com Claude Code

- Preserve `CLAUDE.md`, `.claude/` e `.claude/settings.local.json`.
- Não copie comandos Claude para `.codex/`.
- Não substitua configuração do Claude ao ajustar o Codex.
- Quando continuar uma tarefa do Claude, valide relatório, branch, status, diff e arquivos reais antes de agir.

## Prompts compartilhados

Os arquivos em `.codex/prompts/` são templates versionados para copiar e colar no Codex.

Prompts customizados do Codex estão depreciados e são descobertos oficialmente apenas no diretório pessoal `~/.codex/prompts/`. Não assuma que os templates deste repositório aparecem automaticamente como comandos no VS Code.

## Relatório final

Informe:

1. resumo e escopo atendido;
2. arquivos criados, alterados e preservados;
3. comandos e validações executados;
4. validações não executadas e motivo;
5. riscos ou pendências;
6. estado final do Git e próximo passo realmente necessário.

Use `docs/ai-reports/TEMPLATE-agent-report.md` quando a tarefa exigir relatório persistente ou continuidade entre agentes.
