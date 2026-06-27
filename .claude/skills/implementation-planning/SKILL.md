---
name: implementation-planning
description: Transforma uma demanda da Floricultura Rosa de Saron em plano incremental, seguro e pronto para execução. Use antes de mudanças sensíveis ou multiarquivo.
---

# Implementation Planning

## Quando usar

- tarefa grande, sensível ou com vários arquivos;
- alteração em autenticação, Prisma, SEO, carrinho, WhatsApp ou admin;
- continuidade entre Claude Code e Codex;
- critérios de aceite ou dependências ainda precisam ser organizados.

## Quando não usar

- tarefa pequena e totalmente definida;
- revisão de diff;
- explicação conceitual;
- plano já suficiente e atualizado.

## Pré-requisitos

1. Ler regras gerais e específicas dos agentes.
2. Confirmar branch, working tree e estado atual.
3. Ler documentação, implementação e testes relacionados.
4. Separar fatos observados de hipóteses.
5. Identificar scripts reais em `package.json`.

## Fluxo

1. Declarar objetivo, público e comportamento esperado.
2. Fixar escopo incluído e excluído.
3. Listar arquivos confirmados e candidatos a verificar.
4. Mapear contratos e fluxos críticos.
5. Quebrar o trabalho em passos pequenos e reversíveis.
6. Definir interfaces, dados, falhas e compatibilidade.
7. Definir validações e critérios de aceite por etapa.
8. Registrar riscos, mitigação e regras de parada.
9. Preparar continuidade entre agentes sem implementar.

## Checklist de segurança e técnica

- [ ] Nenhum arquivo real de ambiente ou segredo será acessado.
- [ ] Nenhuma migration, instalação ou ação Git externa será automática.
- [ ] Nenhuma alteração fora do escopo está implícita.
- [ ] Stack e caminhos foram confirmados no repositório.
- [ ] Rotas, tipos, banco e autenticação têm impacto mapeado.
- [ ] SEO, WhatsApp, carrinho e mobile foram considerados quando afetados.
- [ ] Testes não executados não são apresentados como executados.
- [ ] O plano não deixa decisões para o implementador.

## Saída esperada

Objetivo, escopo, arquivos, abordagem, interfaces, etapas, critérios de aceite, validações, riscos, restrições e continuidade.

## Regras de parada

Pare se objetivo ou critério de aceite for contraditório, se depender de credencial/ambiente inacessível ou se uma escolha de produto de alto impacto estiver ausente.

## Restrições e integração

Não edite arquivos durante esta skill. Integre o plano com `PROJECT_RULES.md`, `AGENTS.md`, `CLAUDE.md`, `CODEX.md` e o template de relatório.
