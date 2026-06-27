# Manual completo das configurações de IA

## 1. Objetivo

Este manual explica como utilizar os recursos versionados em `.codex/` e
`.claude/` neste repositório. Ele cobre:

- os 5 templates de prompt do Codex;
- os 11 comandos do Claude Code;
- as 6 skills do Claude Code;
- as instruções e configurações operacionais das duas ferramentas;
- a escolha do recurso adequado para cada tipo de tarefa.

Os documentos raiz `PROJECT_RULES.md` e `AGENTS.md` continuam sendo as fontes
principais das regras do projeto. Um prompt, comando ou skill organiza o
trabalho, mas nunca amplia o escopo autorizado pelo usuário.

## 2. Mapa integral das pastas

Foram encontrados 27 arquivos: 7 em `.codex/` e 20 em `.claude/`.

```text
.codex/
├── config.toml
├── instructions.md
└── prompts/
    ├── architecture-decision.md
    ├── create-code.md
    ├── debug.md
    ├── refactor-code.md
    └── review-code.md

.claude/
├── commands/
│   ├── architecture-decision.md
│   ├── checklist-merge.md
│   ├── continue-from-codex.md
│   ├── create-code.md
│   ├── debug-app.md
│   ├── final-audit.md
│   ├── melhorar-ui-ux.md
│   ├── refactor-code.md
│   ├── review-code.md
│   ├── revisar-performance.md
│   └── revisar-seguranca.md
├── instructions.md
├── settings.json
├── settings.local.json
└── skills/
    ├── architecture-review/SKILL.md
    ├── implementation-planning/SKILL.md
    ├── legacy-code-audit/SKILL.md
    ├── safe-refactor/SKILL.md
    ├── senior-code-agent/SKILL.md
    └── senior-code-review/SKILL.md
```

### 2.1 O que cada grupo representa

| Grupo | Finalidade | Como é usado |
| --- | --- | --- |
| `.codex/config.toml` | Preferências compartilhadas do Codex | Carregado em repositório confiável |
| `.codex/instructions.md` | Procedimento operacional complementar | Lido porque `AGENTS.md` e `CODEX.md` exigem |
| `.codex/prompts/*.md` | Templates compartilhados | Copiar, preencher e colar no Codex |
| `.claude/instructions.md` | Procedimento operacional complementar | Lido porque `AGENTS.md` e `CLAUDE.md` exigem |
| `.claude/settings.json` | Permissões compartilhadas do Claude Code | Carregado no projeto |
| `.claude/settings.local.json` | Permissões específicas desta máquina | Carregado localmente e ignorado pelo Git |
| `.claude/commands/*.md` | Comandos de workflow do Claude Code | Invocados manualmente com `/nome` |
| `.claude/skills/*/SKILL.md` | Workflows especializados do Claude Code | Invocados com `/nome` ou por correspondência da descrição |

## 3. Hierarquia e precedência

### 3.1 Regras comuns

Para qualquer tarefa neste repositório, a ordem operacional esperada é:

1. solicitação atual do usuário;
2. `PROJECT_RULES.md`;
3. `AGENTS.md`;
4. documento específico do agente (`CODEX.md` ou `CLAUDE.md`);
5. instruções específicas da pasta do agente;
6. prompt, comando ou skill utilizado;
7. código, testes e documentação reais.

Em caso de conflito, um recurso auxiliar não pode contrariar uma regra de nível
superior. O estado real do Git e dos arquivos prevalece sobre relatórios
anteriores.

### 3.2 Descoberta no Codex

O Codex lê `AGENTS.md` automaticamente. Neste projeto, o próprio `AGENTS.md`
manda ler `PROJECT_RULES.md`, `CODEX.md` e `.codex/instructions.md`.

O arquivo `.codex/config.toml` define configurações de projeto e só é aplicado
quando o repositório é confiável. Overrides de linha de comando têm precedência
sobre a configuração do projeto; a configuração do projeto tem precedência
sobre perfil, configuração do usuário, configuração de sistema e defaults.

