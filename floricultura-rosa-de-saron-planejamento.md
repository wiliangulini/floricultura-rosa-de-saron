A melhor forma de usar os dois é trabalhar em **ciclos pequenos**: peça para o **Codex implementar uma etapa objetiva**, depois peça para o **Claude Code revisar, refatorar e validar qualidade**. O Codex é adequado para execução de tarefas de engenharia, criação de features e alterações em paralelo; Claude Code também entende o codebase, edita arquivos, executa comandos e é muito útil para revisão, refatoração e validação arquitetural. ([OpenAI][1])

Abaixo está o roadmap técnico já dividido em etapas pequenas.

---

# Roadmap técnico — Floricultura com Next.js, Admin, SEO e WhatsApp

## Regras gerais para todos os prompts

Use estas regras em todos os prompts, tanto no Codex quanto no Claude Code:

```md
Regras obrigatórias do projeto:

- Projeto para floricultura pequena.
- Stack principal: Next.js + TypeScript + Tailwind CSS + Prisma + banco relacional.
- Não usar Docker.
- Não implementar pagamento online.
- O pedido deve ser enviado pelo WhatsApp usando wa.me + encodeURIComponent.
- Priorizar SEO, performance, simplicidade e UX para pessoa não técnica.
- Código limpo, tipado e organizado.
- Não criar funcionalidades fora do escopo da etapa.
- Antes de alterar muitos arquivos, analise a estrutura existente.
- Ao final, informe os arquivos criados/alterados e comandos que preciso executar.
- Sempre que possível, rode lint/build/test ou indique exatamente o comando.
```

---

# Etapa 0 — Definir documento base do projeto

## Objetivo

Criar um arquivo de referência para as IAs seguirem sempre o mesmo padrão.

Crie um arquivo:

```txt
PROJECT_RULES.md
```

Esse arquivo será usado como contexto em todas as próximas etapas.

## Prompt para Codex

```md
Você está trabalhando em um novo projeto para uma floricultura pequena.

Crie um arquivo chamado PROJECT_RULES.md na raiz do projeto com as regras técnicas e de produto abaixo.

Contexto:
- O sistema será uma vitrine digital para uma floricultura.
- Não haverá pagamento online.
- O cliente escolhe produtos, adiciona ao carrinho e envia o pedido para o WhatsApp da floricultura.
- A administradora não é técnica, então o painel admin precisa ser muito simples.
- SEO local é prioridade.

Stack definida:
- Next.js
- TypeScript
- Tailwind CSS
- Prisma
- Banco relacional, preferencialmente PostgreSQL ou MySQL
- Sem Docker
- Carrinho local no navegador
- Pedido via WhatsApp usando https://wa.me/NUMERO?text=MENSAGEM_CODIFICADA
- Upload de imagens em etapa posterior

Inclua no PROJECT_RULES.md:
1. Objetivo do projeto.
2. Stack.
3. Regras de arquitetura.
4. Regras de SEO.
5. Regras de UX.
6. Regras de segurança.
7. Regras para mensagens WhatsApp.
8. Regras de nomenclatura.
9. O que não deve ser implementado no MVP.

Não crie código ainda além desse arquivo.
```

## Prompt para Claude Code

```md
Leia o arquivo PROJECT_RULES.md e revise se ele está claro, completo e útil para guiar um projeto real de floricultura com Next.js.

Melhore o documento sem mudar o escopo principal.

Garanta que ele deixe explícito:
- SEO como prioridade.
- Admin simples para pessoa não técnica.
- Pedido via WhatsApp, sem checkout.
- Sem Docker.
- Código com TypeScript.
- Separação clara entre área pública e admin.
- Segurança básica de login e uploads.
- Performance e imagens otimizadas.

Ao final, explique resumidamente quais melhorias você fez no documento.
```

---

# Etapa 1 — Criar projeto Next.js

## Objetivo

Inicializar o projeto com Next.js, TypeScript e Tailwind.

## Prompt para Codex

```md
Crie a base inicial do projeto da floricultura usando Next.js, TypeScript e Tailwind CSS.

Requisitos:
- Usar App Router.
- Usar TypeScript.
- Usar Tailwind CSS.
- Criar estrutura inicial limpa.
- Não instalar bibliotecas desnecessárias.
- Não implementar banco ainda.
- Não implementar autenticação ainda.
- Não criar Docker.

Crie ou ajuste:
- package.json
- tsconfig.json
- next.config.ts ou next.config.js
- src/app/layout.tsx
- src/app/page.tsx
- src/app/globals.css
- src/components, se necessário

A home inicial pode ser simples, mas deve conter:
- Nome provisório: "Floricultura"
- Texto: "Flores, buquês e arranjos especiais"
- Botão "Ver catálogo"
- Botão "Falar no WhatsApp"

Ao final:
- Liste comandos para instalar dependências.
- Liste comandos para rodar o projeto.
- Liste arquivos criados/alterados.
```

## Prompt para Claude Code

```md
Revise a base inicial do projeto Next.js.

Verifique:
- Se o App Router está sendo usado corretamente.
- Se TypeScript está configurado.
- Se Tailwind está funcionando.
- Se a estrutura está limpa.
- Se não há arquivos desnecessários.
- Se o layout inicial é adequado para evoluir o projeto.
- Se não foi criado Docker.

Faça pequenos ajustes se necessário.

Depois rode, se possível:
- npm run lint
- npm run build

Se houver erro, corrija.
Ao final, apresente um resumo técnico objetivo.
```

---

# Etapa 2 — Criar estrutura de pastas e layout base

## Objetivo

Separar área pública, área administrativa, componentes e libs.

## Prompt para Codex

