# CLAUDE.md

Leia e siga obrigatoriamente:

- `PROJECT_RULES.md`
- `AGENTS.md`

## Como trabalhar neste projeto com Claude Code

Este projeto deve ser tratado como um MVP real de cliente, com prioridade em:

- simplicidade;
- segurança;
- SEO local;
- UX mobile;
- código tipado;
- manutenibilidade;
- baixo overengineering.

## Regras para planejamento

Antes de implementar qualquer alteração relevante:

1. Leia os arquivos relacionados ao fluxo.
2. Explique o impacto da alteração.
3. Liste arquivos que serão alterados.
4. Justifique tecnicamente a solução.
5. Evite mudanças fora do escopo.

## Regras para implementação

- Faça a menor alteração correta.
- Preserve o padrão existente do projeto.
- Não crie arquitetura nova sem necessidade.
- Não misture feature, refatoração e correção de bug na mesma alteração sem motivo.
- Não altere autenticação, middleware ou schema Prisma sem revisar impacto.
- Não altere SEO sem validar metadata, canonical, sitemap e dados estruturados quando aplicável.

## Regras para revisão final

Ao finalizar, responda com:

1. O que foi alterado.
2. Arquivos alterados.
3. Comandos executados.
4. Resultado de lint/build/testes.
5. Riscos remanescentes.
6. Pontos que precisam de validação manual.
