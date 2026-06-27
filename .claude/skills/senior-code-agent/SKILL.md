---
name: senior-code-agent
description: Executa tarefas gerais de implementação na Floricultura Rosa de Saron com leitura prévia, menor mudança correta, validação e relatório.
---

# Senior Code Agent

## Quando usar

- implementação incremental;
- ajuste localizado;
- correção já autorizada;
- continuidade de tarefa de outro agente;
- integração dentro dos padrões existentes.

## Quando não usar

- revisão sem edição;
- decisão arquitetural ainda aberta;
- refatoração estrutural;
- auditoria de legado;
- banco, segurança crítica ou escopo ambíguo sem autorização.

## Pré-requisitos

1. Ler `PROJECT_RULES.md`, `AGENTS.md`, `CLAUDE.md` e `.claude/instructions.md`.
2. Ler `CODEX.md` quando houver continuidade.
3. Confirmar branch, working tree e relatório anterior.
4. Ler todos os arquivos a alterar, consumidores e testes.
5. Identificar scripts de validação no `package.json`.

## Fluxo

1. Resumir objetivo, escopo e fora de escopo.
2. Listar arquivos, comportamento e contratos.
3. Identificar riscos e criar plano curto.
4. Implementar a menor solução suficiente.
5. Preservar padrões, validações e linguagem da interface.
6. Revisar o próprio diff.
7. Executar validações seguras e proporcionais.
8. Entregar relatório transparente.

## Checklist de segurança

- [ ] Sem `.env`, segredo, token ou credencial.
- [ ] Sem commit, push, comando destrutivo ou troca de branch não autorizada.
- [ ] Sem dependência, migration ou acesso direto ao banco sem autorização.
- [ ] Sem enfraquecimento de autenticação ou validação.
- [ ] Sem arquivo fora do escopo.

## Checklist técnico

- [ ] App Router e limites Server/Client preservados.
- [ ] TypeScript estrito, sem `any` injustificado.
- [ ] Prisma 7 usa `prisma.config.ts`.
- [ ] Carrinho local e mensagem do WhatsApp preservados quando afetados.
- [ ] SEO local, admin e mobile avaliados quando afetados.
- [ ] Sem abstração, log ou código morto desnecessário.
- [ ] Testes reais executados ou pendência justificada.

## Saída esperada

Resumo, arquivos lidos/criados/alterados, implementação, decisões, preservação de comportamento, comandos, validações, riscos e status.

## Regras de parada

Pare diante de conflito com regras, risco de perda de dados, informação crítica ausente ou necessidade de ampliar materialmente o escopo.

## Restrições e integração

Use `/create-code` para implementação e `/final-audit` antes da entrega. Preserve a configuração do Codex e use o template de relatório para continuidade persistente.
