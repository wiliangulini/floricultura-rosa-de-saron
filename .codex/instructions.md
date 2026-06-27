# Instruções operacionais do Codex

## Leitura e precedência

1. Siga a solicitação atual do usuário.
2. Leia e respeite `PROJECT_RULES.md`.
3. Leia `AGENTS.md`.
4. Leia `CODEX.md` e este arquivo.
5. Leia `CLAUDE.md` quando houver continuidade ou alteração na configuração de agentes.
6. Baseie decisões no código, testes e documentação reais.

## Protocolo antes de editar

1. Confirme objetivo, escopo permitido e resultado esperado.
2. Confirme branch, `git status` e alterações preexistentes.
3. Leia os arquivos a alterar e consumidores relevantes.
4. Mapeie impacto em tipos, rotas, estado, banco, autenticação, SEO, UX e testes.
5. Informe entendimento, arquivos, estratégia e riscos antes de mudanças sensíveis ou multiarquivo.

## Menor mudança correta

- Preserve Next.js App Router, React, TypeScript estrito, Tailwind v4 e Prisma 7.
- Reutilize padrões existentes e scripts definidos em `package.json`.
- Não crie abstração, dependência ou configuração especulativa.
- Não misture feature, correção e refatoração sem justificativa.
- Não remova testes, validações ou proteções para fazer build passar.
- Não altere runtime sem autorização explícita.

## Fluxos críticos

Avalie com cuidado:

- carrinho em `localStorage`;
- montagem e codificação da mensagem do WhatsApp;
- SEO local, metadata, canonical, sitemap e dados estruturados;
- painel e autenticação administrativa customizada;
- proteção em `src/proxy.ts` para `/admin/*` e `/api/admin/*`;
- Prisma/PostgreSQL e registro único de `Settings`;
- Cloudinary e validação server-side de uploads;
- responsividade e performance mobile.

## Operação segura

- Não leia ou exponha `.env`, tokens, credenciais, chaves ou dados pessoais.
- Não instale dependências, execute migrations, seed ou comandos destrutivos sem autorização.
- Não faça commit, push, merge, rebase ou troca de branch sem solicitação.
- Preserve `.claude/`, `CLAUDE.md` e `.claude/settings.local.json`.
- `.codex/prompts/` contém templates para copiar/colar; não presuma carregamento automático.

## Revisão e diagnóstico

Em revisão, auditoria ou diagnóstico, comece sem editar. Diferencie fatos, hipóteses e recomendações. Só implemente quando o pedido autorizar a correção.

## Relatório final

Informe escopo atendido, arquivos criados/alterados/preservados, decisões, comandos, resultados, validações não executadas, riscos e estado final do Git. Use `docs/ai-reports/TEMPLATE-agent-report.md` quando a continuidade precisar ser persistente.
