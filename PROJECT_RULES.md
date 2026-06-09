# PROJECT_RULES.md

## 1. Objetivo do projeto

O sistema será uma vitrine digital para uma floricultura pequena, com foco em apresentar produtos, facilitar a escolha do cliente e gerar pedidos pelo WhatsApp da loja.

O MVP deve permitir que o cliente:

- Navegue por produtos e categorias.
- Veja informações claras sobre cada produto.
- Adicione produtos ao carrinho local do navegador.
- Revise o pedido antes do envio.
- Envie o pedido para o WhatsApp da floricultura.

O sistema não terá pagamento online. A confirmação de valores, disponibilidade, entrega, retirada e pagamento será feita pela floricultura diretamente pelo WhatsApp.

## 2. Stack

A stack definida para o projeto é:

- Next.js (App Router).
- TypeScript com `strict: true` no `tsconfig.json`.
- Tailwind CSS.
- Prisma.
- Banco de dados relacional, preferencialmente PostgreSQL ou MySQL.
- Carrinho local no navegador.
- Pedido via WhatsApp usando `https://wa.me/NUMERO?text=MENSAGEM_CODIFICADA`.

Regras obrigatórias da stack:

- Não usar Docker.
- Não adicionar tecnologias fora da stack sem necessidade real.
- Não implementar pagamento online.
- Não implementar upload de imagens no MVP; essa etapa ficará para uma fase posterior.
- Não usar `any` no TypeScript sem um comentário explicando o motivo.

## 3. Regras de arquitetura

- Manter a arquitetura simples, legível e adequada a um projeto pequeno.
- Usar TypeScript de forma estrita sempre que possível, evitando `any` sem justificativa.
- Separar responsabilidades entre interface, regra de negócio, acesso a dados e utilitários.
- Usar Prisma como camada principal de acesso ao banco de dados.
- Centralizar configurações sensíveis em variáveis de ambiente.
- O carrinho deve ficar no navegador, preferencialmente em `localStorage`, sem exigir login do cliente.
- Dados do carrinho devem ser tratados como dados não confiáveis e recalculados/validados quando necessário.
- Evitar abstrações complexas, arquitetura excessiva ou padrões desnecessários para o tamanho do MVP.
- Antes de alterar muitos arquivos, analisar a estrutura existente do projeto.
- Criar código limpo, tipado, organizado e fácil de manter.

### Separação entre área pública e área administrativa

A separação entre as duas áreas deve ser clara e respeitada em todo o projeto:

**Rotas públicas** (acessíveis por qualquer visitante):

- `/` — página inicial
- `/produtos` — listagem de produtos
- `/categoria/[slug]` — produtos por categoria
- `/produto/[slug]` — detalhe do produto
- `/carrinho` — carrinho local

**Rotas administrativas** (exigem autenticação):

- `/admin` — painel principal
- `/admin/produtos` — gerenciar produtos
- `/admin/categorias` — gerenciar categorias
- `/admin/login` — login da administradora

**APIs públicas** (somente leitura, sem autenticação):

- `/api/produtos` — GET
- `/api/categorias` — GET
- `/api/produto/[slug]` — GET

**APIs administrativas** (exigem sessão válida em toda rota):

- `/api/admin/*`

O arquivo `middleware.ts` do Next.js é responsável por interceptar todas as rotas `/admin/*` e `/api/admin/*` e redirecionar ou retornar erro 401 quando não houver sessão válida.

## 4. Regras de SEO

SEO local é prioridade máxima do projeto. Toda decisão de estrutura, nomenclatura e conteúdo deve considerar o impacto no SEO.

- Cada página pública importante deve usar `generateMetadata` do Next.js App Router para definir `title`, `description` e metadados de forma dinâmica.
- Incluir Open Graph (`og:title`, `og:description`, `og:image`) e Twitter Card em todas as páginas públicas relevantes, especialmente na inicial e nas páginas de produto.
- Implementar dados estruturados JSON-LD:
  - `LocalBusiness` na página inicial, com nome, endereço, telefone e área de atendimento.
  - `Product` na página de cada produto, com nome, descrição, imagem e disponibilidade.
- Gerar `sitemap.xml` e `robots.txt` usando os recursos nativos do Next.js App Router.
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
- O acesso ao painel é feito em `/admin` com login simples por e-mail e senha.

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

- Usar NextAuth.js com Credentials provider (ou biblioteca equivalente).
- A senha da administradora deve ser armazenada com hash seguro (bcrypt ou argon2). Nunca em texto plano.
- O `middleware.ts` deve bloquear todas as rotas `/admin/*` e `/api/admin/*` sem sessão válida.
- Sessão deve expirar após inatividade prolongada.

### Upload de imagens (fase posterior ao MVP)

Quando o upload for implementado, as regras abaixo são obrigatórias:

- Aceitar apenas os formatos JPEG, PNG e WebP.
- Limitar o tamanho a 5 MB por arquivo.
- Validar o tipo do arquivo no servidor (verificar MIME type real, não apenas extensão).
- Armazenar os arquivos fora do diretório público estático; servir via URL controlada.
- Sanitizar o nome do arquivo antes de salvar para evitar path traversal.

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

O envio do pedido deve usar o formato:

`https://wa.me/NUMERO?text=MENSAGEM_CODIFICADA`

Regras obrigatórias:

- `NUMERO` deve estar em formato internacional, somente com dígitos.
- A mensagem deve ser codificada com `encodeURIComponent`.
- A mensagem deve ser clara, organizada e fácil de ler no WhatsApp.
- Incluir identificação de que é um pedido vindo pelo site.
- Incluir lista de produtos com nome, quantidade e subtotal.
- Incluir total estimado do pedido.
- Incluir observações do cliente, quando houver.
- Incluir nome do cliente e forma desejada de atendimento, quando esses campos existirem no fluxo.
- Informar que valores, disponibilidade, entrega e pagamento serão confirmados pela floricultura.
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

## 10. O que não deve ser implementado no MVP

Não implementar no MVP:

- Pagamento online.
- Integração com gateway de pagamento.
- Login ou conta para clientes.
- Automação de entrega.
- Cálculo avançado de frete.
- Cupons, cashback ou programa de fidelidade.
- Chat interno.
- Upload de imagens.
- Sistema complexo de permissões administrativas.
- Relatórios avançados.
- Integrações com ERP, marketplaces ou redes sociais.
- Aplicativo mobile nativo.
- Funcionalidades fora do escopo da vitrine, carrinho local, painel admin simples e pedido via WhatsApp.