```md
Organize a estrutura de pastas do projeto conforme as regras em PROJECT_RULES.md.

Crie a seguinte estrutura:

src/
  app/
    (public)/
      page.tsx
      produtos/
        page.tsx
      pedido/
        page.tsx
      sobre/
        page.tsx
      contato/
        page.tsx
    admin/
      layout.tsx
      page.tsx
      login/
        page.tsx
    layout.tsx
    globals.css

  components/
    public/
    admin/
    ui/

  lib/
    utils.ts
    money.ts
    slug.ts
    whatsapp.ts

Requisitos:
- Mover a home pública para src/app/(public)/page.tsx.
- Criar layout global.
- Criar layout administrativo simples.
- Criar páginas placeholder para catálogo, pedido, sobre e contato.
- Criar página placeholder para admin e login.
- Criar função formatCurrencyBRL em lib/money.ts.
- Criar função slugify em lib/slug.ts.
- Criar arquivo lib/whatsapp.ts com estrutura inicial, mas sem implementar carrinho ainda.

Não implemente banco.
Não implemente autenticação real ainda.
Não implemente CRUD ainda.

Ao final, liste arquivos alterados.
```

## Prompt para Claude Code

```md
Revise a estrutura de pastas criada.

Objetivo da revisão:
- Confirmar que a separação entre público e admin está correta.
- Confirmar que os arquivos utilitários estão simples e bem tipados.
- Confirmar que a estrutura está pronta para SEO, catálogo, carrinho e admin.
- Corrigir imports quebrados.
- Remover duplicidade.
- Melhorar nomes se necessário.

Rode:
- npm run lint
- npm run build

Corrija qualquer erro encontrado.

Ao final, explique o que foi ajustado.
```

---

# Etapa 3 — Criar design system inicial

## Objetivo

Criar os componentes básicos de UI.

## Prompt para Codex

```md
Implemente um design system simples para o projeto da floricultura.

Crie componentes em src/components/ui:

- Button.tsx
- Input.tsx
- Textarea.tsx
- Card.tsx
- Badge.tsx
- EmptyState.tsx
- Loader.tsx
- Modal.tsx, se fizer sentido
- Toast simples, se fizer sentido

Requisitos:
- Componentes com TypeScript.
- Componentes reutilizáveis.
- Estilo com Tailwind CSS.
- Visual delicado, elegante e apropriado para floricultura.
- Não usar biblioteca pesada.
- Não usar shadcn ainda, a menos que já esteja instalado.
- Manter acessibilidade básica.
- Button deve aceitar variantes: primary, secondary, outline, danger.
- Input e Textarea devem aceitar label, error e helperText.

Atualize a home pública para usar Button e Card.

Não implemente lógica de negócio ainda.

Ao final, liste arquivos criados/alterados.
```

## Prompt para Claude Code

```md
Revise os componentes de UI criados.

Verifique:
- Tipagem.
- Acessibilidade.
- Consistência visual.
- Reutilização.
- Classes Tailwind duplicadas ou confusas.
- Se os componentes estão simples para manutenção.
- Se Button, Input e Textarea são fáceis de usar em formulários admin.

Melhore se necessário, mas não adicione bibliotecas pesadas.

Rode lint e build.
Corrija erros.

Ao final, descreva as melhorias.
```

---

# Etapa 4 — Configurar Prisma e banco

## Objetivo

Criar schema inicial do banco.

## Prompt para Codex

```md
Configure Prisma no projeto.

Requisitos:
- Instalar e configurar Prisma.
- Criar prisma/schema.prisma.
- Usar provider configurável por DATABASE_URL.
- Preferência inicial: PostgreSQL.
- Não usar Docker.
- Criar models:

User:
- id
- name
- email
- passwordHash
- role
- active
- createdAt
- updatedAt

Category:
- id
- name
- slug
- description
- active
- sortOrder
- createdAt
- updatedAt
- products relation

Product:
- id
- categoryId
- name
- slug
- shortDescription
- description
- price
- priceType
- active
- available
- featured
- seasonal
- seoTitle
- seoDescription
- createdAt
- updatedAt
- category relation
- images relation

ProductImage:
- id
- productId
- url
- altText
- isMain
- sortOrder
- createdAt

Settings:
- id
- businessName
- whatsappNumber
- phone
- email
- address
- city
- state
- neighborhood
- googleMapsUrl
- instagramUrl
- facebookUrl
- openingHours
- deliveryAvailable
- deliveryDescription
- seoDefaultTitle
- seoDefaultDescription
- ogImageUrl
- createdAt
- updatedAt

Enums:
- UserRole: ADMIN
- PriceType: FIXED, STARTING_FROM, ON_REQUEST

Crie também src/lib/db.ts com PrismaClient singleton.

Não implemente telas ainda.
Não implemente autenticação ainda.

Ao final:
- Liste comandos para gerar migration.
- Liste arquivos criados/alterados.
```

## Prompt para Claude Code

```md
Revise a configuração do Prisma e o schema do banco.

Verifique:
- Se os nomes dos campos estão consistentes.
- Se relações Product/Category/ProductImage estão corretas.
- Se os tipos Decimal, Boolean, DateTime e String estão adequados.
- Se price usa Decimal e não Float.
- Se Settings faz sentido para SEO/localização/WhatsApp.
- Se o PrismaClient singleton está correto para Next.js.
- Se não há Docker.

Faça ajustes se necessário.

Depois rode:
- npx prisma validate

Se possível, rode também:
- npx prisma format

Ao final, explique os ajustes feitos e os comandos para migration.
```

---

# Etapa 5 — Criar seed inicial

## Objetivo

Criar dados iniciais: admin, categorias, configurações e produtos exemplo.

## Prompt para Codex

```md
Crie um seed inicial do Prisma para o projeto da floricultura.

Arquivo:
- prisma/seed.ts

O seed deve criar:

1. Um usuário admin inicial:
- name: Administradora
- email: admin@floricultura.com
- senha temporária: admin123
- passwordHash usando bcrypt ou argon2
- role ADMIN
- active true

2. Configurações iniciais:
- businessName: Floricultura
- whatsappNumber: 5546999999999
- city: Pato Branco
- state: PR
- seoDefaultTitle
- seoDefaultDescription

3. Categorias:
- Buquês
- Arranjos
- Cestas
- Flores naturais
- Presentes

4. Alguns produtos exemplo com imagens placeholder:
- Buquê de Rosas Vermelhas
- Arranjo de Flores do Campo
- Cesta Especial com Flores
- Orquídea Presenteável

Requisitos:
- Não usar senha em texto puro no banco.
- Usar upsert para evitar duplicação ao rodar seed novamente.
- Atualizar package.json para permitir rodar seed se necessário.

Ao final, informe o comando para executar o seed.
```

