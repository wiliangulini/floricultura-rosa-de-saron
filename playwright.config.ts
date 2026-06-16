import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./e2e/test-results",
  // Execução serial para evitar conflitos de estado no banco compartilhado
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "html",
  globalSetup: "./e2e/global-setup.ts",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  // Usa tsconfig específico para E2E (module: CommonJS) para compatibilidade com Node.js 22
  // O tsconfig principal usa moduleResolution: "bundler" que causa erros no runner de testes
  tsconfig: "./tsconfig.e2e.json",
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // O app deve estar rodando antes dos testes (npm run dev em outro terminal)
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
