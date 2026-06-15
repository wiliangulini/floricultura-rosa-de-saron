# Etapa 28 — Reset Password / Profile Screen

## 1. Diagnóstico da estrutura atual

- O login admin atual fica em `/admin/login`, usa Server Action `loginAdmin`, busca `User` por e-mail, exige `active=true` e `role=ADMIN`, compara senha com `bcryptjs.compare()` e cria cookie de sessão.
- A sessão usa cookie `floricultura_admin_session`, `httpOnly`, `sameSite=lax`, `secure` em produção, duração de 8h, assinado com HMAC-SHA256 via `AUTH_SECRET`.
- A proteção de `/admin/:path*` e `/api/admin/:path*` está em `src/proxy.ts`, não em `middleware.ts`; o proxy refresca a sessão a cada request válida.
- O usuário autenticado é identificado pelo `userId` e `email` dentro do cookie lido por `readAdminSessionCookie()`.
- A biblioteca de hash é `bcryptjs`; o seed usa `bcrypt.hash(senha, 12)`.
- `passwordHash` está em `User.passwordHash`.
- `User`: `id`, `name`, `email @unique`, `passwordHash`, `role ADMIN`, `active`, `createdAt`, `updatedAt`.
- `Settings`: dados da floricultura, contato, endereço, redes, entrega, SEO e `ogImageUrl`; não há campos equivalentes para proprietária.
- Não existem `ownerName`, `ownerPhotoUrl`, `ownerDescription` nem fluxo de reset por token.
- Upload de imagens já existe em `src/server/images.ts` via Cloudinary, com limite 5MB, JPG/PNG/WebP, validação por assinatura real e bloqueio de SVG; está acoplado a produtos.
- Não existe serviço de email.
- Existem testes Vitest apenas para utilitários (`money`, `slug`, `whatsapp`).
- O padrão admin usa Server Actions, `useActionState`, componentes UI existentes e `requireAdminSession` local por action.
- Será necessária migration para `Settings` e `PasswordResetToken`.

## 2. Plano de implementação por metas

### Meta 1 — Auditoria e preparação
Objetivo: confirmar baseline e separar alterações sem tocar fora do escopo.  
Arquivos envolvidos: `PROJECT_RULES.md`, `package.json`, Prisma, auth, admin, upload, docs.  
O que será feito: revisar estado do git, confirmar scripts, variáveis e padrões antes de editar.  
Critérios de aceite: escopo confirmado, sem alterações funcionais ainda, comandos planejados documentados.

### Meta 2 — Banco de dados e Prisma
Objetivo: criar suporte persistente para dados da proprietária e tokens de reset.  
Arquivos envolvidos: `prisma/schema.prisma`, nova migration Prisma.  
O que será feito: adicionar `ownerName`, `ownerPhotoUrl`, `ownerDescription` em `Settings`; adicionar `PasswordResetToken` com `tokenHash` único, expiração, uso único e relação com `User`.  
Critérios de aceite: migration sem perda de dados, `User` com relação `passwordResetTokens`, `npx prisma validate` passando.

### Meta 3 — Página `/admin/perfil`
Objetivo: criar tela protegida e integrada ao painel.  
Arquivos envolvidos: `src/app/admin/perfil/page.tsx`, componentes de formulário necessários, `AdminSidebar`.  
O que será feito: criar página com seções “Alterar senha” e “Dados da proprietária”; adicionar item “Perfil” no menu.  
Critérios de aceite: rota acessível apenas com sessão válida, visual consistente, textos simples em português.

### Meta 4 — Troca de senha autenticada
Objetivo: permitir ao admin logado alterar a própria senha.  
Arquivos envolvidos: `src/app/admin/perfil/actions.ts`, formulário de senha.  
O que será feito: identificar `session.userId`, buscar `User`, validar senha atual com `bcryptjs.compare()`, validar nova senha/confirmar, impedir senha igual quando possível e salvar `bcrypt.hash(novaSenha, 12)`.  
Critérios de aceite: senha atual incorreta recusada, nova senha mínima 8, confirmação validada, campos limpos após sucesso, sem logout automático.

### Meta 5 — Dados e foto da proprietária
Objetivo: editar e salvar dados institucionais da proprietária.  
Arquivos envolvidos: `src/server/settings.ts`, `src/server/images.ts`, `src/app/admin/perfil/actions.ts`, formulário de perfil; possivelmente `/sobre`.  
O que será feito: reutilizar/refatorar upload existente para função genérica Cloudinary; validar JPG/JPEG/PNG/WebP, bloquear SVG, limitar 5MB, mostrar foto atual e preview; salvar em `Settings`.  
Critérios de aceite: dados persistem sem sobrescrever configurações reais, upload seguro, página pública institucional usa os dados quando existirem.

