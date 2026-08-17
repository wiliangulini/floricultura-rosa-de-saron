# Plano de screenshots — Case Floricultura Rosa de Saron

Nenhuma captura foi feita nesta fase. Este documento é apenas o plano — quem executa a
captura é Wilian, quando tiver um ambiente seguro disponível.

## Regras obrigatórias, válidas para toda captura

- Usar somente dados demonstrativos ou explicitamente autorizados — nunca dados reais
  de cliente, pedido ou contato.
- Não mostrar e-mail, telefone, endereço ou nome pessoal reais sem autorização.
- Não mostrar credenciais, cookies, tokens, DevTools ou o painel de rede do navegador.
- Não mostrar a barra de endereço quando ela expuser uma URL administrativa sensível.
- Não mostrar banco de dados, terminal com variáveis de ambiente, ou qualquer valor de
  `.env`.
- Não mostrar dados reais de pedidos já recebidos pela loja.
- Não revelar caminhos locais da máquina (nome de usuário, estrutura de pastas) em
  capturas de terminal ou editor.
- Não capturar abas do navegador, notificações do sistema ou informações pessoais
  visíveis na tela (favoritos, extensões, e-mail logado).
- Não usar imagens de produto de terceiros sem confirmar autorização de uso.
- Não acessar o ambiente de produção só para obter uma captura.
- Não alterar a aplicação exclusivamente para melhorar uma captura, sem aprovação
  específica para isso.

## Preparação recomendada antes de capturar

1. Rodar a aplicação localmente (`npm run dev`) contra um banco de desenvolvimento com
   dados fictícios — nunca contra o banco de produção da cliente.
2. Preencher `Settings` com um nome de proprietária fictício, endereço genérico e um
   número de WhatsApp de teste, se for capturar telas que exibem esses campos.
3. Usar nomes de cliente fictícios (ex.: "Maria Exemplo") em qualquer tela de checkout.
4. Fechar todas as outras abas e desativar notificações do sistema operacional antes de
   capturar.
5. Ampliar a janela do navegador para os viewports exatos listados abaixo, em vez de
   redimensionar manualmente.

## Telas planejadas

| Tela | Objetivo da prova | Viewport | Dados necessários | Risco de exposição | Tratamento |
| --- | --- | --- | --- | --- | --- |
| Página inicial | Mostrar identidade visual, hero e SEO local em contexto | 1440×900 e 390×844 | Nome da loja, endereço e WhatsApp fictícios em `Settings` | Endereço/telefone reais da cliente, se o banco local tiver dados reais | Popular `Settings` local com dados fictícios antes de capturar |
| Catálogo (`/produtos`) | Grid de produtos, filtro por categoria, responsividade | 1440×900 | Produtos do catálogo versionado (`prisma/product-catalog.ts`) | Fotos de produto sem autoria confirmada | Usar apenas se a autorização das fotos for confirmada por Wilian (ver observação abaixo) |
| Categoria (`/categoria/[slug]`) | Navegação por categoria, breadcrumb, JSON-LD implícito | 1440×900 | Categoria com produtos ativos | Baixo | — |
| Detalhe do produto (`/produto/[slug]`) | Tipos de preço (fixo, "a partir de", sob consulta), botão de adicionar | 390×844 | Um produto de cada tipo de preço, se possível | Baixo | — |
| Carrinho (`/carrinho`) | Itens, quantidades, subtotais, total estimado, aviso de "sob consulta" | 390×844 | 2–3 itens fictícios | Baixo | — |
| Revisão do pedido (`/pedido`) | Formulário com validação inline, modalidade retirada/entrega | 390×844 | Nome fictício ("Maria Exemplo"), endereço fictício | Dados pessoais reais se preenchidos por engano | Preencher sempre com dados de teste explícitos |
| Painel administrativo (`/admin`) | Visão geral com contadores de produtos | 1440×900 | Contadores de um banco de demonstração | URL/sessão do admin visível na barra de endereço | Recortar ou ocultar a barra de endereço na captura final |
| Produtos (admin) — listagem e exclusão | CRUD, modal de confirmação destrutiva aberto | 1440×900 | Produto fictício de teste | Baixo, se não houver exclusão real de dado de produção | Capturar o modal aberto, sem confirmar a exclusão |
| Login administrativo | Formulário de acesso, sem credenciais preenchidas | 390×844 | Campos vazios | Baixo | Nunca preencher com senha real, nem de teste, na captura |
| Comparação desktop × mobile | Demonstrar responsividade da mesma tela em dois formatos | Composição de 1440×900 + 390×844 | Mesma tela nos dois viewports | Baixo | Montagem lado a lado, sem sobreposição de outras informações |

## Observação sobre as fotos de produto

O repositório contém 23 arquivos de imagem em `src/assets/images/Categorias/`, usados
pelo catálogo versionado. Este documento **não confirma** autoria ou autorização de uso
público dessas imagens — isso está registrado como pendência em
[`EVIDENCIAS.md`](./EVIDENCIAS.md). Antes de incluir qualquer uma delas em uma captura
publicada, confirme a autorização de uso.

## Onde salvar

Capturas aprovadas entram em `docs/case-publico-floricultura/assets/`, com nome
descritivo (`home-desktop.png`, `carrinho-mobile.png` etc.). Nenhuma imagem foi
adicionada nesta fase.