## Prompt para Claude Code

```md
Revise o seed do Prisma.

Verifique:
- Se a senha está sendo hasheada corretamente.
- Se upsert evita duplicações.
- Se categorias e produtos têm slugs consistentes.
- Se price usa Decimal/string corretamente conforme Prisma.
- Se os dados iniciais ajudam no desenvolvimento do catálogo.
- Se não há dados sensíveis reais.
- Se o comando de seed funciona.

Rode, se possível:
- npx prisma validate
- npx prisma format

Se houver ambiente de banco configurado, rode:
- npx prisma db seed

Corrija erros encontrados.
```

---

# Etapa 6 — Implementar consultas públicas de produtos

## Objetivo

Criar camada server para buscar produtos, categorias e configurações.

## Prompt para Codex

```md
Implemente a camada de acesso a dados pública.

Crie arquivos:

src/server/products.ts
src/server/categories.ts
src/server/settings.ts

Funções necessárias:

products.ts:
- getFeaturedProducts()
- getActiveProducts()
- getProductBySlug(slug: string)
- getProductsByCategorySlug(slug: string)

categories.ts:
- getActiveCategories()
- getCategoryBySlug(slug: string)

settings.ts:
- getSettings()

Requisitos:
- Retornar apenas produtos active = true nas páginas públicas.
- Priorizar imagens principais.
- Ordenar produtos por featured e createdAt.
- Tratar Settings inexistente com fallback seguro.
- Não expor passwordHash.
- Usar Prisma via src/lib/db.ts.
- Tipar retornos quando fizer sentido.

Não crie telas ainda, apenas camada server.

Ao final, liste arquivos criados/alterados.
```

## Prompt para Claude Code

```md
Revise a camada server de consultas públicas.

Verifique:
- Se as queries Prisma estão corretas.
- Se produtos inativos não aparecem publicamente.
- Se imagens principais são carregadas corretamente.
- Se as funções estão protegidas contra null/undefined.
- Se não há dados sensíveis vazando.
- Se a ordenação faz sentido para catálogo.
- Se os nomes das funções são claros.

Melhore se necessário.

Rode lint e build.
Corrija erros.
```

---

# Etapa 7 — Implementar catálogo público

## Objetivo

Criar listagem de produtos e cards.

## Prompt para Codex

```md
Implemente o catálogo público da floricultura.

Páginas/componentes:
- src/app/(public)/produtos/page.tsx
- src/components/public/ProductCard.tsx
- src/components/public/CategoryFilter.tsx, se fizer sentido

Requisitos:
- Buscar produtos ativos usando getActiveProducts().
- Exibir grid responsivo.
- Exibir imagem, nome, preço, descrição curta e categoria.
- Exibir badge para "Destaque" se featured = true.
- Exibir estado "Sob consulta" se priceType = ON_REQUEST.
- Exibir "A partir de R$ X" se priceType = STARTING_FROM.
- Botão "Adicionar ao pedido" pode ser placeholder por enquanto.
- Link "Ver detalhes" para /produtos/[slug].
- Filtro por categoria pode ser simples com links para /categorias/[slug].
- Criar empty state se não houver produtos.

Não implemente carrinho ainda.
Não implemente admin ainda.

Ao final, liste arquivos alterados.
```

## Prompt para Claude Code

```md
Revise a página de catálogo.

Verifique:
- Responsividade.
- Semântica HTML.
- Acessibilidade dos links e botões.
- Formatação de preço.
- Tratamento de imagem ausente.
- Estado vazio.
- Se o catálogo está adequado para SEO.
- Se não há client component desnecessário.

Ajuste para usar server components sempre que possível.

Rode lint e build.
Corrija erros.
```

---

# Etapa 8 — Implementar página de produto com SEO dinâmico

## Objetivo

Criar página individual para cada produto.

## Prompt para Codex

```md
Implemente a página pública de detalhe do produto.

Arquivo:
- src/app/(public)/produtos/[slug]/page.tsx

Requisitos:
- Buscar produto por slug usando getProductBySlug.
- Se não encontrar, usar notFound().
- Exibir:
  - nome do produto
  - imagem principal
  - galeria simples, se houver mais imagens
  - descrição completa
  - descrição curta
  - preço
  - categoria
  - status de disponibilidade
  - botão "Adicionar ao pedido" placeholder
  - botão "Pedir pelo WhatsApp" placeholder
- Criar generateMetadata para SEO dinâmico.
- Title deve usar seoTitle ou nome do produto.
- Description deve usar seoDescription ou shortDescription.
- Open Graph deve usar imagem principal se existir.
- Criar JSON-LD básico de Product.
- Usar headings corretos:
  - H1 nome do produto
  - H2 detalhes
  - H2 como pedir
- Não implementar carrinho real ainda.

Ao final, liste arquivos alterados.
```

## Prompt para Claude Code

```md
Revise a página de produto.

Verifique:
- generateMetadata.
- Open Graph.
- JSON-LD Product.
- Uso correto de notFound().
- Semântica de headings.
- Acessibilidade de imagens.
- Fallback para imagem ausente.
- Se a página é server component quando possível.
- Se não há dados quebrando build quando produto não existe.

Rode lint e build.
Corrija erros.
```

---

# Etapa 9 — Implementar páginas de categoria

## Objetivo

Criar páginas indexáveis por categoria.

## Prompt para Codex

```md
Implemente a página pública de categoria.

Arquivo:
- src/app/(public)/categorias/[slug]/page.tsx

Requisitos:
- Buscar categoria por slug.
- Se não existir, usar notFound().
- Buscar produtos ativos da categoria.
- Exibir H1 no formato: "[Nome da categoria] em [Cidade]"
- Exibir descrição da categoria, se existir.
- Exibir grid de ProductCard.
- Criar generateMetadata:
  - title focado em SEO local
  - description focada em produtos da categoria na cidade
- Criar Open Graph básico.
- Criar JSON-LD BreadcrumbList.
- Estado vazio: "Nenhum produto disponível nesta categoria no momento."

Não implemente carrinho ainda.

Ao final, liste arquivos alterados.
```

