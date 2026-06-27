---
description: Revisa segurança dos fluxos reais sem acessar segredos ou alterar arquivos.
argument-hint: "[fluxo, rota ou diff]"
disable-model-invocation: true
---

# Revisão de segurança

Escopo: $ARGUMENTS

Não altere arquivos e não acesse `.env`, credenciais ou tokens.

1. Leia regras, diff e arquivos reais relacionados.
2. Avalie autenticação HMAC, cookie administrativo, autorização, `src/proxy.ts` e rotas públicas/admin quando aplicável.
3. Avalie validação server-side, mensagens de erro, CSRF/XSS, dados pessoais e logs.
4. Em uploads, confira tamanho, magic bytes, formatos permitidos e uso server-side das credenciais Cloudinary.
5. Em WhatsApp e URLs, confira normalização e codificação.
6. Em recuperação de senha, preserve token aleatório, hash, expiração, uso único e resposta não enumerável.
7. Evite falsos positivos: cite evidência, exploração plausível, impacto e correção.

Classifique achados por severidade e informe validações recomendadas. Não enfraqueça proteções para corrigir problemas.
