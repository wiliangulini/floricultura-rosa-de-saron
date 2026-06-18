# Floricultura Rosa de Saron

Vitrine digital para floricultura local com catálogo de produtos, carrinho no navegador e envio de pedidos pelo WhatsApp.

## Stack

- **Next.js** (App Router) com TypeScript strict
- **Tailwind CSS** v4
- **Prisma** ORM + PostgreSQL
- **Autenticação** customizada com HMAC-SHA256 (sessão em cookie)
- **Recuperação de senha** por token e email SMTP
- **Testes** com Vitest

## Requisitos

- Node.js 20 ou superior
- PostgreSQL 14 ou superior
- npm 10 ou superior

## Instalação

```bash
npm install
```

## Configurar variáveis de ambiente

Copie o arquivo de exemplo e preencha os valores:

```bash
cp .env.example .env
```

Edite o `.env` com as informações do seu ambiente. Consulte a [tabela de variáveis](#variáveis-de-ambiente) abaixo.

## Configurar banco de dados

Crie o banco de dados no PostgreSQL:

```sql
CREATE DATABASE floricultura_dev;
CREATE USER floricultura WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE floricultura_dev TO floricultura;
```

Atualize `DATABASE_URL` no `.env` com as credenciais criadas.

## Rodar migrations

```bash
npm run db:migrate:dev
```

Em produção, use:

```bash
npm run db:migrate:deploy
```

## Rodar seed

O seed cria categorias, produtos de exemplo e um usuário administrador temporário.

```bash
npm run db:seed
```

Credenciais do admin criadas pelo seed:

- **E-mail:** `admin@floricultura.com`
- **Senha temporária:** `admin123`

**Troque a senha imediatamente após o primeiro acesso em produção.**

## Desenvolvimento

```bash
npm run dev
```

Acesse em: `http://localhost:3000`

Painel admin: `http://localhost:3000/admin`

## Recuperação de senha do admin

O login administrativo tem o link **Esqueceu sua senha?**. O fluxo gera um token seguro, salva apenas o hash SHA-256 no banco, expira em 30 minutos e envia o link por email.

Para usar em produção, configure `NEXT_PUBLIC_SITE_URL` com a URL pública do site e preencha as variáveis SMTP (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`).

Em produção, `NEXT_PUBLIC_SITE_URL` deve ser uma URL pública absoluta, por exemplo `https://seudominio.com.br`. O fluxo de recuperação não envia links com `localhost` quando `NODE_ENV=production`.

Para Gmail, use senha de app em `SMTP_PASS`, não a senha normal da conta. Use `SMTP_HOST=smtp.gmail.com` com `SMTP_PORT=587` para STARTTLS ou `SMTP_PORT=465` para TLS direto. O `SMTP_FROM` deve usar a própria conta autenticada ou um alias/remetente autorizado pelo provedor.

Em desenvolvimento, `PASSWORD_RESET_DEV_LOG_LINK=true` registra o link de redefinição no log do servidor. Esse modo é ignorado em produção e não substitui a validação operacional de entrega real pelo provedor SMTP.

## Testes

```bash
npm test
```

Modo watch:

```bash
npm run test:watch
```

## Lint

```bash
npm run lint
```

Verificação de tipos TypeScript:

```bash
npm run typecheck
```

## Build de produção

```bash
npm run build
```

## Iniciar em produção

```bash
npm start
```

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `DATABASE_URL` | Sim | String de conexão PostgreSQL |
| `NEXT_PUBLIC_SITE_URL` | Sim (produção) | URL pública do site — usada em canonical, OG, sitemap e links de recuperação |
| `AUTH_SECRET` | Sim | Segredo HMAC para sessão admin — mínimo 32 caracteres aleatórios |
| `SMTP_HOST` | Sim (recuperação) | Host SMTP para envio do link de redefinição de senha |
| `SMTP_PORT` | Sim (recuperação) | Porta SMTP, normalmente `587` ou `465` |
| `SMTP_USER` | Sim (recuperação) | Usuário SMTP |
| `SMTP_PASS` | Sim (recuperação) | Senha SMTP |
| `SMTP_FROM` | Sim (recuperação) | Remetente dos emails de recuperação |
| `PASSWORD_RESET_DEV_LOG_LINK` | Não | Registra o link de reset no servidor somente fora de produção |
| `CLOUDINARY_CLOUD_NAME` | Sim (upload) | Cloud name Cloudinary para imagens de produto e foto da proprietária |
| `CLOUDINARY_API_KEY` | Sim (upload) | API key Cloudinary |
| `CLOUDINARY_API_SECRET` | Sim (upload) | API secret Cloudinary |
| `CLOUDINARY_FOLDER` | Não | Pasta base no Cloudinary (padrão: `produtos`) |

Gere um `AUTH_SECRET` seguro:

```bash
openssl rand -base64 32
```

## Checklist de deploy

- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env` configurado (não commitar)
- [ ] `DATABASE_URL` apontando para o banco de produção
- [ ] `AUTH_SECRET` definido com 32+ caracteres aleatórios
- [ ] `NEXT_PUBLIC_SITE_URL` definido com a URL real do site
- [ ] SMTP configurado se a recuperação de senha for usada
- [ ] Cloudinary configurado se upload de produto ou foto da proprietária for usado
- [ ] Migrations executadas (`npm run db:migrate:deploy`)
- [ ] Seed executado se banco estiver vazio (`npm run db:seed`)
- [ ] Senha do admin trocada após o seed
- [ ] Build validado (`npm run build`)
- [ ] Servidor iniciado (`npm start`)
- [ ] Acesso ao admin testado (`/admin/login`)
- [ ] Fluxo de pedido via WhatsApp testado
- [ ] Sitemap acessível (`/sitemap.xml`)
- [ ] Robots acessível (`/robots.txt`)

## Observações importantes

- **Sem Docker.** O projeto roda diretamente com Node.js e PostgreSQL local ou gerenciado.
- **Sem pagamento online.** A confirmação de valores, entrega e pagamento é feita pela floricultura via WhatsApp.
- **Pedidos via WhatsApp.** O carrinho gera uma mensagem formatada enviada para o número da loja via `wa.me`.
- **Admin protegido.** As rotas administrativas exigem sessão válida (proxy.ts), exceto login e recuperação de senha.
- **Recuperação de senha.** O token puro é enviado apenas por email; o banco armazena somente `tokenHash`, com expiração curta e uso único.
- **SEO local.** O projeto prioriza SEO para buscas locais com dados estruturados JSON-LD, sitemap, robots e metadados Open Graph.
- **Upload de imagens.** Produtos e foto da proprietária usam Cloudinary, aceitando JPG, PNG e WebP até 5 MB com validação no servidor.