## Prompt para Claude Code

```md
Revise a página de categoria.

Verifique:
- SEO local no title e description.
- H1 adequado.
- Breadcrumb JSON-LD.
- Tratamento de categoria inexistente.
- Tratamento de categoria sem produtos.
- Reuso de ProductCard.
- Responsividade.
- Se cidade vem de Settings com fallback.

Rode lint e build.
Corrija erros.
```

---

# Etapa 10 — Implementar Home pública completa

## Objetivo

Criar uma home bonita, rápida e orientada para SEO local.

## Prompt para Codex

```md
Implemente a Home pública completa da floricultura.

Arquivo:
- src/app/(public)/page.tsx

Componentes sugeridos:
- HeroSection
- FeaturedProductsSection
- CategoriesSection
- HowToOrderSection
- AboutPreviewSection
- LocationSection
- WhatsAppCTASection

Requisitos:
- Buscar Settings.
- Buscar produtos em destaque.
- Buscar categorias ativas.
- H1 com SEO local:
  "Floricultura em [cidade] com flores, buquês e arranjos especiais"
- Botões:
  - Ver catálogo
  - Falar no WhatsApp
- Seção "Como pedir":
  1. Escolha os produtos
  2. Monte seu pedido
  3. Envie pelo WhatsApp
  4. Aguarde confirmação
- Seção de localização e horário.
- Usar ProductCard para destaques.
- Layout mobile-first.
- Visual elegante e delicado.
- Criar metadata da home.
- Criar JSON-LD LocalBusiness básico.

Não implemente carrinho ainda.

Ao final, liste arquivos criados/alterados.
```

## Prompt para Claude Code

```md
Revise a Home pública.

Verifique:
- SEO local.
- H1 único.
- Hierarquia H2/H3.
- CTA claro.
- Responsividade mobile.
- Performance.
- Uso de server components.
- Se LocalBusiness JSON-LD está correto e seguro.
- Se não há excesso de JavaScript.
- Se o visual está consistente com floricultura.

Rode lint e build.
Corrija erros.
```

---

# Etapa 11 — Implementar páginas Sobre e Contato

## Objetivo

Criar páginas institucionais importantes para SEO local e confiança.

## Prompt para Codex

```md
Implemente as páginas públicas Sobre e Contato.

Arquivos:
- src/app/(public)/sobre/page.tsx
- src/app/(public)/contato/page.tsx

Página Sobre:
- H1: "Sobre a [Nome da Floricultura]"
- Texto institucional simples e editável depois.
- Foco em atendimento local, flores, buquês, arranjos e presentes.
- CTA para catálogo e WhatsApp.

Página Contato:
- H1: "Contato da [Nome da Floricultura]"
- Exibir:
  - WhatsApp
  - telefone
  - endereço
  - cidade/estado
  - horário de atendimento
  - Instagram, se existir
  - mapa via link Google Maps, não iframe pesado no MVP
- Botão "Chamar no WhatsApp"

SEO:
- Criar metadata para ambas.
- Usar Settings.
- Foco em SEO local.

Não implemente edição admin ainda.

Ao final, liste arquivos alterados.
```

## Prompt para Claude Code

```md
Revise as páginas Sobre e Contato.

Verifique:
- Clareza do texto.
- SEO local.
- H1 único em cada página.
- Links acessíveis.
- Botão de WhatsApp funcionando com número configurado.
- Fallbacks quando Settings não tiver algum dado.
- Performance, evitando iframe pesado.
- Responsividade.

Rode lint e build.
Corrija erros.
```

---

# Etapa 12 — Implementar botão fixo do WhatsApp

## Objetivo

Criar botão fixo no canto inferior direito.

## Prompt para Codex

```md
Implemente o botão fixo do WhatsApp no site público.

Componente:
- src/components/public/WhatsAppFloatingButton.tsx

Requisitos:
- Ficar no canto inferior direito.
- CSS/Tailwind equivalente a:
  position: fixed;
  z-index: 10;
  bottom: 1%;
  right: 1%;
- Ser visível no mobile.
- Ter tamanho adequado.
- Usar aria-label.
- Não atrapalhar o carrinho futuramente.
- Abrir conversa direta no WhatsApp usando wa.me.
- Usar número vindo de Settings.
- Mensagem padrão:
  "Olá! Vim pelo site da floricultura e gostaria de mais informações."
- Usar encodeURIComponent.
- Abrir em nova aba com noopener noreferrer.
- Ser leve, sem biblioteca pesada de ícones se não existir.
- Pode usar texto "WhatsApp" ou SVG simples.

Adicionar o botão no layout público, não no admin.

Ao final, liste arquivos alterados.
```

## Prompt para Claude Code

```md
Revise o botão fixo do WhatsApp.

Verifique:
- Se aparece apenas no site público, não no admin.
- Se usa aria-label.
- Se o link wa.me está correto.
- Se encodeURIComponent está sendo usado.
- Se não atrapalha layout mobile.
- Se o z-index é suficiente, mas não exagerado.
- Se o botão é performático.
- Se existe fallback caso whatsappNumber não esteja configurado.

Rode lint e build.
Corrija erros.
```

---

# Etapa 13 — Implementar carrinho local

## Objetivo

Criar carrinho no navegador sem backend.

## Prompt para Codex

