# Manual resumido das configurações de IA

## Visão rápida

Este repositório possui 27 arquivos de configuração de agentes:

- Codex: 5 templates, uma configuração e uma instrução operacional;
- Claude Code: 11 comandos, 6 skills, uma instrução e duas configurações.

Sempre respeite esta ordem:

1. solicitação do usuário;
2. `PROJECT_RULES.md`;
3. `AGENTS.md`;
4. `CODEX.md` ou `CLAUDE.md`;
5. instruções específicas do agente;
6. prompt, comando ou skill;
7. código e testes reais.

## Diferenças essenciais

| Recurso                       | Uso                                                     |
| ---                           | ---                                                     |
| `.codex/prompts/*.md`         | Copie, preencha e cole no Codex                         |
| `.claude/commands/*.md`       | Execute manualmente com `/nome argumentos`              |
| `.claude/skills/*/SKILL.md`   | Use `/nome` ou deixe o Claude selecionar pela descrição |
| `.codex/config.toml`          | Defaults do Codex para este repositório confiável       |
| `.claude/settings.json`       | Permissões compartilhadas                               |
| `.claude/settings.local.json` | Permissões locais, não versionadas                      |

Os templates em `.codex/prompts/` não aparecem automaticamente como comandos.
Prompts customizados do Codex estão depreciados; somente arquivos em
`~/.codex/prompts/` geram `/prompts:nome`.

O Codex não carrega `.claude/skills/`. Skills de repositório para Codex devem
ficar em `.agents/skills/`.

Todos os comandos Claude deste projeto têm `disable-model-invocation: true` e,
portanto, exigem invocação manual.

## Qual recurso usar

| Necessidade              | Codex                       | Claude Code                                        |
| ---                      | ---                         | ---                                                |
| Implementar              | `create-code.md`            | `/create-code` ou `/senior-code-agent`             |
| Depurar                  | `debug.md`                  | `/debug-app`                                       |
| Refatorar                | `refactor-code.md`          | `/refactor-code` ou `/safe-refactor`               |
| Revisar diff             | `review-code.md`            | `/review-code` ou `/senior-code-review`            |
| Decisão arquitetural     | `architecture-decision.md`  | `/architecture-decision` ou `/architecture-review` |
| Planejar tarefa sensível | Prompt com escopo explícito | `/implementation-planning`                         |
| Auditar legado           | Prompt de auditoria         | `/legacy-code-audit`                               |
| Continuar do Codex       | Forneça o relatório         | `/continue-from-codex`                             |
| Auditar antes do merge   | `review-code.md`            | `/checklist-merge`                                 |
| Auditoria final          | Pedido comum de auditoria   | `/final-audit`                                     |
| Melhorar interface       | `create-code.md`            | `/melhorar-ui-ux`                                  |
| Performance              | Revisão focada              | `/revisar-performance`                             |
| Segurança                | Revisão focada              | `/revisar-seguranca`                               |

## Templates Codex

Procedimento: abra o arquivo, copie tudo, substitua os campos entre colchetes e
cole no Codex.

| Template | Finalidade | Edita? |
| --- | --- | --- |
| `architecture-decision.md` | Compara alternativas e recomenda uma decisão | Não |
| `create-code.md` | Implementa mudança localizada | Sim |
| `debug.md` | Investiga causa raiz | Só se autorizado |
| `refactor-code.md` | Refatora preservando comportamento | Sim |
| `review-code.md` | Revisa diff com severidade e evidência | Não |

Exemplo:

```text
Use o template create-code.md.
Tarefa: adicionar estado vazio à página de categoria.
Escopo permitido: página de categoria e teste direto.
```

## Comandos Claude Code

Sintaxe:

```text
/nome-do-comando argumentos
```

| Comando | Uso | Edita? |
| --- | --- | --- |
| `/architecture-decision` | Decisão arquitetural | Não |
| `/checklist-merge` | Auditoria pré-merge | Não |
| `/continue-from-codex` | Continuidade entre agentes | Pode editar |
| `/create-code` | Implementação controlada | Sim |
| `/debug-app` | Investigação de bug | Só se autorizado |
| `/final-audit` | Auditoria final | Não |
| `/melhorar-ui-ux` | Melhoria visual incremental | Sim |
| `/refactor-code` | Refatoração segura | Sim |
| `/review-code` | Revisão técnica | Não |
| `/revisar-performance` | Revisão mensurável de performance | Começa sem editar |
| `/revisar-seguranca` | Auditoria de segurança | Não |

Exemplos:

```text
/debug-app O modal não fecha após excluir. Reproduza, encontre a causa e corrija se confirmada.

/review-code Revise o diff da exclusão de categorias e não altere arquivos.

/checklist-merge Escopo: confirmação de exclusão no painel administrativo.
```

## Skills Claude Code

| Skill | Use quando | Comando relacionado |
| --- | --- | --- |
| `/architecture-review` | Há decisão com impacto sistêmico | `/architecture-decision` |
| `/implementation-planning` | A tarefa é sensível ou multiarquivo | — |
| `/legacy-code-audit` | O fluxo é antigo ou pouco conhecido | `/safe-refactor` depois da aprovação |
| `/safe-refactor` | Há problema estrutural sem mudança funcional | `/refactor-code` |
| `/senior-code-agent` | É necessário implementar | `/create-code` e `/final-audit` |
| `/senior-code-review` | É necessário revisar um diff | `/review-code` e `/checklist-merge` |

Exemplo explícito:

```text
/senior-code-review Revise o diff atual conforme os critérios da tarefa.
```

As skills também podem ser selecionadas automaticamente pelo Claude. Use a
invocação explícita quando quiser garantir o workflow.

## Configurações e segurança

### Codex

`.codex/config.toml` configura:

- raciocínio alto;
- aprovações sob demanda;
- escrita limitada ao workspace;
- busca web em cache;
- abertura de arquivos no VS Code;
- limite e fallbacks para instruções do projeto.

Só é aplicado quando o repositório é confiável.

### Claude Code

`.claude/settings.json`:

- permite Git de leitura, lint, typecheck, build e testes unitários;
- pede confirmação para Git mutável, instalações, `npx`, E2E e Prisma;
- bloqueia segredos, arquivos de ambiente, comandos destrutivos, push, acesso
  direto a banco e ferramentas remotas.

`.claude/settings.local.json` contém permissões locais mais amplas para npm,
Git, Prisma, Playwright, diagnóstico e servidor local. Ele é ignorado pelo Git
e não deve ser copiado para a configuração compartilhada sem auditoria.

Há uma permissão local que inspeciona `.env` para informar presença e tamanho
de valores. Não a utilize: mesmo sem imprimir os valores, ela contraria a regra
de não acessar arquivos reais de ambiente.

Regras `deny` têm prioridade sobre `ask`, e `ask` sobre `allow`.

## Checklist mínimo

Antes:

- confirme branch, status e diff;
- leia regras, arquivos, consumidores e testes;
- defina escopo e autorização para editar;
- escolha o recurso correto.

Depois:

- revise o diff;
- execute somente scripts existentes e proporcionais;
- não declare validações não executadas;
- informe arquivos, comandos, resultados, riscos e pendências;
- não faça commit ou push sem solicitação.

Para exemplos e explicações individuais, consulte
`docs/MANUAL-AGENTES-COMPLETO.md`.
