# Manual resumido das configurações de IA

## Autoridade e inventário

Este é um guia de consulta, não uma fonte de regra. Respeite:

1. solicitação atual do usuário;
2. `PROJECT_RULES.md` — fonte de verdade técnica, de produto e segurança;
3. `AGENTS.md` — hierarquia, responsabilidades e roteamento por domínio;
4. `CLAUDE.md` e `.claude/` quando o agente em uso for o Claude Code;
5. `CODEX.md` e `.codex/` quando o agente em uso for o Codex ou houver
   continuidade entre agentes;
6. código, testes e documentação reais;
7. boas práticas atuais da stack e de segurança.

Inventário atual nas pastas de agentes:

- 36 arquivos versionados: 7 em `.codex/` e 29 em `.claude/`;
- Codex: 5 templates, `config.toml` e `instructions.md`;
- Claude Code: 13 comandos, 7 skills, 7 rules, `instructions.md` e
  `settings.json`;
- mais `.claude/settings.local.json`, local e ignorado, totalizando 37 arquivos
  visíveis nesta máquina.

## Diferenças essenciais

| Recurso | Responsabilidade e uso |
| --- | --- |
| `PROJECT_RULES.md` | Fonte única das regras do projeto e validações |
| `AGENTS.md` | Roteador comum; não duplica as regras de domínio |
| `CODEX.md` / `CLAUDE.md` | Comportamento operacional de cada agente |
| `.codex/prompts/*.md` | Templates para copiar, preencher e colar no Codex |
| `.claude/commands/*.md` | Entrypoints com `/nome argumentos` e `$ARGUMENTS` |
| `.claude/skills/*/SKILL.md` | Metodologias explícitas ou selecionadas pela descrição |
| `.claude/rules/*.md` | Invariantes lidas quando `paths` coincide com o arquivo |
| `.claude/settings.json` | Permissões compartilhadas e versionadas |
| `.claude/settings.local.json` | Arquivo local ignorado; preserve e não inspecione |
| `docs/ai-reports/TEMPLATE-agent-report.md` | Relatório persistente e continuidade entre agentes |

Os templates em `.codex/prompts/` não aparecem automaticamente como comandos.
Prompts customizados do Codex estão depreciados; somente arquivos no diretório
pessoal `~/.codex/prompts/` geram `/prompts:nome` nesse mecanismo legado.

O Codex não carrega `.claude/skills/`, mas `CODEX.md` exige a consulta das rules
de domínio em `.claude/rules/` antes de editar caminhos correspondentes.

## Qual recurso usar

| Necessidade | Codex | Claude Code |
| --- | --- | --- |
| Implementar | `create-code.md` | `/create-code` ou `/senior-code-agent` |
| Depurar | `debug.md` | `/debug-app` |
| Refatorar | `refactor-code.md` | `/refactor-code` ou `/safe-refactor` |
| Revisar diff | `review-code.md` | `/review-code` ou `/senior-code-review` |
| Decisão arquitetural | `architecture-decision.md` | `/architecture-decision` ou `/architecture-review` |
| Planejar tarefa sensível | Prompt com escopo explícito | `/implementation-plan` ou `/implementation-planning` |
| Auditar legado | Prompt de auditoria | `/legacy-code-audit` |
| Continuar do Codex | Forneça estado e relatório | `/continue-from-codex` |
| Auditar antes do merge | `review-code.md` | `/checklist-merge` |
| Auditoria final | Pedido comum de auditoria | `/final-audit` |
| Melhorar interface | `create-code.md` | `/melhorar-ui-ux` |
| Revisar SEO/UX pública | Revisão com critérios claros | `/seo-ux-review` |
| Revisar performance | Revisão mensurável | `/revisar-performance` |
| Revisar Prisma/banco | Revisão de dados | `/revisar-prisma-banco` |
| Revisar segurança | Revisão de segurança | `/revisar-seguranca` |

`/implementation-plan` é o comando/entrypoint que recebe `$ARGUMENTS` e produz
um plano no chat. `/implementation-planning` é a skill metodológica. Plan Mode é
o modo operacional exigido por `CLAUDE.md` antes de alterações sensíveis; são
três conceitos relacionados, mas diferentes.

## Rules por domínio

Antes de editar, compare os arquivos prováveis com o frontmatter `paths` e leia
todas as rules correspondentes:

| Domínio | Seção principal | Rule |
| --- | --- | --- |
| App Router e Server/Client Components | §3 | `next-app-router.md` |
| Autenticação admin, sessão e `src/proxy.ts` | §6 | `admin-auth.md` |
| Prisma, schema, migrations e seed | §2/§3 | `prisma-database.md` |
| SEO local, metadata, sitemap e JSON-LD | §4 | `seo-local.md` |
| Carrinho local e checkout WhatsApp | §8 | `whatsapp-checkout.md` |
| Upload Cloudinary | §6 | `cloudinary-upload.md` |
| UI, UX e performance mobile | §5/§7 | `ui-mobile.md` |

As rules derivam de `PROJECT_RULES.md` e nunca o substituem. Considere um
domínio impactado somente com evidência real. Em autenticação, consulte
`PROJECT_RULES.md §3/§6` para as exceções públicas e a política vigente de
`src/proxy.ts`.