```md
Implemente o carrinho local do projeto.

Requisitos:
- Carrinho deve rodar no cliente.
- Usar React Context ou Zustand. Se não houver Zustand instalado, prefira React Context para manter simples.
- Persistir carrinho em localStorage.
- Criar funções:
  - addItem(product)
  - removeItem(productId)
  - updateQuantity(productId, quantity)
  - clearCart()
  - getTotal()
  - getItemsCount()
- Criar tipo CartItem com:
  - productId
  - slug
  - name
  - unitPrice
  - priceType
  - imageUrl
  - quantity
  - shortDescription
- Produtos ON_REQUEST podem ser adicionados, mas o total deve avisar que há produtos sob consulta.
- Criar botão funcional "Adicionar ao pedido" no ProductCard e na página de produto.
- Exibir feedback simples ao adicionar.

Arquivos sugeridos:
- src/context/CartContext.tsx
ou
- src/store/cart.ts

- src/components/public/AddToCartButton.tsx

Não implemente página de pedido ainda.
Não implemente WhatsApp final ainda.

Ao final, liste arquivos criados/alterados.
```

## Prompt para Claude Code

```md
Revise a implementação do carrinho.

Verifique:
- Se localStorage está protegido contra SSR.
- Se não quebra em server components.
- Se os tipos estão corretos.
- Se quantidades inválidas são evitadas.
- Se produtos duplicados somam quantidade em vez de duplicar linha.
- Se removeItem funciona.
- Se clearCart funciona.
- Se produtos sob consulta são tratados corretamente.
- Se a implementação é simples e sustentável.

Rode lint e build.
Corrija erros.
```

---

# Etapa 14 — Implementar página de pedido

## Objetivo

Criar página para revisar carrinho e preencher dados.

## Prompt para Codex

```md
Implemente a página /pedido.

Arquivo:
- src/app/(public)/pedido/page.tsx

Componentes sugeridos:
- CartSummary.tsx
- CartItemRow.tsx
- CheckoutForm.tsx

Requisitos:
- Mostrar itens do carrinho.
- Permitir alterar quantidade.
- Permitir remover item.
- Mostrar subtotal por item.
- Mostrar total estimado.
- Se houver item ON_REQUEST, mostrar aviso:
  "Alguns produtos estão sob consulta. O valor final será confirmado pela floricultura."
- Campos do formulário:
  - nome do cliente
  - observações gerais
  - data ou prazo desejado
  - forma de pagamento
  - mensagem para cartão
- Botão:
  "Enviar pedido pelo WhatsApp"
- Se carrinho vazio, mostrar estado vazio com link para catálogo.
- Não salvar pedido no banco.
- Ainda não precisa abrir WhatsApp; pode chamar função placeholder se necessário.

Ao final, liste arquivos criados/alterados.
```

## Prompt para Claude Code

```md
Revise a página /pedido.

Verifique:
- UX no mobile.
- Clareza do fluxo.
- Validação básica dos campos.
- Estado de carrinho vazio.
- Alteração de quantidade.
- Remoção de item.
- Cálculo de total.
- Tratamento de produtos sob consulta.
- Acessibilidade dos campos.
- Se os componentes client/server estão separados corretamente.

Rode lint e build.
Corrija erros.
```

---

# Etapa 15 — Implementar geração de mensagem e envio WhatsApp

## Objetivo

Fazer o pedido abrir no WhatsApp com mensagem formatada.

## Prompt para Codex

```md
Implemente a geração final da mensagem de pedido via WhatsApp.

Arquivo principal:
- src/lib/whatsapp.ts

Requisitos:
- Criar função buildOrderWhatsAppMessage(items, checkoutData)
- Criar função buildWhatsAppUrl(phone, message)
- Usar encodeURIComponent na mensagem.
- Limpar número de telefone removendo caracteres não numéricos.
- Mensagem deve conter:
  - saudação
  - nome do cliente, se informado
  - lista dos produtos
  - quantidade
  - preço unitário
  - subtotal
  - total estimado
  - descrição curta do produto, se existir
  - observações gerais
  - data ou prazo desejado
  - forma de pagamento
  - mensagem para cartão
  - aviso: "Pedido sujeito à confirmação de disponibilidade, prazo e pagamento pela floricultura."
- Produtos ON_REQUEST devem aparecer como "Valor sob consulta".
- Integrar o botão "Enviar pedido pelo WhatsApp" da página /pedido.
- Abrir em nova aba com window.open(url, "_blank", "noopener,noreferrer").
- Não limpar carrinho automaticamente antes de abrir WhatsApp.
- Pode mostrar mensagem de sucesso após clicar.

Ao final, liste arquivos alterados.
```

## Prompt para Claude Code

```md
Revise a implementação do envio via WhatsApp.

Verifique:
- Se encodeURIComponent está sendo usado corretamente.
- Se o link wa.me está no formato correto.
- Se o número é limpo corretamente.
- Se produtos com preço fixo e sob consulta são tratados.
- Se a mensagem é legível no WhatsApp.
- Se o total estimado está correto.
- Se o botão não dispara com carrinho vazio.
- Se não há erro em ambiente SSR por uso de window.
- Se o aviso de confirmação está presente.

Crie testes unitários para as funções de whatsapp.ts se o projeto já tiver setup de testes. Caso não tenha, pelo menos crie funções puras fáceis de testar.

Rode lint e build.
Corrija erros.
```

---

# Etapa 16 — Implementar autenticação admin

## Objetivo

Criar login administrativo seguro.

## Prompt para Codex

```md
Implemente autenticação administrativa simples e segura.

Requisitos:
- Login em /admin/login.
- Validar e-mail e senha.
- Comparar senha com passwordHash usando bcrypt ou argon2, conforme o seed.
- Criar sessão usando cookie httpOnly.
- Proteger rotas /admin.
- Criar logout.
- Não expor passwordHash.
- Não usar localStorage para autenticação.
- Não implementar cadastro público.
- Apenas admin criado via seed.

Arquivos possíveis:
- src/lib/auth.ts
- src/middleware.ts
- src/app/admin/login/page.tsx
- src/app/admin/logout/route.ts
- server action ou route handler para login

Requisitos de UX:
- Mensagem clara para erro de login.
- Redirecionar admin logado para /admin.
- Redirecionar visitante não logado para /admin/login.

Ao final, liste arquivos alterados e explique como testar.
```

## Prompt para Claude Code