Os arquivos em `.codex/prompts/` **não são descobertos automaticamente**. Eles
foram mantidos como templates versionados para copiar e colar.

Prompts customizados do Codex estão depreciados. Quando ainda usados, somente
arquivos Markdown colocados diretamente em `~/.codex/prompts/` aparecem como
`/prompts:nome` após reiniciar a sessão. Não copie estes templates para essa
pasta sem uma decisão explícita; para novos workflows reutilizáveis, a
orientação atual é criar skills.

O Codex também não descobre as skills em `.claude/skills/`. Skills de
repositório para Codex devem ficar em `.agents/skills/<nome>/SKILL.md`.

### 3.3 Descoberta no Claude Code

Arquivos em `.claude/commands/` criam comandos de projeto com o nome do arquivo:
`create-code.md` cria `/create-code`, por exemplo. Esse formato continua
funcionando, embora skills sejam o formato atual mais completo.

Todos os 11 comandos deste projeto possuem:

```yaml
disable-model-invocation: true
```

Isso impede o Claude de escolhê-los automaticamente. O usuário precisa
invocá-los manualmente.

As skills em `.claude/skills/` não possuem essa restrição. Elas podem ser:

- invocadas explicitamente com `/nome-da-skill`;
- selecionadas pelo Claude quando a solicitação corresponde à descrição.

O conteúdo de uma skill é carregado somente quando ela é usada. O nome da pasta
é o comando padrão e o frontmatter fornece nome e descrição.

### 3.4 Precedência das configurações Claude

A precedência geral das configurações é:

1. configuração gerenciada pela organização;
2. argumentos de linha de comando;
3. `.claude/settings.local.json`;
4. `.claude/settings.json`;
5. `~/.claude/settings.json`.

Nas permissões, regras `deny` têm prioridade sobre `ask`, que têm prioridade
sobre `allow`. Uma permissão local ampla não neutraliza uma proibição aplicável
em outro nível.

## 4. Como escolher o recurso

### 4.1 Necessidade → recurso recomendado

| Necessidade | Codex | Claude Code |
| --- | --- | --- |
| Implementar alteração localizada | `create-code.md` | `/create-code` ou `/senior-code-agent` |
| Revisar um diff sem editar | `review-code.md` | `/review-code` ou `/senior-code-review` |
| Investigar um bug | `debug.md` | `/debug-app` |
| Refatorar sem mudar comportamento | `refactor-code.md` | `/refactor-code` ou `/safe-refactor` |
| Comparar alternativas arquiteturais | `architecture-decision.md` | `/architecture-decision` ou `/architecture-review` |
| Planejar mudança sensível/multiarquivo | Prompt comum com escopo explícito | `/implementation-planning` |
| Auditar código antigo | Prompt comum de auditoria | `/legacy-code-audit` |
| Continuar trabalho do Codex | Fornecer relatório e estado real | `/continue-from-codex` |
| Auditar antes do merge | `review-code.md` adaptado | `/checklist-merge` |
| Fazer auditoria final | Solicitação comum de auditoria | `/final-audit` |
| Melhorar UI/UX | `create-code.md` com escopo visual | `/melhorar-ui-ux` |
| Revisar performance | Prompt de revisão com foco mensurável | `/revisar-performance` |
| Revisar segurança | Prompt de revisão com foco em segurança | `/revisar-seguranca` |

### 4.2 Recurso → altera arquivos ou somente analisa

