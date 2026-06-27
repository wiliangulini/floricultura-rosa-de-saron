---
description: Refatora incrementalmente sem mudar comportamento ou contratos.
argument-hint: "[área e problema estrutural]"
disable-model-invocation: true
---

# Refatoração segura

Escopo: $ARGUMENTS

1. Leia regras, arquivos, consumidores e testes.
2. Documente o comportamento que deve permanecer igual.
3. Identifique o problema estrutural real e por que uma mudança simples é necessária.
4. Preserve rotas, APIs, tipos exportados, schema, UI, autenticação, SEO, carrinho e WhatsApp.
5. Faça passos pequenos e reversíveis; não misture feature ou bugfix.
6. Não aplique design pattern sem benefício concreto para este MVP.
7. Pare se surgir necessidade de migration, dependência ou alteração de contrato.

Revise o diff e informe evidências de comportamento preservado, validações e riscos.
