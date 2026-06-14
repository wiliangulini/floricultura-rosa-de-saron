# Etapa 23 — Performance e Imagens

## Resumo
Otimizar apenas o site público, sem mudar rotas, banco, APIs ou área administrativa. O foco será reduzir CLS, melhorar carregamento de imagens, limitar JS público ao necessário e manter Lighthouse mobile como referência.

## Mudanças Principais
- Trocar imagens públicas com `fill` por `<Image>` com `width` e `height` explícitos onde fizer sentido: Hero, `ProductCard`, carrinho e miniaturas.
- Usar `preload` somente nas imagens acima da dobra: Hero da home e imagem principal da página de produto. Remover `priority` porque a versão local do Next marca essa prop como deprecated.
- Manter lazy loading padrão do `next/image` para cards, galeria, carrinho e imagens abaixo da primeira dobra.
- Criar ou ajustar um fallback visual leve para imagem ausente, com área reservada para evitar layout shift.
- Remover `CartProvider` do layout público global e aplicar somente nas páginas/trechos que usam carrinho: home com cards, catálogo, categoria, produto, carrinho e pedido.
- Manter `/sobre` e `/contato` sem JS de carrinho.
- Remover `"use client"` de `Button` se continuar sem hooks/browser APIs, reduzindo boundaries client desnecessárias.
- Revisar fonte global mantendo system font stack, sem carregar Google Fonts ou biblioteca nova.
- Não adicionar dependências.

## Interfaces e Arquivos Previstos
- Sem alteração em Prisma, APIs públicas, rotas ou contratos externos.
- Props públicas de `ProductCard`, `Button`, `CartView` e `CheckoutForm` devem permanecer compatíveis.
- Arquivos previstos para alteração: `src/app/(public)/layout.tsx`, páginas públicas com produtos/carrinho, `src/components/public/ProductCard.tsx`, componentes de carrinho com imagem, `src/components/ui/Button.tsx` e `src/app/globals.css`.
- Possível arquivo novo: um pequeno componente server-only para fallback de imagem pública, se reduzir duplicação sem aumentar complexidade.

## Validação
- Rodar `npm run lint`.
- Rodar `npm run build`.
- Opcional, mas recomendado: `npm run typecheck`.
- Testar manualmente: home, `/produtos`, `/categoria/[slug]`, `/produto/[slug]`, `/carrinho`, `/pedido`, `/sobre` e `/contato`.
- Testar Lighthouse: subir produção com `npm run build` e `npm run start`, abrir `http://localhost:3000`, usar Chrome DevTools > Lighthouse > Mobile, categorias Performance e Accessibility.

## Assumptions
- Não será criada migração para salvar dimensões reais das imagens; serão usadas dimensões coerentes com o layout atual.
- `next.config.ts` continuará aceitando imagens HTTPS remotas amplamente para não quebrar URLs manuais já cadastradas.
- A área administrativa ficará fora do escopo, exceto efeitos seguros em componentes compartilhados como `Button` e CSS global.
