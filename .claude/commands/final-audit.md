---
description: Executa auditoria final de escopo, segurança, validações e continuidade.
argument-hint: "[contexto da entrega]"
disable-model-invocation: true
---

# Auditoria final

Contexto: $ARGUMENTS

Não implemente melhorias novas.

1. Confirme branch, `git status`, diff e arquivos alterados.
2. Verifique escopo, mudanças acidentais, código morto, logs, segredos e dependências.
3. Avalie regressão em contratos, rotas, autenticação, Prisma, SEO, carrinho, WhatsApp, admin, UX e performance quando aplicável.
4. Confira quais validações foram realmente executadas.
5. Registre arquivos criados/alterados, comandos, resultados, riscos e pendências.
6. Confirme compatibilidade entre `.claude/` e `.codex/` quando essas configurações forem tocadas.

Classifique como pronto, pronto com observações ou não pronto. Sugira mensagem de commit apenas como texto; não execute commit.