| Recurso | Comportamento padrão |
| --- | --- |
| Codex `create-code` | Implementa após análise |
| Codex `debug` | Começa sem editar; só corrige se autorizado |
| Codex `refactor-code` | Refatora dentro do escopo |
| Codex `review-code` | Somente analisa |
| Codex `architecture-decision` | Somente analisa |
| Claude `/create-code` | Implementa após análise |
| Claude `/debug-app` | Começa sem editar; só corrige se autorizado |
| Claude `/refactor-code` | Refatora dentro do escopo |
| Claude `/review-code` | Somente analisa |
| Claude `/architecture-decision` | Somente analisa |
| Claude `/checklist-merge` | Somente analisa |
| Claude `/continue-from-codex` | Pode implementar o próximo passo autorizado |
| Claude `/final-audit` | Somente analisa; não cria melhorias |
| Claude `/melhorar-ui-ux` | Pode implementar a melhoria solicitada |
| Claude `/revisar-performance` | Começa sem editar |
| Claude `/revisar-seguranca` | Somente analisa |
| Skill `senior-code-agent` | Implementa |
| Skill `senior-code-review` | Somente analisa |
| Skill `safe-refactor` | Refatora sem mudança funcional |
| Skill `legacy-code-audit` | Somente analisa |
| Skill `architecture-review` | Somente analisa, salvo autorização explícita |
| Skill `implementation-planning` | Somente planeja |

## 5. Templates do Codex

### 5.1 Procedimento geral

Para usar qualquer template:

1. abra o arquivo em `.codex/prompts/`;
2. copie o conteúdo completo;
3. substitua os campos entre colchetes;
4. remova seções vazias ou complete-as com fatos;
5. cole o texto no Codex junto com evidências relevantes;
6. confirme que o escopo e a autorização para editar estão claros.

Não invoque `/prompts:nome` esperando que esses arquivos do repositório sejam
carregados. Esse comando só existe para prompts instalados no diretório pessoal
depreciado `~/.codex/prompts/`.

### 5.2 `architecture-decision.md`

**Quando usar:** antes de uma decisão que afete arquitetura, contratos,
persistência, autenticação, integrações ou múltiplos fluxos.

**Como preencher:** substitua `[DESCREVA O PROBLEMA OU A DECISÃO]` pela decisão
concreta, restrições conhecidas e comportamento desejado.

**O que produz:** contexto, evidências por arquivo, alternativas, trade-offs,
recomendação, impactos, riscos, plano incremental e critérios de aceite.

**Limitação:** começa sem implementar. Não deve ser usado para justificar troca
de stack ou abstração sem necessidade comprovada.

**Exemplo:**

```text
Decida se o filtro de categorias deve permanecer como parâmetro de URL ou
passar para estado local. Preserve SEO, navegação do App Router e links
compartilháveis. Não implemente.
```

### 5.3 `create-code.md`

**Quando usar:** implementação segura e localizada, com escopo conhecido.

**Como preencher:**

- `[DESCREVA A TAREFA]`: comportamento exato a criar ou corrigir;
- `[LISTE ARQUIVOS OU ÁREAS]`: limite autorizado da alteração.

**O que produz:** análise prévia, menor implementação correta, revisão do diff
e relatório de arquivos, comandos, resultados e riscos.

**Limitação:** não autoriza dependência, migration, segredo ou ampliação de
escopo. Se a tarefa exigir isso, o agente deve parar e informar.

**Exemplo:**

```text
Tarefa: adicionar estado vazio à listagem pública de uma categoria.
Escopo permitido: src/app/(public)/categoria/[slug]/page.tsx e teste direto.
```

### 5.4 `debug.md`

**Quando usar:** investigar sintoma, erro, regressão ou comportamento
inconsistente.

**Como preencher:** informe sintoma, reprodução, comportamento esperado,
comportamento atual e evidências. Inclua mensagens de erro completas quando não
contiverem dados sensíveis.

**O que produz:** fluxo analisado, fatos, hipóteses, causa provável ou
confirmada, correção mínima e validações.

**Limitação:** começa sem editar. Para implementar a correção, o pedido precisa
dizer explicitamente que a correção está autorizada.

**Exemplo:**

```text
Sintoma: produtos desaparecem após recarregar uma categoria.
Passos: abrir /categoria/buques, avançar a página e recarregar.
Esperado: manter uma página válida.
Atual: lista vazia.
Corrija somente se a causa for confirmada.
```

### 5.5 `refactor-code.md`

**Quando usar:** reduzir duplicação ou complexidade sem alterar comportamento,
contratos, rotas ou aparência.

