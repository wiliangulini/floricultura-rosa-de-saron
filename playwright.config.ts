import "dotenv/config";

import { defineConfig, devices } from "@playwright/test";

import { getE2EDatabaseUrl } from "./prisma/seed-utils";

const databaseUrlE2E = getE2EDatabaseUrl();

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./e2e/test-results",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "html",
  globalSetup: "./e2e/global-setup.ts",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  tsconfig: "./tsconfig.e2e.json",
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    // reuseExistingServer: false garante que o servidor sobe com DATABASE_URL correto.
    // Falha por porta ocupada é preferível a rodar contra o banco errado.
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      DATABASE_URL: databaseUrlE2E,
      DATABASE_URL_E2E: databaseUrlE2E,
    },
  },
});
