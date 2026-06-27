---
name: safe-refactor
description: Refatora código da Floricultura Rosa de Saron em passos pequenos, preservando comportamento, contratos, regras de negócio e testes.
---

# Safe Refactor

## Quando usar

- duplicação ou complexidade comprovada;
- separação de responsabilidade localizada;
- melhoria de legibilidade ou testabilidade sem mudança funcional;
- remoção de código morto confirmada.

## Quando não usar

- feature ou correção funcional;
- mudança de contrato, rota, schema ou regra de negócio;
- redesign arquitetural;
- alteração motivada somente por preferência estética.

## Pré-requisitos

1. Ler regras, arquivos, consumidores e testes.
2. Confirmar branch e alterações preexistentes.
3. Documentar comportamento que deve permanecer igual.
4. Identificar contratos públicos e forma de validação.
5. Apresentar plano incremental.

## Fluxo

1. Explicar o problema estrutural real.
2. Definir limite de arquivos e comportamento invariável.
3. Executar uma mudança lógica por vez.
4. Evitar formatação ou renomeação não relacionada.
5. Revisar diff após cada bloco.
6. Executar validações proporcionais.
7. Registrar evidência de preservação.

## Checklist de segurança e técnica

- [ ] Sem acesso a segredo ou arquivo real de ambiente.
- [ ] Sem migration, dependência ou comando destrutivo.
- [ ] Sem mudança silenciosa em autenticação, SEO, carrinho ou WhatsApp.
- [ ] Rotas, APIs, tipos e schema preservados.
- [ ] UI e responsividade preservadas fora do escopo.
- [ ] Sem `any`, abstração ou design pattern desnecessário.
- [ ] Testes e validações existentes não foram removidos.
- [ ] Diff pequeno, reversível e revisável.

## Saída esperada

Problema, comportamento preservado, arquivos lidos/alterados, refatoração, contratos, validações, evidências e riscos residuais.

## Regras de parada

Pare se a refatoração exigir contrato, migration, biblioteca, reescrita, mudança funcional ou crescer além do escopo.

## Restrições e integração

Use `.claude/commands/refactor-code.md`, respeite todos os documentos raiz e registre a entrega com o template quando necessário. Não misture feature, bugfix e refatoração.
