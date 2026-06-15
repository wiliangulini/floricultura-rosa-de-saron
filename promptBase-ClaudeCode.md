Leia obrigatoriamente:

* @PROJECT_RULES.md
* o plano da Etapa 28 - @etapa28.md
* os arquivos alterados pela última meta executada pelo Codex
* package.json
* prisma/schema.prisma, se a meta alterou banco
* arquivos de autenticação, sessão, admin, upload ou email relacionados à meta

Você está revisando uma implementação feita pelo Codex.

Não implemente funcionalidades novas.
Não antecipe metas futuras.
Não mude o escopo da etapa.
Não refatore por preferência pessoal.
Corrija apenas problemas reais de segurança, tipagem, arquitetura, UX, validação ou build.

Meta revisada:

META 4
Meta 4 concluída. Não avancei para a Meta 5.

Criados/alterados:
- [src/app/admin/perfil/actions.ts](/home/mr-robot/Documents/projetos/floricultura-rosa-de-saron/src/app/admin/perfil/actions.ts)
- [src/app/admin/perfil/PasswordChangeForm.tsx](/home/mr-robot/Documents/projetos/floricultura-rosa-de-saron/src/app/admin/perfil/PasswordChangeForm.tsx)
- [src/app/admin/perfil/page.tsx](/home/mr-robot/Documents/projetos/floricultura-rosa-de-saron/src/app/admin/perfil/page.tsx)

O que foi feito:
- Criada a Server Action `changePassword`.
- A action lê a sessão autenticada, usa `session.userId`, busca o `User`, exige `active=true` e `role=ADMIN`.
- Valida senha atual, nova senha mínima de 8 caracteres, confirmação e bloqueio de senha igual à atual.
- Compara a senha atual com `bcrypt.compare()`.
- Salva a nova senha com `bcrypt.hash(newPassword, 12)`.
- Mantém a sessão ativa após sucesso, sem logout automático.
- O formulário limpa os campos após sucesso com `formRef.current?.reset()`.

Validações executadas:
- `npm run lint`: passou.
- `npm run typecheck`: passou.

Não implementei dados/foto da proprietária, upload, settings, reset por email ou qualquer fluxo da Meta 5+.

Uso registrado do goal: 77.559 tokens, aproximadamente 3min33s.

Objetivo da revisão:

1. Verificar se a implementação cumpriu exatamente a meta.
2. Verificar se não quebrou funcionalidades existentes.
3. Verificar aderência ao PROJECT_RULES.md.
4. Verificar segurança, especialmente se envolver senha, sessão, token, upload ou email.
5. Verificar se o código está limpo, tipado e consistente com o padrão atual do projeto.
6. Corrigir somente problemas necessários.

Checklist obrigatório:

* Não expor passwordHash.
* Não salvar senha em texto puro.
* Não revelar se email existe no fluxo de recuperação.
* Não expor token de reset.
* Não aceitar SVG em upload.
* Não quebrar login.
* Não quebrar logout.
* Não quebrar proteção de /admin.
* Não quebrar CRUD de produtos.
* Não quebrar CRUD de categorias.
* Não quebrar configurações.
* Não criar features fora do escopo.
* Não instalar bibliotecas desnecessárias.
* Não criar Docker.
* Manter TypeScript, Tailwind CSS e App Router corretamente.

Se a meta envolver Prisma:

* Validar se a migration é segura.
* Não apagar dados existentes.
* Não alterar models não relacionados.
* Confirmar campos nullable quando adequado.
* Rodar ou indicar npx prisma validate.

Se a meta envolver senha:

* Confirmar uso de bcryptjs.compare().
* Confirmar uso de bcryptjs.hash(..., 12) ou padrão já usado no projeto.
* Confirmar validação de senha mínima.
* Confirmar que passwordHash não é retornado, logado ou exposto.

Se a meta envolver reset de senha:

* Confirmar token seguro com crypto.randomBytes.
* Confirmar que só hash do token é salvo no banco.
* Confirmar expiração.
* Confirmar uso único.
* Confirmar mensagem genérica para email inexistente.
* Confirmar que token/link não é logado em produção.

Se a meta envolver upload:

* Confirmar validação server-side.
* Confirmar bloqueio de SVG.
* Confirmar limite de tamanho.
* Confirmar reaproveitamento da infraestrutura existente.
* Confirmar que não duplicou lógica desnecessária.

Ao final, rode quando aplicável:

```bash
npx prisma validate
npm run lint
npm run typecheck
npm test
npm run build
```

Se algum comando não existir ou não puder ser executado, explique claramente.

Entregue no final:

1. Resumo da revisão.
2. Problemas encontrados.
3. Correções feitas.
4. Arquivos alterados.
5. Comandos executados e resultados.
6. Riscos ou pendências restantes.
7. Confirmação se a próxima meta pode ser executada.
