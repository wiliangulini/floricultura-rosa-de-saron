---
paths:
  - "src/lib/cart.ts"
  - "src/lib/whatsapp.ts"
  - "src/context/CartContext.tsx"
  - "src/components/public/*Cart*"
  - "src/components/public/WhatsAppFloatingButton.tsx"
  - "src/app/(public)/carrinho/**/*"
  - "src/app/(public)/pedido/**/*"
---

# Regra Claude — Carrinho e checkout WhatsApp

Derivada de `PROJECT_RULES.md §8` (com apoio em §3 e §5). Se esta rule divergir da regra
do projeto, atualize `PROJECT_RULES.md` primeiro. Procedimento, validação e formato de
relatório vivem no protocolo comum (`AGENTS.md`, `PROJECT_RULES.md §12`).

## Invariantes

- Carrinho vive em `localStorage`, sem exigir login do cliente; trate seus dados como
  não confiáveis e recalcule/valide quando necessário.
- Mensagem do WhatsApp usa `https://wa.me/NUMERO?text=MENSAGEM_CODIFICADA`; `NUMERO` em
  formato internacional só com dígitos; mensagem sempre via `encodeURIComponent`.
- Comportamento por `PriceType`:
  - `FIXED` e `STARTING_FROM` entram no total estimado (o segundo exibido como "A partir de").
  - `ON_REQUEST` exibido como "Valor sob consulta", **nunca** somado ao total, com aviso
    de contato.
- Mensagem inclui: identificação de pedido vindo do site, lista de produtos (nome,
  descrição curta, quantidade, preço unitário, subtotal), total estimado, modo de
  atendimento (retirada ou entrega com endereço completo) e o aviso padrão de que o
  pedido está sujeito à confirmação da floricultura.
- Nunca inclua dado sensível ou desnecessário na mensagem.
- Não altere a montagem da mensagem ou o formato do link sem mapear os testes em
  `src/lib/whatsapp.test.ts`.
