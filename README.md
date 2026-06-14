# Floricultura Rosa de Saron

Vitrine digital para floricultura local com catálogo de produtos, carrinho no navegador e envio de pedidos pelo WhatsApp.

## Stack

- **Next.js** (App Router) com TypeScript strict
- **Tailwind CSS** v4
- **Prisma** ORM + PostgreSQL
- **Autenticação** customizada com HMAC-SHA256 (sessão em cookie)
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
| `NEXT_PUBLIC_SITE_URL` | Sim (produção) | URL pública do site — usada em canonical, OG e sitemap |
| `AUTH_SECRET` | Sim | Segredo HMAC para sessão admin — mínimo 32 caracteres aleatórios |
| `CLOUDINARY_CLOUD_NAME` | Não (MVP) | Cloud name Cloudinary — upload previsto para fase posterior |
| `CLOUDINARY_API_KEY` | Não (MVP) | API key Cloudinary |
| `CLOUDINARY_API_SECRET` | Não (MVP) | API secret Cloudinary |
| `CLOUDINARY_FOLDER` | Não (MVP) | Pasta no Cloudinary (padrão: `produtos`) |

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
- **Admin protegido.** Todas as rotas `/admin/*` e `/api/admin/*` exigem sessão válida (proxy.ts).
- **SEO local.** O projeto prioriza SEO para buscas locais com dados estruturados JSON-LD, sitemap, robots e metadados Open Graph.
- **Upload de imagens** está planejado para uma fase posterior ao MVP. As variáveis Cloudinary existem no código mas o upload não está exposto na interface.