**Como preencher:** em `[DESCREVA O PROBLEMA E O ESCOPO]`, descreva o problema
estrutural, os arquivos permitidos e o comportamento invariável.

**O que produz:** passos pequenos e reversíveis, contratos preservados,
evidências e riscos residuais.

**Limitação:** não deve misturar feature, bugfix, migration ou design pattern
especulativo.

**Exemplo:**

```text
Extraia apenas a formatação duplicada de preços dos dois componentes de card.
O texto, HTML, rotas e comportamento visual devem permanecer iguais.
```

### 5.6 `review-code.md`

**Quando usar:** revisão técnica de um diff, implementação ou entrega.

**Como preencher:** substitua `[DESCREVA O OBJETIVO E OS CRITÉRIOS DE ACEITE]`
pelo escopo original e pelos resultados verificáveis esperados.

**O que produz:** achados por severidade, arquivo, evidência, impacto, correção,
indicação de bloqueio e decisão final.

**Limitação:** não altera arquivos e não trata preferência cosmética como
bloqueador.

**Exemplo:**

```text
Revise o diff da paginação de categorias. Critérios: URLs canônicas, nenhuma
consulta duplicada, estado vazio correto e compatibilidade mobile.
```

## 6. Comandos do Claude Code

### 6.1 Procedimento geral

Dentro de uma sessão do Claude Code iniciada neste repositório:

1. digite `/` para abrir o menu;
2. selecione ou digite o nome do comando;
3. acrescente o argumento indicado pelo `argument-hint`;
4. envie a mensagem.

O texto depois do nome é disponibilizado no comando como `$ARGUMENTS`.

Exemplo:

```text
/review-code Revise o diff da paginação e valide os critérios descritos no issue.
```

Como todos os comandos têm `disable-model-invocation: true`, pedir em linguagem
natural algo semelhante não garante que o arquivo de comando será carregado.
Use o nome explícito quando quiser esse workflow.

### 6.2 `/architecture-decision [decisão ou problema]`

**Use para:** comparar alternativas arquiteturais no contexto real do projeto.

**Não use para:** implementar diretamente ou analisar um ajuste pontual com
solução evidente.

**Saída:** contexto, evidências, restrições, alternativas, trade-offs,
recomendação, impactos, riscos, critérios de aceite e plano incremental.

**Exemplo:**

```text
/architecture-decision Devemos manter as ações do admin em Server Actions ou criar APIs administrativas?
```

Não implementa nem salva ADR sem pedido explícito.

### 6.3 `/checklist-merge [escopo esperado]`

**Use para:** auditoria imediatamente anterior ao merge.

**Verifica:** branch, status, diff, arquivos acidentais, segredos, dependências,
migrations, contratos, fluxos críticos e validações realmente executadas.

**Saída:** divergências de escopo, riscos, validações pendentes e decisão
`pronto`, `pronto com observações` ou `requer ajustes`.

**Exemplo:**

```text
/checklist-merge Correção da exclusão de produtos e categorias no admin.
```

Não altera arquivos.

### 6.4 `/continue-from-codex [relatório ou contexto do Codex]`

**Use para:** transferir uma tarefa do Codex para o Claude Code.

**Forneça:** relatório anterior, objetivo original e, quando existente, caminho
do relatório persistente.

**Fluxo:** compara o relatório com branch, status, diff e arquivos reais;
preserva trabalho válido e continua somente o próximo passo autorizado.

**Exemplo:**

```text
/continue-from-codex O Codex implementou o formulário e deixou os testes pendentes. Valide o diff e conclua somente os testes do escopo original.
```

Não deve repetir nem desfazer trabalho apenas com base no relato.

### 6.5 `/create-code [tarefa e escopo permitido]`

**Use para:** implementação localizada e controlada.

**Forneça:** comportamento esperado, arquivos ou áreas permitidas e critérios de
aceite.

**Fluxo:** lê regras e arquivos, confirma contratos, informa estratégia e
riscos, implementa a menor mudança e executa validações proporcionais.

