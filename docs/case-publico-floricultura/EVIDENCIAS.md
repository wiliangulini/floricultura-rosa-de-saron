# Matriz de evidências — Case Floricultura Rosa de Saron

Revisão feita em: **2026-08-17**, sobre o repositório `floricultura-rosa-de-saron`,
branch `main`, commit de referência `d713bfe5fc947553d5d0e63cfc2689aef0425b69`.

> **Adendo de 2026-08-17:** após esta revisão, `deploy-to-vps.sh` foi corrigido para
> exigir `VPS_HOST` por variável de ambiente (não há mais host fixo no script) e ganhou
> um teste automatizado cobrindo essa exigência. A contagem de testes abaixo já reflete
> essa mudança. Detalhes em `CHECKLIST-PUBLICACAO.md`, item 0.

Comandos executados nesta revisão, no ambiente local:

| Comando | Resultado |
| --- | --- |
| `npm run lint` | Passou sem erros nem avisos. |
| `npm run typecheck` | Passou sem erros. |
| `npm run test` | **164 testes em 18 arquivos, todos passando.** |
| `npm run test:e2e` | **Não executado.** Ambiente local tem incompatibilidade conhecida entre a versão do Node e o Playwright instalado (registrada na memória de sessão do projeto); a suíte de 54 testes existe e está versionada, mas nenhuma afirmação neste case depende de uma execução recente. |
| `npm run build` | Não executado nesta revisão — fora do escopo desta tarefa documental. |

Legenda de status: **implementado e comprovado** · **parcialmente implementado** ·
**planejado** · **não encontrado** · **exige confirmação do usuário**.

