# Checklist de publicação — Case Floricultura Rosa de Saron

Este checklist cobre os passos entre "case escrito" e "case publicado", seja no
portfólio, em PDF ou no LinkedIn. Nenhum destes passos foi executado — todos ficam para
Wilian decidir e realizar.

## 0. Item de segurança obrigatório antes de divulgar o link do repositório

`deploy-to-vps.sh`, versionado neste repositório, contém o host da VPS
(`VPS_HOST="root@..."`) com usuário `root` e o IP do servidor em texto plano. Se o
repositório `github.com/wiliangulini/floricultura-rosa-de-saron` for público, divulgar
o link no case, no portfólio ou no LinkedIn expõe esse dado a qualquer pessoa que abra
o arquivo.

Antes de divulgar o link do repositório:

- [ ] Decidir se o repositório continuará público ou passará a privado.
- [ ] Se público: mover `VPS_HOST`, `DOMAIN` e demais dados de infraestrutura para
      variáveis de ambiente carregadas fora do controle de versão, e considerar
      reescrever o histórico do Git para remover o valor exposto nos commits antigos.
- [ ] Se o IP ou o acesso root já estiverem expostos há tempo: considerar rotacionar as
      credenciais/chaves de acesso à VPS, independentemente da decisão sobre o
      repositório.
- [ ] Só depois de resolver isso, publicar o link do repositório em qualquer material
      público.

Este passo é uma decisão e uma ação de infraestrutura — fora do escopo deste pacote de
documentação. Ele não foi executado aqui.

## 1. Revisão de conteúdo do case

- [ ] Ler `README.md` do case inteiro e confirmar que cada afirmação técnica tem
      respaldo em `EVIDENCIAS.md`.
- [ ] Confirmar que "em desenvolvimento" aparece de forma inequívoca no título, no
      status e nas limitações.
- [ ] Confirmar que nenhuma métrica de negócio, SEO ou performance foi apresentada como
      resultado medido (todas devem estar como meta ou próximo passo).
- [ ] Confirmar que nenhum dado pessoal ou operacional da cliente aparece no texto.
- [ ] Revisar ortografia e consistência editorial em português.

## 2. Capturas de tela

- [ ] Seguir `PLANO-SCREENSHOTS.md` e capturar apenas as telas com dados sanitizados.
- [ ] Confirmar a autorização de uso das fotos de produto antes de incluir qualquer
      captura que as exiba.
- [ ] Salvar os arquivos aprovados em `assets/` com nomes descritivos.
- [ ] Referenciar as imagens no `README.md` do case, com legendas curtas.

## 3. Escolha do destino de publicação

- [ ] Se for para o **portfólio pessoal**: transportar o conteúdo de `README.md` (e as
      imagens de `assets/`) para o repositório do portfólio, adaptando apenas
      formatação — sem alterar as afirmações técnicas sem revisar `EVIDENCIAS.md`
      novamente.
- [ ] Se for para **PDF**: manter `README.md` como fonte editável; gerar o PDF a partir
      dele (por exemplo, exportando de um visualizador Markdown ou de uma ferramenta de
      conversão) e revisar a paginação e a legibilidade em pelo menos duas resoluções
      de tela antes de considerar pronto.
- [ ] Em qualquer um dos dois casos, manter este pacote (`docs/case-publico-floricultura/`)
      como referência interna, mesmo depois do transporte.

## 4. Publicação do Destaque do LinkedIn

Texto pronto, para colar manualmente quando decidir publicar — **não publicado por
este agente**:

> **Título:** Case — catálogo e painel administrativo com Next.js
>
> **Descrição:** Aplicação em desenvolvimento com catálogo, carrinho, painel
> administrativo e fluxo de pedidos pelo WhatsApp.

- [ ] Confirmar se o Destaque deve linkar para o portfólio, para o PDF ou para o
      repositório (respeitando o item 0 antes de linkar o repositório).

## 5. Depois de publicar

- [ ] Reler o material publicado como se fosse um recrutador vendo pela primeira vez.
- [ ] Confirmar que os links funcionam (portfólio, GitHub, site, se citados).
- [ ] Guardar a data de publicação para referência futura.
