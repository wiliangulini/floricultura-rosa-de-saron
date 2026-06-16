import { execSync } from "child_process";

import { chromium } from "@playwright/test";

// Constantes definidas inline para evitar problemas de resolução de módulo
// no contexto do globalSetup (executado como Node.js puro, fora do transformer do Playwright)
const E2E_ADMIN_EMAIL = "e2e-test@floricultura.com";
const E2E_ADMIN_PASSWORD = "SenhaTestE2E@123!";
const AUTH_STATE_PATH = "e2e/.auth/e2e-admin.json";
const BASE_URL = "http://localhost:3000";

export default async function globalSetup() {
  // Reseta a senha do usuário E2E e garante os dados de teste no banco
  execSync("npm run db:seed:e2e", { stdio: "inherit" });

  // Realiza login e salva o estado de autenticação para reuso nos testes
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/admin/login`);
  await page.getByLabel("E-mail").fill(E2E_ADMIN_EMAIL);
  await page.getByLabel("Senha").fill(E2E_ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL(`${BASE_URL}/admin`);

  await context.storageState({ path: AUTH_STATE_PATH });
  await browser.close();
}
