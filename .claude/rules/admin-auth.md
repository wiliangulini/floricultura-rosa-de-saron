---
paths:
  - "src/proxy.ts"
  - "src/lib/auth.ts"
  - "src/app/admin/**/*"
  - "src/app/api/admin/**/*"
  - "src/components/admin/**/*"
---

# Regra Claude — Autenticação admin

Derivada de `PROJECT_RULES.md §6` (com apoio em §3). Se esta rule divergir da regra do
projeto, atualize `PROJECT_RULES.md` primeiro. Procedimento, validação e formato de
relatório vivem no protocolo comum (`AGENTS.md`, `PROJECT_RULES.md §12`).

## Invariantes

- Autenticação **customizada** com HMAC-SHA256 via Web Crypto API. O projeto não usa
  NextAuth/Auth.js — não introduza essas dependências.
- Cookie de sessão `floricultura_admin_session`: `HttpOnly`, `SameSite=lax`, `Secure` em
  produção, duração de 8 horas com renovação automática (*sliding window*).
- Comparação de assinatura sempre via `timingSafeEqual` (evitar timing attack).
- Senha da administradora sempre com hash bcryptjs (12 rounds); nunca texto plano.
- `src/proxy.ts` bloqueia toda rota `/admin/*` e `/api/admin/*` sem sessão válida — não
  enfraqueça esse bloqueio nem adicione exceção sem autorização explícita.
- Recuperação de senha: token aleatório (32 bytes, base64url); só o hash SHA-256 do token
  é salvo no banco; expira em 30 min, uso único; resposta ao formulário é sempre genérica.
- Área sensível: qualquer alteração aqui exige plano antes de editar (ver `CLAUDE.md`).
