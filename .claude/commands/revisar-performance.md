---
description: Revisa performance da stack real com foco em impacto mensurável no mobile.
argument-hint: "[página, fluxo ou diff]"
disable-model-invocation: true
---

# Revisão de performance

Escopo: $ARGUMENTS

Não altere arquivos inicialmente.

1. Leia o fluxo real, diff e pontos de dados relacionados.
2. Diferencie gargalo observado de hipótese e indique como medir.
3. Avalie Server/Client Components, waterfalls, consultas Prisma, cache, serialização, bundle e re-renderizações.
4. Confira uso de `next/image`, dimensões, `priority`, carregamento e estabilidade visual.
5. Priorize LCP abaixo de 2,5 s, CLS abaixo de 0,1 e Lighthouse mobile conforme `PROJECT_RULES.md`.
6. Proponha melhorias incrementais, sem trocar stack ou criar cache complexo sem evidência.

Entregue achados, evidências, impacto provável, medição, prioridade, riscos e validações.