**Exemplo:**

```text
/create-code Adicione uma mensagem de estado vazio na página de categoria. Escopo: página de categoria e teste direto.
```

Não instala dependências, executa migration, faz commit ou push por conta
própria.

### 6.6 `/debug-app [sintoma, reprodução e resultado esperado]`

**Use para:** investigar um bug com evidências.

**Forneça:** sintoma observável, passos de reprodução, resultado atual e
resultado esperado.

**Saída:** hipóteses separadas de fatos, causa provável ou confirmada, correção
aplicada ou recomendada, validações e riscos.

**Exemplo:**

```text
/debug-app Ao excluir uma categoria com produtos ocorre erro genérico. Reproduza pelo fluxo admin, identifique a causa e corrija se confirmada.
```

Começa sem editar e só implementa quando o pedido autoriza.

### 6.7 `/final-audit [contexto da entrega]`

**Use para:** última auditoria depois da implementação e das validações.

**Verifica:** escopo, alterações acidentais, código morto, logs, segredos,
dependências, regressões, comandos executados e compatibilidade entre agentes.

**Saída:** `pronto`, `pronto com observações` ou `não pronto`.

**Exemplo:**

```text
/final-audit Entrega do novo modal de confirmação no admin.
```

Não implementa melhorias novas e não executa commit.

### 6.8 `/melhorar-ui-ux [tela, problema e resultado esperado]`

**Use para:** melhoria visual incremental com foco mobile e acessibilidade.

**Forneça:** tela afetada, problema verificável e resultado esperado.

**Preserva:** Tailwind v4, componentes existentes, regras de negócio, textos e
comportamento funcional.

**Exemplo:**

```text
/melhorar-ui-ux Na lista de produtos do admin, torne as ações utilizáveis em 320 px sem esconder funcionalidades.
```

Não introduz biblioteca visual, tema global, reescrita, mudança de SEO ou regra
de negócio sem autorização.

### 6.9 `/refactor-code [área e problema estrutural]`

**Use para:** refatoração incremental com comportamento invariável.

**Forneça:** problema estrutural concreto, limite de arquivos e contratos que
devem permanecer.

**Saída:** diff pequeno, evidências de preservação, validações e riscos.

**Exemplo:**

```text
/refactor-code Remova a duplicação entre os dois formatadores de preço sem alterar a saída pública.
```

Deve parar se surgir necessidade de feature, migration, dependência ou mudança
de contrato.

### 6.10 `/review-code [escopo ou critérios de aceite]`

**Use para:** revisar diff sem editar.

**Prioriza:** bugs, regressões, segurança, contratos, dados e ausência de testes
críticos.

**Saída:** achados demonstráveis com severidade, arquivo, evidência, impacto e
correção, seguidos de decisão objetiva.

**Exemplo:**

```text
/review-code Revise a exclusão de categorias. Excluir deve exigir confirmação e categorias em uso não podem deixar dados inconsistentes.
```

Não reprova por preferência estética.

### 6.11 `/revisar-performance [página, fluxo ou diff]`

**Use para:** revisão de performance baseada em evidência e medição.

**Avalia:** Server/Client Components, waterfalls, Prisma, cache, serialização,
bundle, re-renderizações, `next/image`, LCP e CLS.

**Saída:** achados, evidências, impacto provável, forma de medir, prioridade,
riscos e validações.

**Exemplo:**

```text
/revisar-performance Avalie o LCP e o carregamento de imagens da página de produto no mobile.
```

Começa sem editar e não recomenda cache complexo ou troca de stack sem
evidência.

### 6.12 `/revisar-seguranca [fluxo, rota ou diff]`

**Use para:** auditoria de segurança de um fluxo real.

**Avalia:** autenticação HMAC, cookies, autorização, proxy, validação
server-side, CSRF/XSS, uploads, WhatsApp, recuperação de senha, dados pessoais e
logs.

