# PROJECT_RULES.md

## 1. Objetivo do projeto

O sistema é uma vitrine digital para uma floricultura pequena, com foco em apresentar produtos, facilitar a escolha do cliente e gerar pedidos pelo WhatsApp da loja.

O sistema permite que o cliente:

- Navegue por produtos e categorias.
- Veja informações claras sobre cada produto.
- Adicione produtos ao carrinho local do navegador.
- Revise o pedido antes do envio.
- Envie o pedido para o WhatsApp da floricultura.

O sistema não tem pagamento online. A confirmação de valores, disponibilidade, entrega, retirada e pagamento é feita pela floricultura diretamente pelo WhatsApp.

## 2. Stack

A stack do projeto é:

- **Next.js 16** (App Router).
- **TypeScript 6** com `strict: true` no `tsconfig.json`.
- **Tailwind CSS v4**.
- **Prisma 7** com PostgreSQL 14+.
- **bcryptjs** para hash de senhas.
- **nodemailer** para envio de email SMTP (recuperação de senha).
- **Cloudinary** para upload e armazenamento de imagens.
- **Vitest** para testes unitários.
- **Playwright** para testes E2E.
- Carrinho local no navegador (`localStorage`).
- Pedido via WhatsApp usando `https://wa.me/NUMERO?text=MENSAGEM_CODIFICADA`.

Regras obrigatórias da stack:

- Não usar Docker.
- Não adicionar tecnologias fora da stack sem necessidade real.
- Não implementar pagamento online.
- Não usar `any` no TypeScript sem um comentário explicando o motivo.
- No Prisma 7, a URL do banco deve ser configurada exclusivamente em `prisma/prisma.config.ts`. Não incluir `url` no bloco `datasource` do `schema.prisma`.

## 3. Regras de arquitetura

- Manter a arquitetura simples, legível e adequada a um projeto pequeno.
- Usar TypeScript de forma estrita sempre que possível, evitando `any` sem justificativa.
- Separar responsabilidades entre interface, regra de negócio, acesso a dados e utilitários.
- Usar Prisma como camada principal de acesso ao banco de dados.
- Centralizar configurações sensíveis em variáveis de ambiente.
- O carrinho deve ficar no navegador em `localStorage`, sem exigir login do cliente.
- Dados do carrinho devem ser tratados como dados não confiáveis e recalculados/validados quando necessário.
- Evitar abstrações complexas, arquitetura excessiva ou padrões desnecessários para o tamanho do projeto.
- Antes de alterar muitos arquivos, analisar a estrutura existente do projeto.
- Criar código limpo, tipado, organizado e fácil de manter.

### Modelos de banco de dados

Entidades principais: `User`, `PasswordResetToken`, `Category`, `Product`, `ProductImage`, `Settings`.

Enums: `UserRole` (ADMIN), `PriceType` (FIXED, STARTING_FROM, ON_REQUEST).

O modelo `Settings` armazena todas as configurações da loja: WhatsApp, endereço, SEO, redes sociais, horário e descrições. Há sempre exatamente um registro de `Settings`.

### Separação entre área pública e área administrativa

A separação entre as duas áreas deve ser clara e respeitada em todo o projeto:

**Rotas públicas** (acessíveis por qualquer visitante):

- `/` — página inicial
- `/produtos` — listagem de produtos
- `/categoria/[slug]` — produtos por categoria
- `/produto/[slug]` — detalhe do produto
- `/sobre` — sobre a floricultura
- `/contato` — informações de contato
- `/carrinho` — carrinho local
- `/pedido` — finalização do pedido (checkout WhatsApp)

**Rotas administrativas** (exigem autenticação, exceto as listadas abaixo):

- `/admin` — painel principal
- `/admin/login` — login da administradora *(sem autenticação)*
- `/admin/logout` — encerramento de sessão
- `/admin/esqueci-senha` — solicitação de recuperação de senha *(sem autenticação)*
- `/admin/redefinir-senha` — redefinição via token *(sem autenticação)*
- `/admin/perfil` — edição do perfil da proprietária
- `/admin/configuracoes` — configurações gerais da loja
- `/admin/produtos` — gerenciar produtos
- `/admin/categorias` — gerenciar categorias

