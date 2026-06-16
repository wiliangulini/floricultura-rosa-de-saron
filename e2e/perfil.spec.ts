import { expect, test } from "@playwright/test";

const AUTH_STATE_PATH = "e2e/.auth/e2e-admin.json";

// Todos os testes desta suite exigem sessão autenticada
test.use({ storageState: AUTH_STATE_PATH });

// Cenários 5.1–5.4 — navegação e conteúdo da página de perfil
test.describe("Menu e página de perfil", () => {
  test("5.1 — sidebar exibe o link 'Perfil'", async ({ page }) => {
    await page.goto("/admin");
    const nav = page.getByRole("navigation", { name: "Navegação administrativa" });

    await expect(nav.getByRole("link", { name: "Perfil" })).toBeVisible();
  });

  test("5.2 — clicar em 'Perfil' navega para /admin/perfil", async ({ page }) => {
    await page.goto("/admin");
    const nav = page.getByRole("navigation", { name: "Navegação administrativa" });

    await nav.getByRole("link", { name: "Perfil" }).click();
    await expect(page).toHaveURL(/\/admin\/perfil/);
  });

  test("5.3 — página de perfil exibe seção 'Alterar senha' com campos e botão", async ({
    page,
  }) => {
    await page.goto("/admin/perfil");
    await expect(page.getByRole("heading", { name: "Alterar senha" })).toBeVisible();
    await expect(page.getByLabel("Senha atual")).toBeVisible();
    await expect(page.getByLabel("Nova senha", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Confirmar nova senha")).toBeVisible();
    await expect(page.getByRole("button", { name: "Salvar nova senha" })).toBeVisible();
    await expect(page.getByLabel("Senha atual")).toHaveValue("");
    await expect(page.getByLabel("Nova senha", { exact: true })).toHaveValue("");
    await expect(page.getByLabel("Confirmar nova senha")).toHaveValue("");
  });

  test("5.4 — página de perfil exibe seção 'Dados da proprietária' com campos e botão", async ({
    page,
  }) => {
    await page.goto("/admin/perfil");
    await expect(page.getByRole("heading", { name: "Dados da proprietária" })).toBeVisible();
    await expect(page.getByLabel("Nome da proprietária")).toBeVisible();
    await expect(page.getByLabel("Descrição")).toBeVisible();
    await expect(page.getByRole("button", { name: "Salvar dados" })).toBeVisible();
  });
});

// Cenários 6.1–6.4 — erros na troca de senha
test.describe("Troca de senha — cenários de erro", () => {
  test("6.1 — senha atual incorreta é recusada", async ({ page }) => {
    await page.goto("/admin/perfil");
    await page.getByLabel("Senha atual").fill("senha-incorreta-xyz-999");
    await page.getByLabel("Nova senha", { exact: true }).fill("NovaSenha@123");
    await page.getByLabel("Confirmar nova senha").fill("NovaSenha@123");
    await page.getByRole("button", { name: "Salvar nova senha" }).click();

    await expect(page.getByText("Senha atual incorreta.")).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/perfil/);
  });

  test("6.2 — nova senha vazia é recusada", async ({ page }) => {
    await page.goto("/admin/perfil");
    await page.getByLabel("Senha atual").fill("SenhaTestE2E@123!");
    await page.getByRole("button", { name: "Salvar nova senha" }).click();

    await expect(page.getByText("Informe a nova senha.")).toBeVisible();
  });

  test("6.3 — nova senha com menos de 8 caracteres é recusada", async ({ page }) => {
    await page.goto("/admin/perfil");
    await page.getByLabel("Senha atual").fill("SenhaTestE2E@123!");
    await page.getByLabel("Nova senha", { exact: true }).fill("abc123");
    await page.getByLabel("Confirmar nova senha").fill("abc123");
    await page.getByRole("button", { name: "Salvar nova senha" }).click();

    await expect(page.getByText("A nova senha deve ter pelo menos 8 caracteres.")).toBeVisible();
  });

  test("6.4 — confirmação diferente da nova senha é recusada", async ({ page }) => {
    await page.goto("/admin/perfil");
    await page.getByLabel("Senha atual").fill("SenhaTestE2E@123!");
    await page.getByLabel("Nova senha", { exact: true }).fill("NovaSenha@123");
    await page.getByLabel("Confirmar nova senha").fill("SenhaErrada@456");
    await page.getByRole("button", { name: "Salvar nova senha" }).click();

    await expect(page.getByText("A confirmação precisa ser igual à nova senha.")).toBeVisible();
  });
});

// Cenário 6.5 — troca de senha válida (executa por último; globalSetup restaura na próxima execução)
test.describe("Troca de senha — cenário de sucesso", () => {
  test("6.5 — troca válida salva a nova senha e limpa os campos", async ({ page }) => {
    await page.goto("/admin/perfil");
    await page.getByLabel("Senha atual").fill("SenhaTestE2E@123!");
    await page.getByLabel("Nova senha", { exact: true }).fill("NovaSenhaE2E@999!");
    await page.getByLabel("Confirmar nova senha").fill("NovaSenhaE2E@999!");
    await page.getByRole("button", { name: "Salvar nova senha" }).click();

    await expect(page.getByText("Senha alterada com sucesso.")).toBeVisible();
    await expect(page.getByLabel("Senha atual")).toHaveValue("");
    await expect(page.getByLabel("Nova senha", { exact: true })).toHaveValue("");
    await expect(page.getByLabel("Confirmar nova senha")).toHaveValue("");
  });
});

// Cenários 7.1, 7.2, 7.4 — dados da proprietária
test.describe("Dados da proprietária", () => {
  test("7.1 — salvar nome e descrição exibe mensagem de sucesso", async ({ page }) => {
    await page.goto("/admin/perfil");
    await page.getByLabel("Nome da proprietária").fill("Proprietária Teste E2E");
    await page.getByLabel("Descrição").fill("Descrição de teste para E2E automatizado.");
    await page.getByRole("button", { name: "Salvar dados" }).click();

    await expect(page.getByText("Dados da proprietária salvos com sucesso.")).toBeVisible();
  });

  test("7.2 — dados salvos persistem após recarregar a página", async ({ page }) => {
    const testName = "Nome Persistido E2E";
    const testDescription = "Descrição persistida E2E.";

    await page.goto("/admin/perfil");
    await page.getByLabel("Nome da proprietária").fill(testName);
    await page.getByLabel("Descrição").fill(testDescription);
    await page.getByRole("button", { name: "Salvar dados" }).click();

    await expect(page.getByText("Dados da proprietária salvos com sucesso.")).toBeVisible();

    await page.reload();
    await expect(page.getByLabel("Nome da proprietária")).toHaveValue(testName);
    await expect(page.getByLabel("Descrição")).toHaveValue(testDescription);
  });

  test("7.4 — campo de foto tem atributo accept restritivo (sem SVG)", async ({ page }) => {
    await page.goto("/admin/perfil");

    const fileInput = page.getByLabel("Foto da proprietária");

    await expect(fileInput).toBeVisible();
    await expect(fileInput).toHaveAttribute("accept", "image/jpeg,image/png,image/webp");
  });
});
