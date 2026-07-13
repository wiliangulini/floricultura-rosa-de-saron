---
paths:
  - "src/components/**/*.tsx"
  - "src/app/**/*.tsx"
  - "src/app/globals.css"
---

# Regra Claude — UI/UX mobile

Derivada de `PROJECT_RULES.md §5` e `§7`. Se esta rule divergir da regra do projeto,
atualize `PROJECT_RULES.md` primeiro. Procedimento, validação e formato de relatório
vivem no protocolo comum (`AGENTS.md`, `PROJECT_RULES.md §12`).

## Invariantes

- Experiência pública mobile-first: simples, clara, poucos passos até o pedido.
- Usar `next/image` para **todas** as imagens, sem exceção — nunca `<img>` direto.
  Sempre definir `width`, `height` e `alt`; `priority` só para imagens acima da dobra.
- Painel admin: labels/mensagens em português, uma ação por tela, navegação direta.
- Nenhuma ação destrutiva (excluir produto/categoria) sem confirmação explícita.
- Formulários com validação inline e mensagens sem jargão técnico; feedback visual
  imediato de sucesso/erro em toda operação de salvar/editar/excluir.
- Não adicionar biblioteca visual/UI nova sem aprovação explícita.
- Meta Lighthouse mobile: Performance ≥ 85, Acessibilidade ≥ 90 — não regredir.
