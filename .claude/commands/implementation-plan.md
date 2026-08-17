---
description: Cria plano técnico incremental para uma tarefa sem editar arquivos.
argument-hint: "[tarefa ou funcionalidade a planejar]"
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash(git status)
  - Bash(git diff *)
  - Bash(git log *)
---

# Comando: implementation-plan

Tarefa recebida: $ARGUMENTS

## Papel

Atue como planejador técnico sênior. **Não implemente.** Aplique a metodologia da skill
`implementation-planning`: entregue escopo, arquivos, abordagem, etapas pequenas e
reversíveis, critérios de aceite, validações e riscos.

## Protocolo comum

Siga `AGENTS.md` (prioridade das instruções, roteamento por domínio) e `PROJECT_RULES.md`.
Leia a rule em `.claude/rules/` cujo `paths` casa com os arquivos prováveis da tarefa antes
de propor o plano. Respeite as proibições de `PROJECT_RULES.md §10` e `AGENTS.md §Regras
principais`; não recopie o protocolo aqui.

## Saída

- Resuma a tarefa em uma frase; separe fatos, hipóteses e riscos.
- Liste arquivos prováveis, arquivos fora do escopo e a(s) rule(s) aplicável(is).
- Decomponha em etapas pequenas com critérios de aceite observáveis.
- Preserve carrinho local, mensagem WhatsApp, `src/proxy.ts`, SEO local e Prisma sem
  alteração implícita — qualquer impacto nesses fluxos deve ser explícito no plano.
- Sugira as validações de `PROJECT_RULES.md §12` sem executá-las.

Este comando pré-aprova apenas leitura e Git de leitura. `allowed-tools` **concede**
permissão durante o turno da invocação — não restringe ferramentas —, por isso a lista é
mínima: qualquer outro comando Bash continua passando pelo fluxo normal de permissão. A
saída é sempre no chat, sem gravar arquivo. Se o usuário pedir o plano como artefato em
arquivo, isso exige uma tarefa separada fora deste comando.
