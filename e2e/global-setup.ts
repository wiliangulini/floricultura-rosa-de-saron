import "dotenv/config";
import { execSync } from "child_process";
import { dirname } from "path";
import { mkdirSync } from "fs";

import { chromium } from "@playwright/test";

import { AUTH_STATE_PATH, BASE_URL, E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD } from "./constants";

export default async function globalSetup() {
  mkdirSync(dirname(AUTH_STATE_PATH), { recursive: true });

  execSync("npm run db:seed:e2e", { stdio: "inherit" });

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
