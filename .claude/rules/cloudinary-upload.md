---
paths:
  - "src/server/images.ts"
  - "src/app/admin/produtos/**/*"
  - "src/components/admin/**/*"
---

# Regra Claude — Upload Cloudinary

Derivada de `PROJECT_RULES.md §6`. Se esta rule divergir da regra do projeto, atualize
`PROJECT_RULES.md` primeiro. Procedimento, validação e formato de relatório vivem no
protocolo comum (`AGENTS.md`, `PROJECT_RULES.md §12`).

## Invariantes

- Upload via Cloudinary (`src/server/images.ts`); não introduza outro provedor sem
  autorização.
- Aceitar somente JPEG, PNG e WebP; limite de 5 MB por arquivo.
- Validar o tipo do arquivo no servidor por magic bytes, não apenas pela extensão.
  SVG é explicitamente rejeitado.
- Nome público no Cloudinary é gerado a partir do nome do produto + timestamp; não
  preservar o nome original do arquivo enviado.
- Credenciais (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`)
  só via variável de ambiente; nunca hard-coded nem logadas.
