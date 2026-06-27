---
name: legacy-code-audit
description: Mapeia comportamento, acoplamentos e riscos de código existente antes de mudanças. Use para auditoria sem alteração automática.
---

# Legacy Code Audit

## Quando usar

- fluxo antigo ou pouco documentado;
- alteração com consumidores desconhecidos;
- preparação para refatoração;
- diagnóstico de dívida técnica real.

## Quando não usar

- implementação pequena e clara;
- revisão limitada ao diff;
- refatoração já aprovada e mapeada;
- correção urgente cuja causa já foi confirmada.

## Pré-requisitos

1. Ler documentos de regras e contexto do agente.
2. Confirmar branch e `git status`.
3. Delimitar módulo ou fluxo.
4. Ler arquivos centrais, consumidores e testes.
5. Não editar durante a auditoria.

## Fluxo

1. Mapear entrada, estado, dados, efeitos e saída.
2. Identificar responsabilidades e dependências.
3. Identificar contratos, rotas, tipos e persistência.
4. Verificar validação, erros, autenticação e autorização.
5. Avaliar riscos de regressão, segurança, performance e ausência de testes.
6. Classificar achados com evidências.
7. Propor melhorias pequenas e ordenadas, sem executá-las.

## Checklist de segurança e técnica

- [ ] Nenhum segredo ou `.env` foi acessado.
- [ ] Nenhum arquivo foi alterado.
- [ ] Carrinho, WhatsApp, SEO, admin e autenticação foram mapeados quando pertencem ao fluxo.
- [ ] `src/proxy.ts` foi tratado como proteção, não como middleware genérico.
- [ ] Consultas Prisma e limites Server/Client foram avaliados quando aplicável.
- [ ] Fatos e inferências estão separados.
- [ ] Dívida cosmética não foi tratada como bloqueador.
- [ ] Recomendações preservam o MVP e evitam reescrita.

## Saída esperada

Escopo, arquivos, fluxo atual, contratos, dependências, achados por severidade, riscos, lacunas de testes e plano incremental.

## Regras de parada

Pare se os arquivos centrais não estiverem disponíveis, a análise exigir ambiente externo ou a continuação depender de acesso sensível.

## Restrições e integração

Não altere arquivos nem invente arquitetura. Encaminhe refatoração aprovada para `safe-refactor` e use o template de relatório se a auditoria precisar ser persistida.
