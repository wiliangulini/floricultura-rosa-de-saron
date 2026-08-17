# Checklist de publicação — Case Floricultura Rosa de Saron

Este checklist cobre os passos entre "case escrito" e "case publicado", seja no
portfólio, em PDF ou no LinkedIn. Nenhum destes passos foi executado — todos ficam para
Wilian decidir e realizar.

## 0. Observação de segurança sobre o histórico do repositório (não bloqueante)

O arquivo atual de `deploy-to-vps.sh`, na `main`, **não mantém mais um host fixo**: o
destino SSH agora é exigido pela variável de ambiente `VPS_HOST`, sem valor padrão — o
script falha imediatamente se ela não estiver definida. Isso foi corrigido no código
(não apenas nos documentos do case) e está coberto por um teste automatizado que
verifica a falha explícita quando `VPS_HOST` está ausente.

O uso de `root` na estrutura de deploy continua fazendo parte da configuração
operacional vigente da VPS. Isso não é, por si só, uma credencial exposta; é uma
oportunidade de hardening futuro (usuário de deploy com privilégios limitados,
autenticação só por chave, `fail2ban`), não um bloqueio à publicação do case.

O endereço que estava fixo anteriormente permanece recuperável no histórico do Git (no
commit que introduziu o arquivo). Essa condição foi tratada como observação, não como
bloqueio, pelos seguintes motivos: o script corrigido já reflete a prática correta; o
domínio público da loja (`rosa-de-saron.com`) provavelmente resolve, via DNS, para o
mesmo endereço, o que reduz o valor prático de reescrever o histórico; e uma reescrita
de histórico (force-push, mudança de todos os hashes posteriores) tem custo e risco
maiores do que o benefício nesse caso específico.

Antes de divulgar o link do repositório, ainda vale:

- [ ] Confirmar que nenhum outro arquivo versionado contém credencial, token ou
      segredo real (checagem pontual, não uma auditoria completa de infraestrutura).
- [ ] Se desejar reduzir a exposição do endereço antigo no histórico, considerar isso
      como melhoria independente e não urgente — não é pré-requisito para publicar
      o case.
- [ ] Avaliar, como hardening futuro e separado deste checklist, se a VPS usa
      autenticação SSH só por chave, `fail2ban` e um usuário de deploy com privilégios
      limitados em vez de `root`.

Esta observação é informativa; não bloqueia nenhum dos passos seguintes deste
checklist.

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