```md
Revise a autenticação admin.

Verifique:
- Cookie httpOnly.
- Proteção real de /admin.
- Login seguro.
- Logout funcionando.
- Redirecionamentos corretos.
- Sem passwordHash vazando.
- Sem uso de localStorage para sessão.
- Validação básica dos campos.
- Mensagens de erro seguras, sem revelar demais.
- Se middleware não bloqueia páginas públicas.

Rode lint e build.
Corrija erros.
```

---

# Etapa 17 — Implementar layout administrativo

## Objetivo

Criar painel simples para pessoa não técnica.

## Prompt para Codex

```md
Implemente o layout administrativo do projeto.

Arquivos:
- src/app/admin/layout.tsx
- src/app/admin/page.tsx
- src/components/admin/AdminSidebar.tsx
- src/components/admin/AdminHeader.tsx

Requisitos:
- Layout simples e claro.
- Menus:
  - Painel
  - Produtos
  - Categorias
  - Configurações
  - Sair
- Página /admin deve mostrar cards:
  - Produtos cadastrados
  - Produtos ativos
  - Produtos em destaque
  - Atalho "Cadastrar produto"
- Buscar contagens reais no banco.
- Mobile simples.
- Não usar termos técnicos.
- Não criar gráficos.
- Não implementar CRUD ainda.

Ao final, liste arquivos criados/alterados.
```

## Prompt para Claude Code

```md
Revise o layout administrativo.

Verifique:
- Simplicidade para usuária não técnica.
- Menus claros.
- Responsividade.
- Acessibilidade.
- Se a área admin está protegida.
- Se as contagens são buscadas corretamente.
- Se não há termos técnicos no painel.
- Se o logout está acessível.

Rode lint e build.
Corrija erros.
```

---

# Etapa 18 — CRUD de categorias

## Objetivo

Permitir cadastrar e editar categorias.

## Prompt para Codex

```md
Implemente o CRUD administrativo de categorias.

Páginas:
- /admin/categorias
- /admin/categorias/nova
- /admin/categorias/[id]/editar

Campos:
- nome
- descrição
- ativo
- ordem de exibição

Requisitos:
- Criar slug automaticamente a partir do nome.
- Validar nome obrigatório.
- Não permitir slug duplicado.
- Listar categorias em tabela simples.
- Permitir ativar/desativar.
- Permitir editar.
- Evitar exclusão definitiva no MVP. Use ativar/desativar.
- Usar server actions ou route handlers.
- UX simples.
- Mensagens de sucesso/erro.

Ao final, liste arquivos criados/alterados.
```

## Prompt para Claude Code

```md
Revise o CRUD de categorias.

Verifique:
- Validação.
- Slug automático.
- Tratamento de duplicidade.
- Ativar/desativar funcionando.
- UX simples para pessoa não técnica.
- Segurança: apenas admin acessa.
- Se erros são tratados de forma clara.
- Se não há exclusão definitiva perigosa.
- Se as categorias ativas aparecem no site público.

Rode lint e build.
Corrija erros.
```

---

# Etapa 19 — CRUD de produtos sem upload real

## Objetivo

Criar cadastro de produtos usando URL de imagem provisória.

## Prompt para Codex

```md
Implemente o CRUD administrativo de produtos, inicialmente usando URL de imagem manual/provisória.

Páginas:
- /admin/produtos
- /admin/produtos/novo
- /admin/produtos/[id]/editar

Campos:
- nome
- categoria
- descrição curta
- descrição completa
- preço
- tipo de preço: FIXED, STARTING_FROM, ON_REQUEST
- URL da imagem principal
- texto alternativo da imagem
- ativo
- disponível
- destaque
- sazonal
- título para Google
- descrição para Google

Requisitos:
- Slug automático a partir do nome.
- Validar nome obrigatório.
- Validar categoria obrigatória.
- Validar preço quando priceType não for ON_REQUEST.
- Listar produtos em tabela/card admin.
- Permitir editar.
- Permitir ativar/desativar.
- Permitir marcar como destaque.
- Não excluir definitivamente no MVP.
- Criar ProductImage principal usando URL.
- UX clara, com textos simples.
- Não usar termos técnicos como "slug" na interface.

Ao final, liste arquivos alterados.
```

## Prompt para Claude Code

```md
Revise o CRUD de produtos.

Verifique:
- Validação de campos.
- Tratamento de preço FIXED, STARTING_FROM e ON_REQUEST.
- Criação/edição da imagem principal.
- Slug automático e único.
- Ativar/desativar.
- Destaque.
- Disponibilidade.
- Segurança das rotas admin.
- UX simples para pessoa não técnica.
- Se produtos cadastrados aparecem corretamente no catálogo público.
- Se produtos inativos não aparecem no público.

Rode lint e build.
Corrija erros.
```

---

# Etapa 20 — Upload de imagens

## Objetivo

Permitir que a administradora envie foto do produto.

## Prompt para Codex

```md
Implemente upload de imagens para produtos.

Escolha uma abordagem simples para MVP:
Opção preferida: upload para serviço externo como Cloudinary ou Supabase Storage, se as variáveis de ambiente estiverem configuradas.
Se não houver serviço configurado, crie abstração em src/server/images.ts e mantenha fallback para URL manual.

Requisitos:
- Permitir upload de imagem principal no formulário de produto.
- Validar tipos permitidos:
  - jpg
  - jpeg
  - png
  - webp
- Validar tamanho máximo, exemplo 5MB.
- Não aceitar SVG.
- Gerar altText com base no nome do produto, editável no formulário.
- Salvar URL em ProductImage.
- Mostrar preview da imagem antes/depois de salvar.
- Mostrar erro claro se arquivo for inválido.
- Não quebrar produtos antigos que usam URL manual.

Não implemente múltiplas imagens ainda, a menos que seja simples.

Ao final, liste variáveis de ambiente necessárias e arquivos alterados.
```

## Prompt para Claude Code

```md
Revise o upload de imagens.

Verifique:
- Validação de tipo.
- Validação de tamanho.
- Bloqueio de SVG.
- Tratamento de erro.
- Segurança do upload.
- Preview.
- Se a imagem é salva corretamente em ProductImage.
- Se produtos com URL manual continuam funcionando.
- Se a UI é simples para pessoa não técnica.
- Se não há dependências desnecessárias.

Rode lint e build.
Corrija erros.
```

