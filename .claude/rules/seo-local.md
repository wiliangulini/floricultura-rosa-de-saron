---
paths:
  - "src/app/(public)/**/*"
  - "src/app/layout.tsx"
  - "src/app/sitemap.ts"
  - "src/app/robots.ts"
---

# Regra Claude — SEO local

Derivada de `PROJECT_RULES.md §4`. SEO local é prioridade máxima do projeto — trate como
regra de alto impacto. Se esta rule divergir da regra do projeto, atualize
`PROJECT_RULES.md` primeiro. Procedimento, validação e formato de relatório vivem no
protocolo comum (`AGENTS.md`, `PROJECT_RULES.md §12`).

## Invariantes

- Toda página pública relevante usa `generateMetadata` com `title`, `description`,
  Open Graph e Twitter Card.
- Dados estruturados JSON-LD obrigatórios: `LocalBusiness` na home, `Product` na página
  de produto, `BreadcrumbList` na página de categoria.
- `src/app/sitemap.ts` e `src/app/robots.ts` devem refletir as rotas públicas reais.
- Usar `canonical` para evitar conteúdo duplicado em URLs com query params.
- Produtos e categorias mantêm URLs amigáveis baseadas em slugs curtos e legíveis.
- HTML semântico (`<h1>`, `<h2>`, navegação, listas) e informações de contato/endereço
  visíveis e fáceis de encontrar.
- Meta de qualidade: Core Web Vitals LCP < 2,5 s e CLS < 0,1 no mobile — não regrida isso
  ao alterar layout ou imagens.