**APIs públicas** (somente leitura, sem autenticação):

- `/api/produtos` — GET
- `/api/categorias` — GET
- `/api/produto/[slug]` — GET

**APIs administrativas**: Nenhuma rota `/api/admin/**` está implementada. O `src/proxy.ts` protege esse path por política; qualquer rota futura nesse escopo exigirá sessão válida.

O arquivo `src/proxy.ts` é o middleware do Next.js responsável por interceptar todas as rotas `/admin/*` e `/api/admin/*` e redirecionar ou retornar erro 401 quando não houver sessão válida.

> **Atenção:** O projeto usa `src/proxy.ts`, não `middleware.ts`. O Next.js 16 compila `proxy.ts` como middleware via o export `config.matcher`.

## 4. Regras de SEO

SEO local é prioridade máxima do projeto. Toda decisão de estrutura, nomenclatura e conteúdo deve considerar o impacto no SEO.

- Cada página pública importante deve usar `generateMetadata` do Next.js App Router para definir `title`, `description` e metadados de forma dinâmica.
- Incluir Open Graph (`og:title`, `og:description`, `og:image`) e Twitter Card em todas as páginas públicas relevantes, incluindo: página inicial, produtos, produto, categoria, sobre e contato.
- Implementar dados estruturados JSON-LD:
  - `LocalBusiness` na página inicial, com nome, endereço, telefone e área de atendimento.
  - `Product` na página de cada produto, com nome, descrição, imagem e disponibilidade.
  - `BreadcrumbList` na página de cada categoria.
- Gerar `sitemap.xml` e `robots.txt` usando os recursos nativos do Next.js App Router (`src/app/sitemap.ts` e `src/app/robots.ts`).
- Usar meta `canonical` para evitar conteúdo duplicado em URLs com query params.
- Usar textos claros com termos locais relevantes, como nome da floricultura, cidade, bairro e região atendida.
- Produtos e categorias devem ter URLs amigáveis baseadas em slugs.
- Usar HTML semântico para títulos (`<h1>`, `<h2>`), listas, botões, navegação e conteúdo principal.
- Incluir informações visíveis e fáceis de encontrar sobre endereço, telefone, WhatsApp e área de atendimento.
- Evitar conteúdo duplicado, páginas vazias ou textos genéricos sem valor local.
- Meta critério de qualidade: Core Web Vitals LCP < 2,5 s e CLS < 0,1 no mobile.

## 5. Regras de UX

- A experiência deve ser simples, clara e rápida, especialmente no celular.
- O cliente deve conseguir entender o produto, adicionar ao carrinho e enviar o pedido com poucos passos.
- O carrinho deve mostrar produtos, quantidades, subtotais e total estimado.
- O botão de enviar pedido pelo WhatsApp deve ser evidente no fluxo de compra.
- Informar claramente que o pedido será confirmado pela floricultura via WhatsApp.
- Evitar telas complexas, excesso de campos e interações difíceis.
- Mensagens de erro devem explicar o problema e indicar como resolver.

### Painel administrativo

O painel deve ser simples o suficiente para ser usado por uma pessoa sem conhecimento técnico:

- Todos os labels, botões, mensagens de sucesso e erro devem estar em português.
- Nenhuma ação destrutiva (excluir produto, excluir categoria) pode ser executada sem uma confirmação explícita e clara.
- Toda operação de salvar, editar ou excluir deve ter feedback visual imediato (sucesso ou erro).
- Formulários devem ter validação inline com mensagens sem jargão técnico.
- A navegação do admin deve ser direta: uma ação por tela, sem menus escondidos.
- O acesso ao painel é feito em `/admin/login` com login por e-mail e senha.

## 6. Regras de segurança