---

# Etapa 21 — Configurações da floricultura

## Objetivo

Permitir editar WhatsApp, endereço, SEO padrão e redes sociais.

## Prompt para Codex

```md
Implemente a página administrativa de Configurações.

Página:
- /admin/configuracoes

Campos:
- nome da floricultura
- número do WhatsApp
- telefone
- e-mail
- endereço
- bairro
- cidade
- estado
- link do Google Maps
- Instagram
- Facebook
- horário de atendimento
- oferece entrega?
- descrição sobre entrega
- título padrão para Google
- descrição padrão para Google
- imagem padrão de compartilhamento

Requisitos:
- Buscar Settings existente.
- Se não existir, criar.
- Validar WhatsApp.
- Validar e-mail se preenchido.
- Textos simples, sem termos técnicos pesados.
- Explicar no painel que essas informações aparecem no site e no Google.
- Atualizar páginas públicas automaticamente ao alterar Settings.
- Proteger rota admin.

Ao final, liste arquivos alterados.
```

## Prompt para Claude Code

```md
Revise a página de configurações.

Verifique:
- Validações.
- UX para pessoa não técnica.
- Persistência correta.
- Fallbacks nas páginas públicas.
- Se WhatsApp usa o número atualizado.
- Se SEO padrão usa os dados atualizados.
- Se endereço/cidade aparecem corretamente.
- Segurança da rota.

Rode lint e build.
Corrija erros.
```

---

# Etapa 22 — Sitemap, robots e SEO técnico final

## Objetivo

Criar SEO técnico completo.

## Prompt para Codex

```md
Implemente SEO técnico no projeto.

Arquivos:
- src/app/sitemap.ts
- src/app/robots.ts
- ajustes em generateMetadata das páginas públicas

Requisitos:
- sitemap deve incluir:
  - home
  - /produtos
  - /sobre
  - /contato
  - /pedido, se fizer sentido como noindex ou fora do sitemap
  - páginas de produtos ativos
  - páginas de categorias ativas
- robots deve permitir indexação pública.
- Não indexar área /admin.
- Não indexar /admin/login.
- Metadata padrão deve usar Settings.
- Produto deve ter metadata própria.
- Categoria deve ter metadata própria.
- Criar canonical quando fizer sentido.
- Criar Open Graph básico global.
- Usar NEXT_PUBLIC_SITE_URL como base URL.

Ao final, liste variáveis de ambiente necessárias e arquivos alterados.
```

## Prompt para Claude Code

```md
Revise o SEO técnico.

Verifique:
- sitemap dinâmico.
- robots bloqueando /admin.
- URLs absolutas corretas com NEXT_PUBLIC_SITE_URL.
- Metadata global.
- Metadata de produto.
- Metadata de categoria.
- Canonical.
- Open Graph.
- Se /pedido deve ou não estar indexada. Recomendo noindex ou fora do sitemap.
- Se não há páginas admin indexáveis.

Rode lint e build.
Corrija erros.
```

---

# Etapa 23 — Melhorar performance e imagens

## Objetivo

Otimizar carregamento e Core Web Vitals.

## Prompt para Codex

```md
Faça uma rodada de otimização de performance no site público.

Requisitos:
- Usar next/image onde fizer sentido.
- Definir width e height nas imagens.
- Evitar layout shift.
- Usar lazy loading em imagens abaixo da primeira dobra.
- Não carregar JavaScript desnecessário no público.
- Evitar client components desnecessários.
- Otimizar Hero.
- Garantir que ProductCard não pese demais.
- Melhorar estados de imagem ausente.
- Revisar fontes.
- Não adicionar bibliotecas pesadas.

Ao final:
- Liste melhorias feitas.
- Informe como testar com Lighthouse.
```

## Prompt para Claude Code

```md
Revise performance e Core Web Vitals.

Verifique:
- Componentes client desnecessários.
- Imagens sem dimensão.
- Possível CLS.
- Possível LCP ruim na Home.
- Uso de next/image.
- Imports pesados.
- Fontes.
- Estado de loading.
- Build output, se disponível.

Faça ajustes seguros.

Rode:
- npm run lint
- npm run build

Ao final, dê uma lista objetiva de recomendações restantes.
```

---

# Etapa 24 — Acessibilidade e UX final

## Objetivo

Garantir que clientes de qualquer idade consigam usar.

## Prompt para Codex

```md
Faça uma revisão de UX e acessibilidade no site público e admin.

Requisitos:
- Botões com labels claros.
- Inputs com labels visíveis.
- aria-label onde necessário.
- Contraste adequado.
- Estados de erro claros.
- Estados vazios.
- Estados de loading.
- Navegação mobile.
- Botões grandes o suficiente no mobile.
- Carrinho fácil de usar.
- Admin simples para pessoa não técnica.
- Textos em português claro.
- Não usar termos técnicos na interface.

Ajuste componentes e páginas conforme necessário.

Ao final, liste melhorias feitas.
```

## Prompt para Claude Code

```md
Revise acessibilidade e UX com olhar crítico.

Verifique:
- HTML semântico.
- H1 único por página.
- Ordem lógica de headings.
- Labels de formulário.
- aria-label em botões de ícone.
- Foco visível.
- Contraste.
- Navegação por teclado.
- Mensagens de erro.
- Fluxo do pedido.
- Clareza do admin para usuária não técnica.

Corrija problemas simples.

Rode lint e build.
```

---

# Etapa 25 — Testes essenciais

## Objetivo

Adicionar testes nas partes mais críticas.

## Prompt para Codex

```md
Adicione testes essenciais ao projeto.

Prioridade de testes:
1. src/lib/whatsapp.ts
   - buildOrderWhatsAppMessage
   - buildWhatsAppUrl
   - encodeURIComponent
   - produtos com preço fixo
   - produtos sob consulta
   - campos opcionais

2. src/lib/money.ts
   - formatCurrencyBRL

3. src/lib/slug.ts
   - slugify

Se o projeto ainda não tiver setup de testes:
- Configure Vitest de forma simples.
- Não adicione setup pesado.
- Crie scripts no package.json:
  - test
  - test:watch

Não precisa testar UI complexa agora.

Ao final, liste comandos para rodar os testes.
```

