import { expect, test } from "@playwright/test";

import { checkNoHorizontalOverflow } from "./helpers/check-no-horizontal-overflow";

const publicRoutes = [
  { path: "/", name: "Home" },
  { path: "/produtos", name: "Catálogo" },
  { path: "/produto/produto-de-teste-e2e", name: "Produto" },
  { path: "/categoria/categoria-de-teste-e2e", name: "Categoria" },
  { path: "/sobre", name: "Sobre" },
  { path: "/contato", name: "Contato" },
];

test.describe("Responsividade — páginas públicas", () => {
  for (const route of publicRoutes) {
    test(`${route.name}: sem scroll horizontal`, async ({ page }) => {
      await page.goto(route.path);
      expect(await checkNoHorizontalOverflow(page)).toBe(false);
    });
  }

  test("H1 da home visível e dentro do viewport", async ({ page }) => {
    await page.goto("/");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    const box = await h1.boundingBox();
    const viewportWidth = page.viewportSize()!.width;
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test("WhatsApp button visível e dentro do viewport", async ({ page }) => {
    await page.goto("/");
    const waButton = page.getByRole("link", { name: /whatsapp/i }).last();
    await expect(waButton).toBeVisible();
    const box = await waButton.boundingBox();
    const viewport = page.viewportSize()!;
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 1);
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height + 1);
  });
});

test.describe("Menu público — comportamento mobile/desktop", () => {
  test("Menu hambúrguer visível em mobile, nav desktop oculta", async ({ page }) => {
    await page.goto("/");
    const viewportWidth = page.viewportSize()!.width;

    if (viewportWidth >= 1024) {
      await expect(page.getByRole("navigation", { name: "Navegação principal" }).first()).toBeVisible();
      await expect(page.getByRole("button", { name: /abrir menu/i })).toBeHidden();
      return;
    }

    await expect(page.getByRole("button", { name: /abrir menu de navegação/i })).toBeVisible();
    await expect(page.locator("#main-nav")).toBeHidden();
  });

  test("Menu abre ao clicar no hambúrguer", async ({ page }) => {
    await page.goto("/");
    if (page.viewportSize()!.width >= 1024) return;

    await page.getByRole("button", { name: /abrir menu de navegação/i }).click();
    await expect(page.locator("#main-nav")).toBeVisible();
  });

  test("Menu fecha com Escape e retorna foco ao botão", async ({ page }) => {
    await page.goto("/");
    if (page.viewportSize()!.width >= 1024) return;

    await page.getByRole("button", { name: /abrir menu de navegação/i }).click();
    await page.keyboard.press("Escape");
    await expect(page.locator("#main-nav")).toBeHidden();
    await expect(page.getByRole("button", { name: /abrir menu de navegação/i })).toBeFocused();
  });

  test("Menu fecha ao clicar em link de navegação", async ({ page }) => {
    await page.goto("/");
    if (page.viewportSize()!.width >= 1024) return;

    await page.getByRole("button", { name: /abrir menu de navegação/i }).click();
    await page.locator("#main-nav").getByRole("link").first().click();
    await page.waitForLoadState("networkidle");

    const hamburger = page.getByRole("button", { name: /abrir menu de navegação/i });
    if (await hamburger.isVisible()) {
      await expect(page.locator("#main-nav")).toBeHidden();
    }
  });
});
