# AGENTS.md

## Instruções obrigatórias para agentes de IA

Antes de qualquer alteração neste projeto, leia obrigatoriamente:

- `PROJECT_RULES.md`

Este projeto é uma vitrine digital para a Floricultura Rosa de Saron, desenvolvida com Next.js App Router, TypeScript, Tailwind CSS, Prisma e banco relacional.

## Regras principais

1. Não implementar nada fora do escopo solicitado.
2. Não adicionar bibliotecas sem necessidade real.
3. Não criar abstrações complexas para um MVP pequeno.
4. Não usar `any` sem justificativa explícita.
5. Não expor segredos, tokens, credenciais ou variáveis sensíveis.
6. Não alterar fluxo público, admin, autenticação ou APIs sem mapear o impacto.
7. Não remover validações, testes ou proteções para fazer build passar.
8. Antes de alterar muitos arquivos, mapear a estrutura existente.
9. Ao final, informar arquivos alterados, comandos executados e riscos remanescentes.

## Fluxos críticos do projeto

Tenha cuidado especial com:

- carrinho local;
- montagem da mensagem do WhatsApp;
- painel administrativo;
- autenticação do admin;
- rotas `/admin/*`;
- rotas `/api/admin/*`;
- SEO local;
- páginas públicas de produto e categoria;
- regras de segurança;
- performance mobile.

## Padrão de trabalho esperado

Antes de implementar:

1. Explique o que entendeu da tarefa.
2. Liste os arquivos que pretende analisar.
3. Liste os arquivos que provavelmente serão alterados.
4. Explique a estratégia técnica.
5. Aponte riscos.

Depois de implementar:

1. Liste arquivos criados/alterados.
2. Informe comandos executados.
3. Informe se rodou lint, build e testes.
4. Explique riscos ou pendências.
5. Sugira próximos passos apenas se forem realmente necessários.