### Meta 6 — Link “Esqueceu sua senha?” no login
Objetivo: expor acesso ao fluxo de recuperação.  
Arquivos envolvidos: `src/app/admin/login/LoginForm.tsx`, `src/proxy.ts`.  
O que será feito: adicionar link abaixo da senha para `/admin/esqueci-senha`; liberar `/admin/esqueci-senha` e `/admin/redefinir-senha` no proxy como rotas públicas de autenticação.  
Critérios de aceite: link aparece no login e rotas de recuperação não redirecionam para login quando sem sessão.

### Meta 7 — Solicitação de redefinição por email
Objetivo: gerar token seguro e enviar instruções sem revelar existência do e-mail.  
Arquivos envolvidos: `src/app/admin/esqueci-senha/*`, `src/lib/password-reset.ts`, `src/lib/email.ts` ou `src/server/email.ts`.  
O que será feito: validar formato do e-mail, retornar sempre mensagem genérica, gerar token com `crypto.randomBytes`, salvar apenas hash SHA-256, expirar em 30 minutos, invalidar tokens antigos e enviar link por email.  
Critérios de aceite: token puro nunca aparece em tela/resposta/banco; e-mail inexistente, inativo ou não-admin recebe mesma mensagem genérica.

### Meta 8 — Página de redefinição de senha
Objetivo: permitir definir nova senha com token válido.  
Arquivos envolvidos: `src/app/admin/redefinir-senha/*`, `src/lib/password-reset.ts`.  
O que será feito: validar token, expiração e `usedAt`; validar senha mínima e confirmação; atualizar `User.passwordHash`; marcar token como usado em transação.  
Critérios de aceite: token usado/expirado inválido, reset válido altera senha, mensagem orienta login novamente.

### Meta 9 — Documentação, env e validação final
Objetivo: fechar configuração operacional e qualidade.  
Arquivos envolvidos: `.env.example`, `README.md`, testes novos.  
O que será feito: documentar SMTP e reset, atualizar observação de upload Cloudinary, adicionar testes para helpers de token/hash quando aplicável, rodar validações finais.  
Critérios de aceite: docs atualizadas, comandos finais passando ou bloqueios externos documentados.

## 3. Decisões técnicas propostas

- Dados da proprietária: salvar em `Settings` com `ownerName`, `ownerPhotoUrl`, `ownerDescription`.
- Upload da foto: reaproveitar Cloudinary existente em `src/server/images.ts`, extraindo validação/upload genéricos sem duplicar lógica de produto.
- Senha atual: validar com `bcryptjs.compare(currentPassword, user.passwordHash)`.
- Nova senha: salvar com `bcryptjs.hash(newPassword, 12)`.
- Token de reset: `crypto.randomBytes(32).toString("base64url")`.
- Armazenamento do token: salvar somente `sha256(token)` em `PasswordResetToken.tokenHash`, com expiração de 30 minutos e uso único.
- Email: criar serviço SMTP com `nodemailer`, pois o projeto não tem envio de email e Node/Next não fornece SMTP nativo.
- Variáveis novas: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`; usar `NEXT_PUBLIC_SITE_URL` existente para montar o link.
- Dependências: instalar `nodemailer` e, se necessário para TypeScript, `@types/nodemailer`.
- Seed: não redefinir senha nem preencher campos novos por padrão; no máximo ajustar create sem sobrescrever dados reais, se o Prisma exigir.
- README e `.env.example`: atualizar por causa das novas variáveis SMTP e do fluxo de recuperação.

## 4. Riscos e cuidados

- Login/logout/proxy: alterar apenas exceções públicas de recuperação em `src/proxy.ts`, mantendo `/admin` protegido.
- Reset inseguro: nunca aceitar reset sem token válido, não revelar e-mail existente, usar expiração curta e transação no uso do token.
- Exposição de segredos: nunca retornar `passwordHash`, token puro ou link em produção.
- Upload inseguro: manter validação server-side por conteúdo, bloquear SVG e limitar 5MB.
- Migration: adicionar apenas campos nullable e tabela nova; não alterar models não relacionados.
- Seed: evitar regravar senha para `admin123` em ambientes com dados reais.
- Email ausente: interface retorna mensagem segura; em produção não loga token/link; em desenvolvimento pode logar link somente com `NODE_ENV !== "production"`.
- Server/client components: manter páginas server-side e criar client components apenas para formulários com `useActionState` e preview de imagem.

## 5. Comandos de validação para a fase de execução

Scripts existentes no `package.json`:

```bash
npx prisma validate
npx prisma migrate status
npm run lint
npm run typecheck
npm test
npm run build
```

Comandos adicionais úteis após alterar Prisma:

```bash
npm run db:generate
```

Observação: `npx prisma migrate status` e geração/aplicação de migration dependem de `DATABASE_URL` válido.
