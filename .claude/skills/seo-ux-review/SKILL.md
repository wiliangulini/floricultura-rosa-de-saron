---
name: seo-ux-review
description: Revisa SEO local e UX mobile das páginas públicas da Floricultura Rosa de Saron. Use antes de publicar ou alterar páginas públicas, metadata ou layout.
---

# SEO/UX Review

## Quando usar

- alteração em página pública, `generateMetadata`, `sitemap.ts` ou `robots.ts`;
- alteração em layout, componente visual ou fluxo de carrinho/checkout público;
- antes de publicar uma nova página ou seção pública.

## Quando não usar

- alteração restrita à área administrativa sem efeito público;
- mudança puramente de lógica de servidor sem impacto em UI ou metadata.

## Checklist SEO local

- [ ] `generateMetadata` presente com `title`, `description`, Open Graph e Twitter Card.
- [ ] JSON-LD correto por tipo de página: `LocalBusiness` (home), `Product` (produto),
      `BreadcrumbList` (categoria).
- [ ] `canonical` definido; sem conteúdo duplicado por query params.
- [ ] `sitemap.ts`/`robots.ts` refletem as rotas públicas reais.
- [ ] URLs de produto/categoria usam slugs curtos e legíveis.
- [ ] HTML semântico (`h1`/`h2`, navegação, listas) e termos locais relevantes (cidade,
      bairro, região atendida).
- [ ] Endereço, telefone e WhatsApp visíveis e fáceis de encontrar.

## Checklist UX mobile

- [ ] Fluxo até o pedido é curto e claro no celular.
- [ ] `next/image` em todas as imagens, com `width`/`height`/`alt`; `priority` só acima
      da dobra.
- [ ] Carrinho mostra produtos, quantidades, subtotais e total estimado corretamente.
- [ ] Botão de enviar pedido via WhatsApp é evidente.
- [ ] Mensagens de erro explicam o problema e como resolver.
- [ ] Sem regressão perceptível em Core Web Vitals (LCP/CLS) nem no Lighthouse mobile.

## Saída esperada

Liste achados por página/componente, separando SEO de UX, com severidade (Crítico, Alto,
Médio, Baixo, Observação) e correção objetiva. Não trate preferência estética como
bloqueador. Não implemente a correção nesta skill — apenas reporte.

## Restrições

Não edite arquivos durante esta skill. Integre com `PROJECT_RULES.md §4/§5/§7` e
`.claude/rules/seo-local.md` / `.claude/rules/ui-mobile.md`.
