# AGENTS.md

## Instruções obrigatórias para agentes de IA

Antes de qualquer alteração neste projeto, leia obrigatoriamente:

- `PROJECT_RULES.md`

Leia também o documento específico do agente:

- Claude Code: `CLAUDE.md` e `.claude/instructions.md`.
- Codex: `CODEX.md` e `.codex/instructions.md`.
- Em tarefas de continuidade entre agentes, leia os dois documentos específicos e o relatório anterior.

Este projeto é uma vitrine digital para a Floricultura Rosa de Saron, desenvolvida com Next.js App Router, TypeScript, Tailwind CSS, Prisma e PostgreSQL.

## Regras principais

1. Não implementar nada fora do escopo solicitado.
2. Não adicionar bibliotecas sem necessidade real.
3. Não criar abstrações complexas para um MVP pequeno.
4. Não usar `any` sem justificativa explícita.
5. Não expor segredos, tokens, credenciais ou variáveis sensíveis.
6. Não alterar fluxo público, admin, autenticação ou APIs sem mapear o impacto.
7. Não remover validações, testes ou proteções para fazer build passar.
8. Antes de alterar muitos arquivos, mapear a estrutura existente.
9. Ao final, informar arquivos alterados, comandos executados e riscos remanescentes.
10. Usar apenas scripts realmente existentes em `package.json`.
11. Não declarar validação como executada quando ela não tiver sido executada.

## Fluxos críticos do projeto

Tenha cuidado especial com:

- carrinho local;
- montagem da mensagem do WhatsApp;
- painel administrativo;
- autenticação do admin;
- rotas `/admin/*`;
- rotas `/api/admin/*`;
- SEO local;
- páginas públicas de produto e categoria;
- regras de segurança;
- performance mobile.

## Padrão de trabalho esperado

Antes de implementar:

1. Explique o que entendeu da tarefa.
2. Liste os arquivos que pretende analisar.
3. Liste os arquivos que provavelmente serão alterados.
4. Explique a estratégia técnica.
5. Aponte riscos.

Depois de implementar:

1. Liste arquivos criados/alterados.
2. Informe comandos executados.
3. Informe se rodou lint, build e testes.
4. Explique riscos ou pendências.
5. Sugira próximos passos apenas se forem realmente necessários.

## Coexistência entre agentes

- `PROJECT_RULES.md` é a fonte principal das regras técnicas do sistema.
- Este arquivo contém regras compartilhadas por todos os agentes.
- `CLAUDE.md` e `.claude/` são específicos do Claude Code.
- `CODEX.md` e `.codex/` são específicos do Codex.
- Um agente não deve mover, renomear, substituir ou apagar a configuração específica do outro.
- Arquivos com nomes semelhantes devem permanecer na pasta do respectivo agente.
- Ao continuar trabalho de outro agente, confirme branch, `git status`, `git diff`, arquivos alterados e relatório anterior.
- Use `docs/ai-reports/TEMPLATE-agent-report.md` como formato de entrega ou continuidade quando a tarefa exigir relatório persistente.