| Afirmação candidata | Evidência | Arquivo ou teste | Status real | Pode ser publicada? | Observação |
| --- | --- | --- | --- | --- | --- |
| Aplicação em desenvolvimento | Trabalho ativo no repositório; ausência de tag de release | histórico de commits (56 commits, 2026-06-09 a 2026-07-13) | implementado e comprovado | Sim | é o status oficial do case |
| Vitrine digital para floricultura local | Escopo declarado e implementado | `PROJECT_RULES.md §1`; `src/app/(public)/` | implementado e comprovado | Sim | — |
| Catálogo organizado por produtos e categorias | Rotas, modelos e queries | `src/app/(public)/produtos/page.tsx`; `src/app/(public)/categoria/[slug]/page.tsx`; `prisma/schema.prisma` (`Product`, `Category`) | implementado e comprovado | Sim | — |
| Página de detalhes do produto | Rota dedicada com metadados e JSON-LD `Product` | `src/app/(public)/produto/[slug]/page.tsx` | implementado e comprovado | Sim | — |
| Carrinho mantido no navegador | Contexto React + `localStorage`, com parsing defensivo | `src/context/CartContext.tsx:108-194` | implementado e comprovado | Sim | dados do cliente tratados como não confiáveis, conforme `PROJECT_RULES.md §3` |
| Revisão do pedido antes do envio | Página de checkout com listagem e totais | `src/app/(public)/pedido/page.tsx`; `src/components/public/CheckoutForm.tsx` | implementado e comprovado | Sim | — |
| Envio do pedido pelo WhatsApp | Construção e codificação da mensagem, link `wa.me` | `src/lib/whatsapp.ts`; `src/lib/whatsapp.test.ts` (40 testes) | implementado e comprovado | Sim | — |
| Regra de preço `ON_REQUEST` fora do total | Função pura testada | `src/lib/whatsapp.ts:49-57`; `src/lib/whatsapp.test.ts` | implementado e comprovado | Sim | — |
| Ausência de pagamento online | Não há gateway, rota ou dependência de pagamento no código | busca no repositório; `PROJECT_RULES.md §10` | implementado e comprovado | Sim | decisão de escopo, não lacuna |
| Painel administrativo protegido | Middleware dedicado bloqueando `/admin/*` e `/api/admin/*` sem sessão | `src/proxy.ts`; `e2e/auth.spec.ts` (9 testes, não executados nesta revisão) | implementado e comprovado | Sim | citar como "existe", não "testado agora" |
| Gerenciamento de produtos e categorias | CRUD com formulários, ações de servidor e testes unitários | `src/app/admin/produtos/`; `src/app/admin/categorias/`; `actions.test.ts` de cada área | implementado e comprovado | Sim | — |
| Gerenciamento de configurações da loja | Formulário de configurações com um único registro `Settings` | `src/app/admin/configuracoes/`; `prisma/schema.prisma` (`Settings`) | implementado e comprovado | Sim | — |
| Autenticação administrativa customizada | HMAC-SHA256 via Web Crypto API, cookie assinado, `timingSafeEqual` | `src/lib/auth.ts`; `src/proxy.ts` | implementado e comprovado | Sim | sem detalhar valores/segredos |
| Recuperação de senha | Token de uso único, hash SHA-256 no banco, expiração de 30 min | `src/lib/password-reset.ts`; `src/app/admin/esqueci-senha/actions.test.ts` (5 testes) | implementado e comprovado | Sim | — |
| Upload e gerenciamento de imagens | Validação por magic bytes, limite de 5 MB, SVG rejeitado | `src/server/images.ts` | implementado e comprovado | Sim | sem detalhar assinatura de bytes |
| Experiência responsiva desktop/mobile | Testes de overflow, alinhamento de cards e menu por viewport | `e2e/responsive-public.spec.ts` (8 testes); `e2e/responsive-admin.spec.ts` (7 testes) | implementado e comprovado | Sim | suíte versionada; não executada nesta revisão |
| SEO local | `generateMetadata`, Open Graph, Twitter Card, canonical, JSON-LD, sitemap, robots | `src/app/(public)/page.tsx`; `src/app/(public)/produto/[slug]/page.tsx`; `src/app/(public)/categoria/[slug]/page.tsx`; `src/app/sitemap.ts`; `src/app/robots.ts` | implementado e comprovado | Sim | — |
| Testes unitários | Vitest, 164 testes em 18 arquivos | execução local em 2026-08-17 | implementado e comprovado | Sim | citar contagem e data, não "cobertura completa" |
| Testes end-to-end | Playwright, 54 testes em 7 arquivos, versionados | `e2e/*.spec.ts` | implementado e comprovado (existência); execução não verificada nesta revisão | Condicional | dizer que a suíte existe, nunca que passou "agora" |
| Design system próprio | Tokens de marca e semânticos, componentes de UI reutilizados | `src/app/globals.css`; `src/components/ui/` | implementado e comprovado | Sim | — |
| Confirmação em ações destrutivas | Modal `role="alertdialog"` obrigatório antes de excluir | `src/app/admin/produtos/DeleteProductButton.tsx`; `src/app/admin/categorias/DeleteCategoryButton.tsx` | implementado e comprovado | Sim | — |
| Next.js App Router | Estrutura de rotas em `src/app` | `src/app/**` | implementado e comprovado | Sim | sem citar número de versão |
| React | Componentes de cliente e servidor | todo `src/` | implementado e comprovado | Sim | sem citar número de versão |
| TypeScript estrito | `strict: true` no `tsconfig.json` | `tsconfig.json`; `PROJECT_RULES.md §2` | implementado e comprovado | Sim | sem citar número de versão |
| Tailwind CSS | Utilitários + tokens customizados | `src/app/globals.css`; classes em todo `src/` | implementado e comprovado | Sim | sem citar número de versão |
| Prisma + PostgreSQL | Schema com 6 modelos, 2 migrations aplicadas | `prisma/schema.prisma`; `prisma/migrations/` | implementado e comprovado | Sim | capacidade complementar, não foco do case |
| Vitest | Configuração e suíte de testes | `vitest.config.ts` | implementado e comprovado | Sim | — |
| Playwright | Configuração e suíte E2E | `playwright.config.ts` | implementado e comprovado (existência) | Sim | ver ressalva de execução acima |
| Cloudinary | Upload de imagens de produto e foto da proprietária | `src/server/images.ts` | implementado e comprovado | Sim | capacidade complementar |
| Integração com WhatsApp | Link `wa.me` com mensagem codificada | `src/lib/whatsapp.ts` | implementado e comprovado | Sim | — |
| Core Web Vitals dentro da meta (LCP/CLS) | Meta escrita, sem medição registrada | `PROJECT_RULES.md §4` | planejado | **Não** como resultado | apresentar só como objetivo, se citado |
| Lighthouse ≥ 85 performance / ≥ 90 acessibilidade | Meta escrita, sem medição registrada | `PROJECT_RULES.md §7` | planejado | **Não** como resultado | apresentar só como objetivo, se citado |
| Cobertura de testes (percentual) | Nenhum relatório de cobertura gerado nesta revisão | — | não encontrado | **Não** | não inventar percentual |
| Uso em produção pela cliente | Script de deploy existe; uso real não verificável por este agente | `deploy-to-vps.sh` | exige confirmação do usuário | Condicional | ver `PLANO-SCREENSHOTS.md`/riscos no plano aprovado |
| Volume de pedidos, vendas, conversão, acessos | Nenhum dado de analytics ou negócio no repositório | — | não encontrado | **Não** | proibido pelo escopo do case |
| Depoimento ou autorização formal da cliente | Não presente no repositório | — | exige confirmação do usuário | **Não**, sem confirmação | não usar sem autorização explícita |
| Fotos dos produtos (23 arquivos) autorizadas para uso público | Presentes em `src/assets/images/Categorias`; autoria não registrada no repositório | `src/assets/images/` | exige confirmação do usuário | Condicional | ver `PLANO-SCREENSHOTS.md` |
