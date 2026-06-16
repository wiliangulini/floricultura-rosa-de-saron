import { expect, test } from "@playwright/test";

const GENERIC_SUCCESS_MESSAGE =
  "Se o e-mail informado pertencer a uma administradora ativa, enviaremos as instruções de redefinição.";

// Cenários 2.1 e 2.2 — link na tela de login
test.describe("Link de recuperação na tela de login", () => {
  test("2.1 — link 'Esqueceu sua senha?' está visível na tela de login", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByRole("link", { name: "Esqueceu sua senha?" })).toBeVisible();
  });

  test("2.2 — clicar em 'Esqueceu sua senha?' navega para /admin/esqueci-senha", async ({
    page,
  }) => {
    await page.goto("/admin/login");
    await page.getByRole("link", { name: "Esqueceu sua senha?" }).click();
    await expect(page).toHaveURL(/\/admin\/esqueci-senha/);
    await expect(page.getByLabel("E-mail")).toBeVisible();
  });
});

// Cenários 3.1–3.4 — formulário de solicitação de reset
test.describe("Formulário de recuperação de senha", () => {
  test("3.1 — /admin/esqueci-senha carrega com campo de e-mail e botão de envio", async ({
    page,
  }) => {
    await page.goto("/admin/esqueci-senha");
    await expect(page.getByLabel("E-mail")).toBeVisible();
    await expect(page.getByRole("button", { name: "Enviar instruções" })).toBeVisible();
  });

  test("3.2 — e-mail com formato inválido exibe validação de campo", async ({ page }) => {
    await page.goto("/admin/esqueci-senha");
    await page.getByLabel("E-mail").fill("email-invalido");
    await page.getByRole("button", { name: "Enviar instruções" }).click();

    // O campo de erro ou a mensagem de alerta deve aparecer
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page.getByText("Informe um e-mail válido.")).toBeVisible();
  });

  test("3.3 — e-mail inexistente retorna mensagem genérica sem revelar existência", async ({
    page,
  }) => {
    await page.goto("/admin/esqueci-senha");
    await page.getByLabel("E-mail").fill("naoexiste@example.com");
    await page.getByRole("button", { name: "Enviar instruções" }).click();

    await expect(page.getByRole("status")).toBeVisible();
    await expect(page.getByText(GENERIC_SUCCESS_MESSAGE)).toBeVisible();
    // Token ou link não deve aparecer na tela
    await expect(page.getByText(/token=/i)).not.toBeVisible();
  });

  test("3.4 — e-mail de usuário inativo retorna a mesma mensagem genérica", async ({ page }) => {
    await page.goto("/admin/esqueci-senha");
    await page.getByLabel("E-mail").fill("inativo-e2e@floricultura.com");
    await page.getByRole("button", { name: "Enviar instruções" }).click();

    await expect(page.getByRole("status")).toBeVisible();
    await expect(page.getByText(GENERIC_SUCCESS_MESSAGE)).toBeVisible();
  });
});

// Cenários 4.1 e 4.2 — token inválido na tela de redefinição
test.describe("Tela de redefinição de senha — token inválido", () => {
  test("4.1 — /admin/redefinir-senha sem token exibe 'Link inválido ou expirado'", async ({
    page,
  }) => {
    await page.goto("/admin/redefinir-senha");
    await expect(page).toHaveURL(/\/admin\/redefinir-senha/);
    await expect(page.getByRole("heading", { name: "Link inválido ou expirado" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Solicitar novo link" })).toBeVisible();
    // Formulário de nova senha NÃO deve estar visível
    await expect(page.getByLabel("Nova senha")).not.toBeVisible();
  });

  test("4.2 — /admin/redefinir-senha com token inválido exibe 'Link inválido ou expirado'", async ({
    page,
  }) => {
    await page.goto("/admin/redefinir-senha?token=token-invalido-abc123");
    await expect(page.getByRole("heading", { name: "Link inválido ou expirado" })).toBeVisible();
    await expect(page.getByLabel("Nova senha")).not.toBeVisible();
  });
});