**Saída:** achados com exploração plausível, evidência, impacto, severidade,
correção e validações recomendadas.

**Exemplo:**

```text
/revisar-seguranca Revise as Server Actions de exclusão do admin e a proteção contra chamadas não autorizadas.
```

Não acessa `.env`, credenciais ou tokens e não altera arquivos.

## 7. Skills do Claude Code

### 7.1 Procedimento geral

Uma skill pode ser chamada explicitamente:

```text
/senior-code-review Revise o diff atual conforme o escopo da tarefa.
```

Também pode ser acionada implicitamente por uma solicitação que corresponda à
descrição:

```text
Revise o diff atual, classifique problemas por severidade e não altere arquivos.
```

A invocação explícita é preferível quando o workflow exato importa. Skills não
ampliam autorização: uma skill de implementação ainda precisa respeitar o
escopo dado pelo usuário.

### 7.2 `/architecture-review`

**Use para:** decisão que afete várias camadas, contrato, integração,
persistência ou divisão de responsabilidades.

**Não use para:** bug pontual, ajuste localizado ou decisão já definida nas
regras.

**Pré-requisitos:** regras, branch, working tree, stack, arquivos, consumidores
e testes.

**Fluxo:** define problema, registra evidências, mapeia impactos, compara manter
o padrão com alternativas e recomenda a solução de menor complexidade.

**Regra de parada:** falta de arquivo essencial, conflito com as regras ou
mudança crítica não autorizada.

**Integração:** usa `/architecture-decision` como formato operacional e o
template de relatório quando a decisão precisar ser persistida.

### 7.3 `/implementation-planning`

**Use para:** tarefa sensível, multiarquivo, continuidade entre agentes ou
alteração em autenticação, Prisma, SEO, carrinho, WhatsApp ou admin.

**Não use para:** tarefa pequena totalmente definida, revisão de diff ou plano
já suficiente.

**Pré-requisitos:** regras, estado do Git, implementação, testes, fatos e scripts
reais do `package.json`.

**Fluxo:** fixa objetivo e escopo, mapeia contratos, divide etapas, define
interfaces, falhas, compatibilidade, validações, riscos e critérios de aceite.

**Regra de parada:** objetivo contraditório, dependência de credencial ou
decisão de produto importante ausente.

**Integração:** não edita arquivos; prepara execução e continuidade.

### 7.4 `/legacy-code-audit`

**Use para:** fluxo antigo, pouco documentado, com consumidores desconhecidos ou
antes de uma refatoração.

**Não use para:** revisão limitada ao diff ou correção cuja causa já esteja
confirmada.

**Pré-requisitos:** delimitar o fluxo, ler arquivos centrais, consumidores e
testes, sem editar.

**Fluxo:** mapeia entrada, estado, dados, efeitos, saída, responsabilidades,
dependências, contratos, segurança, performance e lacunas de testes.

**Regra de parada:** arquivos centrais ausentes, ambiente externo obrigatório ou
acesso sensível.

**Integração:** encaminha uma refatoração aprovada para `/safe-refactor`.

### 7.5 `/safe-refactor`

**Use para:** duplicação ou complexidade comprovada, separação localizada de
responsabilidades, legibilidade, testabilidade ou código morto confirmado.

**Não use para:** feature, bugfix, mudança de contrato, redesign ou preferência
estética.

**Pré-requisitos:** regras, arquivos, consumidores, testes, contratos e
comportamento invariável documentado.

**Fluxo:** limita arquivos, executa uma mudança lógica por vez, evita renomeação
não relacionada, revisa o diff e valida preservação.

**Regra de parada:** necessidade de migration, biblioteca, reescrita ou mudança
funcional.

**Integração:** usa `/refactor-code` como comando operacional.

### 7.6 `/senior-code-agent`

**Use para:** implementação incremental, ajuste localizado, correção autorizada
ou continuidade de outro agente.

**Não use para:** revisão sem edição, decisão arquitetural aberta, auditoria,
refatoração estrutural ou escopo crítico ambíguo.

