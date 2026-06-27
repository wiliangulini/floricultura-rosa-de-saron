---
description: Analisa uma decisão arquitetural no contexto real da Floricultura Rosa de Saron.
argument-hint: "[decisão ou problema]"
disable-model-invocation: true
---

# Decisão arquitetural

Analise: $ARGUMENTS

## Procedimento

1. Leia `PROJECT_RULES.md`, `AGENTS.md`, `CLAUDE.md` e os arquivos relacionados.
2. Confirme a stack e o comportamento existentes; não proponha tecnologia genérica.
3. Mapeie impacto em App Router, tipos, Prisma/PostgreSQL, rotas, autenticação, SEO, WhatsApp, carrinho, admin, mobile e testes quando aplicável.
4. Compare no mínimo manter o padrão atual e a alternativa mais simples viável.
5. Recomende a opção de menor complexidade que cumpra o requisito.

## Saída

- contexto e evidências por arquivo;
- problema e restrições;
- alternativas e trade-offs;
- recomendação justificada;
- impactos, riscos e critérios de aceite;
- plano incremental e validações.

Não implemente nem crie ADR em arquivo salvo se o usuário não tiver solicitado.
