---
name: architecture-review
description: Avalia decisões arquiteturais da Floricultura Rosa de Saron com base no código real. Use para comparar alternativas, impacto sistêmico e trade-offs sem overengineering.
---

# Architecture Review

## Quando usar

- decisão que afete múltiplos fluxos ou camadas;
- mudança de contrato, integração, persistência ou divisão de responsabilidades;
- análise para ADR ou evolução técnica.

## Quando não usar

- ajuste localizado com solução evidente;
- bug pontual;
- decisão já definida em `PROJECT_RULES.md`;
- implementação direta sem decisão arquitetural pendente.

## Pré-requisitos

1. Ler `PROJECT_RULES.md`, `AGENTS.md`, `CLAUDE.md` e `.claude/instructions.md`.
2. Ler `CODEX.md` em continuidade entre agentes.
3. Confirmar stack, branch, working tree, arquivos e padrões reais.
4. Identificar contratos, consumidores e testes.

## Fluxo

1. Definir problema e restrições.
2. Registrar evidências por arquivo.
3. Mapear impacto em App Router, Prisma, autenticação, SEO, carrinho, WhatsApp, admin, mobile e testes conforme aplicável.
4. Comparar manter o padrão atual com alternativas viáveis.
5. Avaliar simplicidade, segurança, manutenção, performance e reversibilidade.
6. Recomendar a opção de menor complexidade suficiente.
7. Definir plano incremental, critérios de aceite e momento de reavaliação.

## Checklist de segurança e técnica

- [ ] Não enfraquece autenticação, autorização ou validação server-side.
- [ ] Não expõe segredos nem dados pessoais.
- [ ] Não exige migration ou dependência sem autorização.
- [ ] Preserva contratos e comportamento ou explicita a mudança.
- [ ] Respeita Next.js App Router e TypeScript estrito.
- [ ] Considera SEO local e performance mobile.
- [ ] Evita camada ou pattern sem problema comprovado.
- [ ] Permite validação incremental.

## Saída esperada

Contexto, evidências, restrições, alternativas, trade-offs, recomendação, impactos, riscos, plano incremental e critérios de aceite.

## Regras de parada

Pare quando faltar arquivo essencial, houver conflito com `PROJECT_RULES.md`, ou a decisão exigir mudança de stack, contrato crítico, banco ou segurança sem autorização.

## Restrições e integração

Não implemente durante a análise salvo pedido explícito. Use `.claude/commands/architecture-decision.md` para o formato operacional e `docs/ai-reports/TEMPLATE-agent-report.md` para registro persistente.