- Nunca expor segredos, credenciais ou strings de conexão no frontend.
- Usar variáveis de ambiente para dados sensíveis.
- Validar dados recebidos do cliente antes de salvar ou processar.
- Sanitizar e codificar dados usados em URLs, especialmente na mensagem do WhatsApp.
- Evitar permissões amplas no banco de dados.
- Não confiar em valores vindos do carrinho local para operações administrativas sensíveis.
- Manter dependências atualizadas e evitar pacotes desnecessários.
- Não registrar em logs dados pessoais além do necessário para depuração.
- Não expor IDs internos, stack traces ou estrutura do banco em respostas de erro públicas.

### Autenticação do painel administrativo

- A autenticação é **customizada** com HMAC-SHA256 usando a Web Crypto API. O projeto **não usa NextAuth**.
- O cookie de sessão (`floricultura_admin_session`) é assinado com `AUTH_SECRET` (mínimo 32 caracteres).
- O cookie tem duração de **8 horas** com renovação automática (*sliding window*) a cada request.
- O cookie é `HttpOnly`, `SameSite=lax` e `Secure` em produção.
- A comparação da assinatura usa `timingSafeEqual` para evitar timing attacks.
- A senha da administradora é armazenada com hash bcryptjs (12 rounds). Nunca em texto plano.
- O `src/proxy.ts` bloqueia todas as rotas `/admin/*` e `/api/admin/*` sem sessão válida.

### Recuperação de senha

- A administradora pode solicitar recuperação de senha em `/admin/esqueci-senha`.
- Um token aleatório (32 bytes, base64url) é gerado; **apenas o hash SHA256 do token é salvo no banco**.
- O link com o token plano é enviado por email via SMTP (nodemailer).
- O token expira em 30 minutos e é de uso único.
- A resposta ao formulário é genérica, independente de o email existir ou não.

### Upload de imagens

- Upload realizado via Cloudinary (`src/server/images.ts`).
- Aceitar apenas os formatos JPEG, PNG e WebP.
- Limitar o tamanho a 5 MB por arquivo.
- Validar o tipo do arquivo no servidor por magic bytes (não apenas pela extensão). SVG é explicitamente rejeitado.
- O nome público no Cloudinary é gerado a partir do nome do produto e timestamp; o nome original do arquivo não é preservado.

## 7. Regras de performance e imagens

- Usar `next/image` para **todas** as imagens do projeto, sem exceção. Nunca usar `<img>` diretamente.
- Definir `width`, `height` e `alt` em todo componente `<Image>`.
- O Next.js converte imagens automaticamente para WebP/AVIF; não forçar formatos manualmente.
- Imagens de produto devem ser servidas no tamanho adequado ao layout — nunca uma imagem full-size redimensionada via CSS.
- Usar `loading="lazy"` (padrão do `next/image`) para imagens abaixo da dobra.
- Usar `priority` apenas para imagens acima da dobra (ex.: hero da página inicial, primeira imagem de produto).
- Não importar arquivos de imagem pesados diretamente no bundle JS.
- Objetivo Lighthouse no mobile: Performance ≥ 85 e Acessibilidade ≥ 90.

## 8. Regras para mensagens WhatsApp

O envio do pedido usa o formato:

`https://wa.me/NUMERO?text=MENSAGEM_CODIFICADA`

Regras obrigatórias:

- `NUMERO` deve estar em formato internacional, somente com dígitos.
- A mensagem deve ser codificada com `encodeURIComponent`.
- A mensagem deve ser clara, organizada e fácil de ler no WhatsApp.
- Incluir identificação de que é um pedido vindo pelo site.
- Incluir lista de produtos com nome, descrição curta (quando presente), quantidade, preço unitário e subtotal.
- O comportamento por tipo de preço é:
  - `FIXED`: preço fixo exibido; incluído no total estimado.
  - `STARTING_FROM`: exibido como "A partir de"; incluído no total estimado.
  - `ON_REQUEST`: exibido como "Valor sob consulta"; **não incluído no total**; acompanhado de aviso para contato.
- Incluir total estimado do pedido (excluindo itens `ON_REQUEST`).
- Incluir, quando preenchidos pelo cliente: nome, data desejada, forma de pagamento, mensagem de cartão, observações.
- Incluir modo de atendimento:
  - Retirada: indicar "Retirar na Loja".
  - Entrega: indicar endereço completo (rua, número, bairro, cidade, ponto de referência) e telefone de contato.