## Templates Codex

Abra o arquivo, substitua os campos entre colchetes e cole o conteúdo no Codex.

| Template | Finalidade | Edita? |
| --- | --- | --- |
| `architecture-decision.md` | Compara alternativas | Não |
| `create-code.md` | Implementa mudança localizada | Sim |
| `debug.md` | Investiga causa raiz | Só se autorizado |
| `refactor-code.md` | Refatora preservando comportamento | Sim |
| `review-code.md` | Revisa diff com severidade e evidência | Não |

## Comandos do Claude Code

Use `/nome-do-comando argumentos`. Doze dos 13 comandos possuem
`disable-model-invocation: true`; `/implementation-plan` é a única exceção
atual. Use sempre a invocação explícita quando quiser garantir o workflow.

| Comando | Uso | Edita? |
| --- | --- | --- |
| `/architecture-decision` | Decisão arquitetural | Não |
| `/checklist-merge` | Auditoria pré-merge | Não |
| `/continue-from-codex` | Continuidade entre agentes | Pode editar |
| `/create-code` | Implementação controlada | Sim |
| `/debug-app` | Investigação de bug | Só se autorizado |
| `/final-audit` | Auditoria final | Não |
| `/implementation-plan` | Plano incremental entregue no chat | Não |
| `/melhorar-ui-ux` | Melhoria visual incremental | Sim |
| `/refactor-code` | Refatoração segura | Sim |
| `/review-code` | Revisão técnica | Não |
| `/revisar-performance` | Revisão mensurável de performance | Começa sem editar |
| `/revisar-prisma-banco` | Revisão de schema, migrations e seeds | Não |
| `/revisar-seguranca` | Auditoria de segurança | Não |

`/implementation-plan` declara `Read`, `Grep`, `Glob` e `Bash`, mas é o texto do
comando que proíbe implementação e determina saída somente no chat.
`/revisar-prisma-banco` também não executa migration, seed, reset, deploy ou
escrita no banco.

## Skills Claude Code

| Skill | Use quando | Relação principal |
| --- | --- | --- |
| `/architecture-review` | Há impacto sistêmico | `/architecture-decision` |
| `/implementation-planning` | A tarefa é sensível ou multiarquivo | `/implementation-plan` |
| `/legacy-code-audit` | O fluxo é antigo ou desconhecido | `/safe-refactor` após aprovação |
| `/safe-refactor` | Há problema estrutural sem mudança funcional | `/refactor-code` |
| `/senior-code-agent` | É necessário implementar | `/create-code` e `/final-audit` |
| `/senior-code-review` | É necessário revisar um diff | `/review-code` e `/checklist-merge` |
| `/seo-ux-review` | Revisar SEO local e UX pública sem editar | rules de SEO e UI |

As skills podem ser invocadas explicitamente ou selecionadas pela descrição.
Elas nunca ampliam o escopo nem a autorização de escrita.

## Configurações e segurança

### Codex

`.codex/config.toml` configura raciocínio alto, aprovações sob demanda, escrita
limitada ao workspace, busca web em cache, abertura no VS Code e fallbacks para
instruções. Só é aplicado em repositório confiável.

### Claude Code

`.claude/settings.json`:

- permite Git de leitura, `find`, `ls`, `rg`, leitura de `package.json`, lint,
  typecheck, build e testes unitários;
- pede confirmação para Git mutável, instalações, `npx`, E2E e Prisma;
- bloqueia segredos e arquivos de ambiente, `settings.local.json`, comandos
  destrutivos, push, SSH/HTTP remoto, acesso direto a banco, Vercel e deploy;
- define `cleanupPeriodDays: 14`, exclui dependências/artefatos via
  `claudeMdExcludes` e habilita `autoCompactEnabled`.

Regras `deny` têm prioridade sobre `ask`, e `ask` sobre `allow`.
`.claude/settings.local.json` é ignorado pelo Git e bloqueado para leitura e
edição pela política compartilhada. Preserve-o sem documentar seu conteúdo.

## Plan Mode e checklist mínimo

Use Plan Mode antes de editar tarefas multiarquivo, ambíguas ou que envolvam
autenticação, sessão, permissões, Prisma, SEO, carrinho, checkout ou WhatsApp.
Correções triviais, localizadas e de baixo risco podem seguir após leitura e
confirmação do escopo.

Antes:

- confirme branch, status e diff;
- leia regras, arquivos, consumidores e testes;
- consulte todas as rules cujos `paths` correspondem aos arquivos prováveis;
- defina escopo, critérios de aceite e autorização para editar;
- escolha o recurso correto e entre em Plan Mode quando exigido.

Depois:

- revise o diff e confirme que nenhum arquivo fora do escopo mudou;
- execute as validações obrigatórias de `PROJECT_RULES.md §12`: lint,
  typecheck, testes unitários, testes E2E e build;
- não declare validações que não foram executadas;
- informe arquivos, comandos, resultados, riscos e pendências;
- não faça commit ou push sem solicitação.

Em continuidade entre agentes ou quando for necessário relatório persistente,
use `docs/ai-reports/TEMPLATE-agent-report.md`. Para exemplos e explicações
individuais, consulte `docs/MANUAL-AGENTES-COMPLETO.md`.