**Pré-requisitos:** regras, branch, working tree, relatório anterior, arquivos,
consumidores, testes e scripts.

**Fluxo:** resume escopo, identifica riscos, implementa a menor solução, revisa
o diff, valida e entrega relatório transparente.

**Regra de parada:** conflito com regras, risco de perda de dados, informação
crítica ausente ou ampliação material do escopo.

**Integração:** usa `/create-code` para implementar e `/final-audit` antes da
entrega.

### 7.7 `/senior-code-review`

**Use para:** revisão de diff, pré-commit, pré-merge, critérios de aceite ou
trabalho de outro agente.

**Não use para:** implementação, planejamento sem diff, refatoração ou auditoria
especializada.

**Pré-requisitos:** escopo original, branch, status, diff, arquivos alterados,
consumidores, testes e resultados de validação.

**Fluxo:** compara diff e escopo, verifica regressões, contratos, dados,
segurança e fluxos afetados, separa bloqueadores de sugestões e emite decisão.

**Regra de parada:** ausência de diff/escopo essencial, possível segredo,
mudança destrutiva ou quebra de autenticação sem contexto.

**Integração:** usa `/review-code` e `/checklist-merge` conforme a etapa.

## 8. Configuração do Codex

### 8.1 `.codex/config.toml`

| Opção | Valor do projeto | Efeito |
| --- | --- | --- |
| `model_reasoning_effort` | `high` | Solicita maior esforço de raciocínio quando suportado |
| `approval_policy` | `on-request` | Permite solicitar aprovação para ações fora do limite atual |
| `sandbox_mode` | `workspace-write` | Restringe escrita ao workspace permitido |
| `web_search` | `cached` | Usa resultados pré-indexados por padrão |
| `file_opener` | `vscode` | Abre arquivos pelo VS Code quando aplicável |
| `project_doc_max_bytes` | `65536` | Limite agregado para instruções descobertas |
| `project_doc_fallback_filenames` | `PROJECT_RULES.md`, `CODEX.md` | Fallback quando não há `AGENTS.md` no nível consultado |

Preferências pessoais, autenticação e credenciais não pertencem a esse arquivo.

### 8.2 `.codex/instructions.md`

Esse documento:

- fixa a ordem de leitura e o protocolo antes de editar;
- exige a menor mudança correta;
- destaca carrinho, WhatsApp, SEO, admin, autenticação, Prisma e Cloudinary;
- proíbe acesso a segredos e operações Git/DB não autorizadas;
- separa revisão/diagnóstico de implementação;
- define o conteúdo obrigatório do relatório final.

Ele não é um prompt independente nem um comando. Deve ser tratado como
instrução complementar obrigatória porque os documentos raiz mandam lê-lo.

## 9. Configuração do Claude Code

### 9.1 `.claude/instructions.md`

Esse documento:

- define fontes de verdade e ordem de leitura;
- exige inspeção do estado real antes de editar;
- protege fluxos críticos e a separação entre agentes;
- resume a política compartilhada de permissões;
- estabelece revisão do diff e relatório final.

Ele não cria um slash command. É carregado por orientação de `CLAUDE.md` e
`AGENTS.md`.

### 9.2 `.claude/settings.json`

É a configuração compartilhada e versionada.

**Permitido sem nova confirmação:**

- Git de leitura: status, branch atual, diff e log;
- `npm run lint`;
- `npm run typecheck`;
- `npm run build`;
- testes unitários por `npm test` e `npm run test`.

**Exige confirmação:**

- staging, commit, checkout, switch, merge e rebase;
- instalação com npm e uso de `npx`;
- Playwright E2E;
- geração, migration, seed e Studio do Prisma.

**Bloqueado:**

- leitura ou escrita de arquivos reais de ambiente, segredos, credenciais,
  certificados e chaves;
- remoção recursiva, reset destrutivo e `git clean`;
- push;
- elevação de privilégio;
- acesso remoto com `curl`/`wget`;
- Docker;
- acesso direto a bancos;
- exposição ampla do ambiente;
- comandos destrutivos de sistema e permissões excessivas.

