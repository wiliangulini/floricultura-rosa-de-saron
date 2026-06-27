---
description: Implementa alteração localizada com escopo controlado e validação proporcional.
argument-hint: "[tarefa e escopo permitido]"
disable-model-invocation: true
---

# Implementação segura

Tarefa: $ARGUMENTS

## Antes de alterar

1. Leia as regras do projeto e os arquivos afetados.
2. Confirme comportamento atual, consumidores, testes e working tree.
3. Informe entendimento, arquivos a analisar/alterar, estratégia e riscos.
4. Pare se a solução exigir arquivo, dependência, migration ou contrato fora do escopo.

## Implementação

- Faça a menor mudança correta.
- Preserve Next.js App Router, TypeScript estrito, Tailwind v4 e Prisma 7.
- Preserve carrinho local, WhatsApp, SEO, autenticação customizada, `src/proxy.ts` e separação público/admin.
- Não remova validações ou testes.
- Não acesse arquivos reais de ambiente.

## Finalização

Revise o diff, execute apenas scripts existentes em `package.json` e informe arquivos, comandos, resultados, riscos e validações manuais. Não faça commit ou push sem solicitação.
