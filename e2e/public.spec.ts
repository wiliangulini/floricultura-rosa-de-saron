import { expect, test } from "@playwright/test";

// Cenário 8.5 — páginas públicas principais carregam sem exigir login
test.describe("Páginas públicas — não-regressão", () => {
  test("8.5a — home / carrega com h1 visível", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("http://localhost:3000/");

    const heading = page.getByRole("heading", { level: 1 });

    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/floricultura em/i);
  });

  test("8.5b — /produtos carrega com heading do catálogo", async ({ page }) => {
    await page.goto("/produtos");
    await expect(page.getByRole("heading", { name: "Produtos da floricultura" })).toBeVisible();
  });

  test("8.5c — /categoria/categoria-de-teste-e2e carrega sem erro", async ({ page }) => {
    await page.goto("/categoria/categoria-de-teste-e2e");
    // A página não deve redirecionar nem retornar 404/500
    await expect(page).toHaveURL(/\/categoria\/categoria-de-teste-e2e/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("8.5d — /produto/produto-de-teste-e2e carrega com nome do produto", async ({ page }) => {
    await page.goto("/produto/produto-de-teste-e2e");
    await expect(page.getByRole("heading", { name: "Produto de Teste E2E" })).toBeVisible();
  });

  test("8.5e — /carrinho carrega sem exigir login", async ({ page }) => {
    await page.goto("/carrinho");
    await expect(page.getByRole("heading", { name: "Meu pedido" })).toBeVisible();
  });
});