`defaultMode: "default"` mantém o comportamento padrão de aprovação.
`disableBypassPermissionsMode: "disable"` impede o uso do modo que contorna
permissões.

### 9.3 `.claude/settings.local.json`

É uma configuração específica da máquina e está ignorada pelo Git. Ela adiciona
um diretório pessoal de memória do Claude e permissões para workflows já
executados localmente, incluindo:

- comandos amplos de `npm run`, instalação e testes;
- TypeScript e utilitários Node;
- comandos Prisma e Playwright;
- staging e formas específicas de commit;
- inspeção de serviços/pacotes;
- consultas HTTP ao servidor local;
- preparação do banco E2E;
- comandos de diagnóstico pontuais.

Essas permissões locais são conveniências históricas, não recomendações gerais.
Elas devem ser revisadas antes de serem reutilizadas em outra máquina.

### 9.4 Alertas de segurança das permissões locais

1. Existem regras locais mais amplas que as regras compartilhadas. Uma entrada
   em `allow` reduz prompts, mas não transforma o comando em seguro para qualquer
   contexto.
2. Há um comando Bash permitido que abre `.env` e informa somente presença e
   comprimento de algumas variáveis. Mesmo sem imprimir valores, isso contorna a
   intenção de não acessar arquivos reais de ambiente e não deve ser usado.
3. Permissões para instalação, Prisma, Playwright, Git e `systemctl` podem gerar
   efeitos colaterais. Use somente com escopo e autorização explícitos.
4. Regras `deny` compartilhadas continuam prioritárias quando correspondem à
   ação.
5. Nunca copie o conteúdo local para `settings.json` sem auditoria. O arquivo
   compartilhado deve permanecer mínimo e seguro.

## 10. Workflows recomendados

### 10.1 Implementação

1. Defina comportamento, escopo e critérios de aceite.
2. Use o template Codex `create-code.md` ou `/create-code`.
3. Para tarefa Claude mais abrangente, use `/senior-code-agent`.
4. Revise o diff.
5. Execute validações proporcionais existentes em `package.json`.
6. Use `/final-audit` antes de entregar quando a mudança for relevante.

### 10.2 Diagnóstico

1. Forneça sintoma e reprodução.
2. Use `debug.md` ou `/debug-app`.
3. Exija separação entre fatos e hipóteses.
4. Autorize a correção explicitamente se desejar implementação.
5. Valide a causa raiz, não apenas o desaparecimento do sintoma.

### 10.3 Revisão

1. Forneça objetivo e critérios de aceite.
2. Use `review-code.md`, `/review-code` ou `/senior-code-review`.
3. Para segurança ou performance, prefira o comando especializado.
4. Antes do merge, use `/checklist-merge`.
5. Não peça correções no mesmo passo se deseja uma revisão independente.

### 10.4 Continuidade entre agentes

1. Gere um relatório conforme `docs/ai-reports/TEMPLATE-agent-report.md` quando
   a continuidade precisar ser persistida.
2. Informe objetivo, branch, arquivos, decisões, diff e validações.
3. No Claude Code, use `/continue-from-codex`.
4. O agente seguinte deve confirmar tudo no repositório antes de continuar.
5. Preserve as configurações específicas do outro agente.

## 11. Referências oficiais

- [Documentação do Codex](https://developers.openai.com/codex/)
- [Skills do Codex](https://developers.openai.com/codex/skills)
- [Prompts customizados do Codex](https://developers.openai.com/codex/custom-prompts)
- [Configuração do Codex](https://developers.openai.com/codex/config-basic)
- [Skills e comandos do Claude Code](https://code.claude.com/docs/en/slash-commands)
- [Comandos do Claude Code](https://code.claude.com/docs/en/commands)
- [Permissões do Claude Code](https://code.claude.com/docs/en/permissions)

Consulte as referências oficiais quando uma atualização das ferramentas puder
ter alterado descoberta, sintaxe ou precedência.
