---
name: senior-code-review
description: Revisa código e diffs da Floricultura Rosa de Saron com evidências, severidade e foco em regressões reais, sem alterar automaticamente.
---

# Senior Code Review

## Quando usar

- revisão de diff ou implementação;
- auditoria pré-commit ou pré-merge;
- validação de critérios de aceite;
- revisão de trabalho do Codex ou Claude Code.

## Quando não usar

- pedido de implementação direta;
- planejamento sem diff;
- refatoração;
- auditoria arquitetural ou de segurança dedicada.

## Pré-requisitos

1. Ler documentos de regras e o escopo original.
2. Confirmar branch, status e diff.
3. Ler todos os arquivos alterados, consumidores e testes necessários.
4. Verificar resultados de validação fornecidos.
5. Não editar durante a revisão.

## Fluxo

1. Comparar diff com objetivo e escopo.
2. Verificar correção funcional e regressões.
3. Avaliar contratos, rotas, tipos, banco e tratamento de erros.
4. Avaliar autenticação, autorização e dados sensíveis.
5. Avaliar SEO, WhatsApp, carrinho, admin, UX e performance quando impactados.
6. Classificar somente achados demonstráveis.
7. Separar bloqueadores de sugestões opcionais.
8. Emitir decisão objetiva.

## Checklist de segurança e técnica

- [ ] Nenhum segredo ou arquivo de ambiente foi incluído.
- [ ] Proteções e validações server-side foram preservadas.
- [ ] Schema/migrations e dependências têm autorização.
- [ ] Contratos, rotas e tipos continuam compatíveis.
- [ ] Código segue a stack real e evita `any`.
- [ ] Não há alteração fora do escopo ou refatoração oportunista.
- [ ] Testes existentes não foram removidos.
- [ ] Cada achado cita arquivo, evidência, impacto e correção.

## Saída esperada

Classificação final, escopo e arquivos revisados, achados por severidade, evidências, validações e próximo passo.

Severidades: Crítico, Alto, Médio, Baixo e Observação.

## Regras de parada

Bloqueie a revisão quando faltar diff/escopo essencial, houver possível segredo, mudança destrutiva ou quebra de autenticação sem contexto.

## Restrições e integração

Não corrija achados sem pedido explícito e não reprove por preferência pessoal. Use `/review-code`, `/checklist-merge` e o template de relatório conforme a etapa.
