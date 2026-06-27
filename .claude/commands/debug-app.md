---
description: Investiga bug com evidências e propõe a menor correção possível.
argument-hint: "[sintoma, reprodução e resultado esperado]"
disable-model-invocation: true
---

# Debug da aplicação

Bug: $ARGUMENTS

Comece sem alterar arquivos.

1. Leia regras, erro completo, fluxo, testes e arquivos relacionados.
2. Diferencie fato observado, hipótese, causa provável e causa confirmada.
3. Considere limites Server/Client Components, estado local, Prisma, autenticação, cache, rotas e integrações conforme o sintoma.
4. Confirme a hipótese com evidência antes de propor correção.
5. Implemente somente se o pedido autorizar corrigir.
6. Corrija a causa raiz com o menor diff, sem refatoração oportunista.

## Saída

- reprodução e fluxo analisado;
- hipóteses e evidências;
- causa provável ou confirmada;
- correção aplicada ou recomendada;
- validações e riscos residuais.