## Prompt para Claude Code

```md
Revise os testes criados.

Verifique:
- Cobertura das funções críticas.
- Casos de borda.
- Produtos sob consulta.
- Campos vazios.
- Telefone com máscara.
- Mensagem com caracteres especiais.
- Slug com acentos.
- Preço em BRL.

Rode:
- npm run test
- npm run lint
- npm run build

Corrija erros.
```

---

# Etapa 26 — Preparar deploy

## Objetivo

Deixar projeto pronto para produção.

## Prompt para Codex

```md
Prepare o projeto para deploy em produção.

Requisitos:
- Criar .env.example com:
  - DATABASE_URL
  - NEXT_PUBLIC_SITE_URL
  - AUTH_SECRET ou SESSION_SECRET
  - variáveis de storage, se existirem
- Garantir que .env não está versionado.
- Criar README.md com:
  - descrição do projeto
  - stack
  - instalação
  - configuração de banco
  - migration
  - seed
  - rodar em desenvolvimento
  - build
  - deploy
  - variáveis de ambiente
- Verificar scripts package.json:
  - dev
  - build
  - start
  - lint
  - test, se existir
  - prisma:migrate, se fizer sentido
  - prisma:seed, se fizer sentido
- Não adicionar Docker.

Ao final, liste o checklist de deploy.
```

## Prompt para Claude Code

```md
Revise preparação de produção.

Verifique:
- README está claro.
- .env.example está completo.
- .env não está versionado.
- Scripts funcionam.
- Migrations estão documentadas.
- Seed está documentado.
- Build funciona.
- Não há secrets hardcoded.
- Não há Docker.
- Instruções de deploy estão aplicáveis.

Rode:
- npm run lint
- npm run build
- npm run test, se existir

Corrija problemas.
```

---

# Etapa 27 — Revisão final de MVP

## Objetivo

Auditar o MVP antes de colocar no ar.

## Prompt para Codex

```md
Faça uma auditoria final do MVP da floricultura.

Verifique o projeto inteiro com base em PROJECT_RULES.md.

Checklist:
- Home pública funciona.
- Catálogo funciona.
- Página de produto funciona.
- Página de categoria funciona.
- Carrinho funciona.
- Pedido via WhatsApp funciona.
- Botão fixo do WhatsApp funciona.
- Login admin funciona.
- Admin protegido.
- CRUD de categorias funciona.
- CRUD de produtos funciona.
- Configurações funcionam.
- SEO técnico implementado.
- Sitemap implementado.
- Robots implementado.
- Produtos inativos não aparecem no público.
- Admin não é indexável.
- Build passa.
- Sem Docker.
- Sem pagamento online.

Não implemente features novas.
Corrija apenas bugs encontrados.

Ao final, gere um relatório com:
- OK
- Problemas corrigidos
- Problemas pendentes
- Como testar manualmente
```

## Prompt para Claude Code

```md
Faça uma revisão final crítica do MVP.

Atue como revisor sênior de arquitetura, segurança, SEO, UX e performance.

Leia PROJECT_RULES.md e confira se o projeto está aderente.

Não crie features novas.
Corrija apenas bugs, inconsistências e problemas de qualidade.

Verifique:
- Segurança admin.
- SEO público.
- WhatsApp.
- Carrinho.
- CRUD.
- Performance.
- Acessibilidade.
- Simplicidade para administradora não técnica.
- Build.
- Testes.

Rode:
- npm run lint
- npm run build
- npm run test, se existir

Ao final, entregue:
1. Resumo do estado do MVP.
2. Lista de correções feitas.
3. Lista de riscos restantes.
4. Checklist manual para eu testar antes do deploy.
```

---

# Ordem ideal de execução

Execute nesta ordem:

```txt
0. PROJECT_RULES.md
1. Setup Next.js
2. Estrutura de pastas
3. Design system
4. Prisma e banco
5. Seed
6. Consultas públicas
7. Catálogo
8. Página de produto
9. Página de categoria
10. Home
11. Sobre e contato
12. Botão fixo WhatsApp
13. Carrinho local
14. Página de pedido
15. Envio WhatsApp
16. Autenticação admin
17. Layout admin
18. CRUD categorias
19. CRUD produtos sem upload
20. Upload de imagens
21. Configurações
22. SEO técnico
23. Performance
24. UX/acessibilidade
25. Testes
26. Deploy
27. Revisão final
```

---

# Estratégia prática de uso com Codex e Claude Code

Para cada etapa, eu faria assim:

```txt
1. Rodar prompt da etapa no Codex.
2. Revisar diff.
3. Rodar o prompt equivalente no Claude Code.
4. Aplicar correções.
5. Rodar npm run lint.
6. Rodar npm run build.
7. Fazer commit.
8. Só então avançar para a próxima etapa.
```

Sugestão de commits:

```txt
chore: add project rules
chore: setup next app
chore: organize project structure
feat: add base ui components
feat: configure prisma schema
feat: add initial seed
feat: add public product queries
feat: add product catalog
feat: add product detail page
feat: add category pages
feat: build public home page
feat: add about and contact pages
feat: add floating whatsapp button
feat: add local cart
feat: add order page
feat: add whatsapp order flow
feat: add admin authentication
feat: add admin layout
feat: add category management
feat: add product management
feat: add image upload
feat: add business settings
feat: add technical seo
perf: optimize public pages
fix: improve accessibility and ux
test: add core utility tests
docs: prepare production deploy
chore: final mvp review
```

Minha recomendação: **não peça para uma IA fazer o projeto inteiro de uma vez**. Use exatamente esse roadmap em etapas pequenas, porque reduz bugs, evita arquitetura bagunçada e te dá controle total do código.

[1]: https://openai.com/codex/?utm_source=chatgpt.com "Codex | AI Coding Partner from OpenAI"
