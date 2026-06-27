---
description: Audita o diff antes de merge sem alterar arquivos.
argument-hint: "[escopo esperado]"
disable-model-invocation: true
---

# Checklist de merge

Escopo: $ARGUMENTS

Não altere arquivos.

1. Leia as regras do projeto e confirme branch, `git status` e diff.
2. Compare cada arquivo alterado com o escopo.
3. Procure alterações acidentais, segredos, dependências, migrations e arquivos de ambiente.
4. Avalie contratos, rotas, autenticação, `src/proxy.ts`, SEO, carrinho, WhatsApp, admin e responsividade conforme o impacto.
5. Confira resultados reais de `lint`, `typecheck`, `build`, Vitest e Playwright; não presuma execução.
6. Classifique pendências como bloqueadoras ou não bloqueadoras.

## Saída

- arquivos analisados;
- escopo respeitado ou divergências;
- riscos por severidade;
- validações executadas e pendentes;
- decisão: pronto, pronto com observações ou requer ajustes.