- Incluir aviso padrão: "Pedido sujeito à confirmação de disponibilidade, prazo e pagamento pela floricultura."
- Não incluir dados sensíveis ou informações desnecessárias na mensagem.

## 9. Regras de nomenclatura

- Usar nomes claros, descritivos e consistentes.
- Usar português para textos exibidos ao usuário.
- Usar inglês ou português no código conforme o padrão já existente no projeto, sem misturar estilos no mesmo contexto.
- Componentes React devem usar `PascalCase`.
- Funções, variáveis e constantes locais devem usar `camelCase`.
- Constantes globais podem usar `UPPER_SNAKE_CASE` quando fizer sentido.
- Arquivos de componentes devem ter nomes claros e relacionados à responsabilidade do componente.
- Slugs de produtos e categorias devem ser curtos, legíveis e amigáveis para SEO.
- Evitar abreviações obscuras.

## 10. O que não deve ser implementado

Não implementar:

- Pagamento online.
- Integração com gateway de pagamento.
- Login ou conta para clientes.
- Automação de entrega.
- Cálculo avançado de frete.
- Cupons, cashback ou programa de fidelidade.
- Chat interno.
- Sistema complexo de permissões administrativas.
- Relatórios avançados.
- Integrações com ERP, marketplaces ou redes sociais.
- Aplicativo mobile nativo.
- Funcionalidades fora do escopo da vitrine, carrinho local, painel admin simples e pedido via WhatsApp.

## 11. Variáveis de ambiente

Todas as variáveis abaixo são obrigatórias em produção. O arquivo `.env.example` documenta os valores esperados.

| Variável | Propósito |
| --- | --- |
| `DATABASE_URL` | String de conexão PostgreSQL |
| `NEXT_PUBLIC_SITE_URL` | URL pública do site (ex.: `https://rosa-de-saron.com`) |
| `AUTH_SECRET` | Segredo HMAC para assinar cookies de sessão (mínimo 32 caracteres) |
| `SMTP_HOST` | Servidor SMTP para envio de email |
| `SMTP_PORT` | Porta SMTP (ex.: 587 para STARTTLS, 465 para TLS) |
| `SMTP_USER` | Usuário SMTP |
| `SMTP_PASS` | Senha SMTP |
| `SMTP_FROM` | Endereço de origem dos emails enviados |
| `CLOUDINARY_CLOUD_NAME` | Nome do cloud no Cloudinary |
| `CLOUDINARY_API_KEY` | Chave de API do Cloudinary |
| `CLOUDINARY_API_SECRET` | Segredo de API do Cloudinary |
| `CLOUDINARY_FOLDER` | Pasta base para uploads (padrão: `"produtos"`) |
| `ADMIN_INITIAL_PASSWORD` | Senha inicial do admin criada pelo seed (somente na criação) |
| `PASSWORD_RESET_DEV_LOG_LINK` | `true` em desenvolvimento para logar o link de reset no console |
| `DATABASE_URL_E2E` | Banco separado exclusivo para testes Playwright |
| `E2E_DB_CONFIRMED` | `true` para permitir uso de banco sem "e2e" ou "test" no nome |

## 12. Comandos de validação

Estes comandos devem passar antes de qualquer entrega:

```bash
npm run lint        # ESLint — verificar estilo e boas práticas
npm run typecheck   # tsc --noEmit — verificar tipos TypeScript
npm run test        # Vitest — testes unitários
npm run test:e2e    # Playwright — testes de integração e2e
npm run build       # build de produção (verifica erros de compilação)
```

Comandos auxiliares de banco:

```bash
npm run db:generate       # gera o Prisma Client após alterações no schema
npm run db:migrate:dev    # aplica migrations em desenvolvimento
npm run db:migrate:deploy # aplica migrations em produção
npm run db:seed           # popula banco com dados iniciais (cria admin)
npm run db:studio         # abre o Prisma Studio (GUI)
npm run db:setup:e2e      # cria e prepara banco isolado para e2e
```
