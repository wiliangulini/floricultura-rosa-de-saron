import { expect, test } from "@playwright/test";

const AUTH_STATE_PATH = "e2e/.auth/e2e-admin.json";

// Cenários 8.2, 8.3, 8.4 — não-regressão do painel admin
test.use({ storageState: AUTH_STATE_PATH });

test.describe("Painel administrativo — não-regressão", () => {
  test("Painel /admin carrega com estatísticas de produtos", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Painel administrativo" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Produtos cadastrados" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Produtos ativos" })).toBeVisible();
  });

  test("8.2 — /admin/produtos carrega a listagem de produtos", async ({ page }) => {
    await page.goto("/admin/produtos");
    await expect(page.getByRole("heading", { name: "Gerenciar produtos" })).toBeVisible();
    await expect(page.getByRole("table").getByText("Produto de Teste E2E")).toBeVisible();
  });

  test("8.3 — /admin/categorias carrega a listagem de categorias", async ({ page }) => {
    await page.goto("/admin/categorias");
    await expect(page.getByRole("heading", { name: "Gerenciar categorias" })).toBeVisible();
    await expect(page.getByRole("table").getByText("Categoria de Teste E2E")).toBeVisible();
  });

  test("8.4 — /admin/configuracoes carrega o formulário de configurações", async ({ page }) => {
    await page.goto("/admin/configuracoes");
    await expect(page.getByRole("heading", { name: "Configurações" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Salvar configurações" })).toBeVisible();
  });

  test("/admin/perfil carrega sem erro", async ({ page }) => {
    await page.goto("/admin/perfil");
    await expect(page.getByRole("heading", { name: "Alterar senha" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Dados da proprietária" })).toBeVisible();
  });
});
