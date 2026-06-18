import { expect, test } from "@playwright/test";

import { AUTH_STATE_PATH, E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD } from "./constants";

async function loginAsE2EAdmin(page: import("@playwright/test").Page) {
  await page.goto("/admin/login");
  await page.getByLabel("E-mail").fill(E2E_ADMIN_EMAIL);
  await page.getByLabel("Senha").fill(E2E_ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL("**/admin");
}

// Cenários 1.1, 1.3, 1.4, 1.5a/b — sem sessão (contexto limpo)
test.describe("Proteção de rotas — sem sessão", () => {
  test("1.1 — /admin/perfil sem sessão redireciona para /admin/login", async ({ page }) => {
    await page.goto("/admin/perfil");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("1.3 — /admin sem sessão redireciona para /admin/login", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);

    await context.close();
  });

  test("1.4 — /api/admin/teste sem sessão retorna 401", async ({ request }) => {
    const response = await request.get("/api/admin/teste");

    expect(response.status()).toBe(401);

    const body = await response.json();

    expect(body).toHaveProperty("message");
  });

  test("1.5a — /admin/esqueci-senha abre sem sessão", async ({ page }) => {
    await page.goto("/admin/esqueci-senha");
    await expect(page).toHaveURL(/\/admin\/esqueci-senha/);
    await expect(page.getByLabel("E-mail")).toBeVisible();
  });

  test("1.5b — /admin/redefinir-senha abre sem sessão mostrando link inválido", async ({
    page,
  }) => {
    await page.goto("/admin/redefinir-senha");
    await expect(page).toHaveURL(/\/admin\/redefinir-senha/);
    await expect(page.getByRole("heading", { name: "Link inválido ou expirado" })).toBeVisible();
  });
});

// Cenário 2.3 — login com credenciais válidas
test.describe("Login", () => {
  test("2.3 — credenciais E2E válidas fazem login e redirecionam para /admin", async ({
    browser,
  }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await loginAsE2EAdmin(page);
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole("heading", { name: "Painel administrativo" })).toBeVisible();

    await context.close();
  });

  test("Login inválido exibe mensagem de erro", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("E-mail").fill("errado@example.com");
    await page.getByLabel("Senha").fill("senhaerrada");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

// Cenários 1.2 e 8.1 — com sessão
test.describe("Sessão autenticada", () => {
  test.use({ storageState: AUTH_STATE_PATH });

  test("1.2 — /admin/perfil com sessão válida carrega a página", async ({ page }) => {
    await page.goto("/admin/perfil");
    await expect(page).toHaveURL(/\/admin\/perfil/);
    await expect(page.getByRole("heading", { name: "Alterar senha" })).toBeVisible();
  });

  test("8.1 — logout encerra sessão e bloqueia acesso a /admin", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Painel administrativo" })).toBeVisible();

    await page.getByRole("button", { name: "Sair da conta" }).click();
    await page.waitForURL(/\/admin\/login/);

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
