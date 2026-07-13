# AGENTS.md

## Instruções obrigatórias para agentes de IA

Antes de qualquer alteração neste projeto, leia obrigatoriamente:

- `PROJECT_RULES.md`

Leia também o documento específico do agente:

- Claude Code: `CLAUDE.md` e `.claude/instructions.md`.
- Codex: `CODEX.md` e `.codex/instructions.md`.
- Em tarefas de continuidade entre agentes, leia os dois documentos específicos e o relatório anterior.

Este projeto é uma vitrine digital para a Floricultura Rosa de Saron, desenvolvida com Next.js App Router, TypeScript, Tailwind CSS, Prisma e PostgreSQL.

## Hierarquia e prioridade das instruções

Em caso de conflito entre instruções, siga esta ordem:

1. Solicitação explícita do usuário na tarefa atual.
2. `PROJECT_RULES.md` — fonte de verdade única das regras técnicas, de produto e de segurança.
3. Este `AGENTS.md` — roteador operacional comum a todos os agentes.
4. `CLAUDE.md`, `.claude/instructions.md`, `.claude/rules/*`, `.claude/commands/*` e
   `.claude/skills/*` — quando estiver usando Claude Code.
5. `CODEX.md` e `.codex/instructions.md` — quando estiver usando Codex ou houver
   continuidade entre agentes.
6. Código, testes e documentação já existentes no repositório.
7. Boas práticas atuais de Next.js App Router, TypeScript, Tailwind, Prisma/PostgreSQL e
   segurança web.

Em conflito, priorize sempre segurança, integridade de dados, autenticação admin, o
fluxo de carrinho/WhatsApp e SEO local. Comunique antes de aplicar mudanças amplas.

### Mapa de responsabilidades

Cada assunto tem um dono. Não duplique conteúdo entre arquivos — referencie o dono.

| Arquivo | Responsabilidade | Não deve |
| --- | --- | --- |
| `PROJECT_RULES.md` | Fonte de verdade única: escopo, stack, domínio, segurança, SEO, comandos de validação. | — |
| `AGENTS.md` | Roteador comum a todos os agentes: hierarquia, mapa de responsabilidades, roteamento por domínio, continuidade. | Recopiar seções inteiras de `PROJECT_RULES.md`. |
| `CLAUDE.md` | Comportamento operacional do Claude Code (Plan Mode, permissões, commands/skills). | Duplicar regras de domínio já em `PROJECT_RULES.md`. |
| `.claude/instructions.md` | Protocolo específico do Claude Code (ordem de leitura, permissões compartilhadas). | Duplicar `PROJECT_RULES.md`. |
| `CODEX.md` + `.codex/instructions.md` | Comportamento operacional do Codex. | Criar formato de relatório concorrente. |
| `.claude/commands/*` | Entrypoints de tarefa (`/nome` + `$ARGUMENTS`): papel, regra principal, checklist e saída. | Recopiar o protocolo comum. |
| `.claude/skills/**` | Metodologias reutilizáveis. Não concedem autorização de escrita. | Virar workflow duplicado de um command. |
| `.claude/rules/*` | Invariantes de domínio acionáveis por `paths`, derivadas de uma seção de `PROJECT_RULES.md`. | Repetir procedimento/validação/bloqueio genéricos. |
| `docs/ai-reports/` | Template e histórico de relatórios. | Ser fonte de regra concorrente. |

### Roteamento por domínio

Antes de editar um arquivo, consulte a rule em `.claude/rules/` cujo frontmatter `paths`
casa com o caminho e leia-a. O protocolo comum (validação, formato de relatório,
proibições) vive em `PROJECT_RULES.md` e neste `AGENTS.md`; rules **referenciam**, não
recopiam.

| Domínio | Seção em `PROJECT_RULES.md` | Rule |
| --- | --- | --- |
| App Router, Server/Client Components | §3 | `.claude/rules/next-app-router.md` |
| Autenticação admin, sessão, `src/proxy.ts` | §6 | `.claude/rules/admin-auth.md` |
| Prisma, schema, migrations, seed | §2/§3 | `.claude/rules/prisma-database.md` |
| SEO local, metadata, sitemap, JSON-LD | §4 | `.claude/rules/seo-local.md` |
| Carrinho local e checkout via WhatsApp | §8 | `.claude/rules/whatsapp-checkout.md` |
| Upload de imagens (Cloudinary) | §6 | `.claude/rules/cloudinary-upload.md` |
| UI, UX e performance mobile | §5/§7 | `.claude/rules/ui-mobile.md` |

Não trate uma área como impactada sem evidência real no repositório.

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
