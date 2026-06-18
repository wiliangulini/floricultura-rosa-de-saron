import { expect, test } from "@playwright/test";

import { AUTH_STATE_PATH } from "./constants";
import { checkNoHorizontalOverflow } from "./helpers/check-no-horizontal-overflow";

test.use({ storageState: AUTH_STATE_PATH });

const adminRoutes = [
  "/admin",
  "/admin/produtos",
  "/admin/categorias",
  "/admin/configuracoes",
  "/admin/perfil",
];

test.describe("Responsividade — área administrativa", () => {
  for (const route of adminRoutes) {
    test(`${route}: sem scroll horizontal`, async ({ page }) => {
      await page.goto(route);
      expect(await checkNoHorizontalOverflow(page)).toBe(false);
    });
  }
});

test.describe("Sidebar admin — comportamento mobile/desktop", () => {
  test("Hambúrguer visível em mobile, oculto em desktop", async ({ page }) => {
    await page.goto("/admin");
    const viewportWidth = page.viewportSize()!.width;
    const hamburger = page.getByRole("button", { name: /abrir menu de navegação/i });

    if (viewportWidth >= 768) {
      await expect(hamburger).toBeHidden();
      await expect(page.getByRole("complementary")).toBeVisible();
    } else {
      await expect(hamburger).toBeVisible();
    }
  });

  test("Sidebar abre ao clicar no hambúrguer (mobile)", async ({ page }) => {
    await page.goto("/admin");
    if (page.viewportSize()!.width >= 768) return;

    await page.getByRole("button", { name: /abrir menu de navegação/i }).click();
    await expect(page.getByRole("complementary")).toBeInViewport();
  });

  test("Backdrop fecha a sidebar (mobile)", async ({ page }) => {
    await page.goto("/admin");
    if (page.viewportSize()!.width >= 768) return;

    await page.getByRole("button", { name: /abrir menu de navegação/i }).click();
    await page.locator("[aria-hidden='true'].fixed.inset-0").click();
    await expect(page.getByRole("complementary")).not.toBeInViewport();
  });

  test("Sidebar fecha ao navegar para outra rota (mobile)", async ({ page }) => {
    await page.goto("/admin");
    if (page.viewportSize()!.width >= 768) return;

    await page.getByRole("button", { name: /abrir menu de navegação/i }).click();
    await page.getByRole("complementary").getByRole("link").first().click();
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("complementary")).not.toBeInViewport();
  });
});

test.describe("Tabela de produtos — responsividade", () => {
  test("Tabela visível em tablet/desktop sem overflow", async ({ page }) => {
    await page.goto("/admin/produtos");
    if (page.viewportSize()!.width < 768) return;

    await expect(page.locator("table")).toBeVisible();
    const hasOverflow = await page.evaluate(() => {
      const table = document.querySelector("table");
      return table ? table.scrollWidth > table.clientWidth : false;
    });
    expect(hasOverflow).toBe(false);
  });

  test("Cards visíveis em mobile, tabela oculta", async ({ page }) => {
    await page.goto("/admin/produtos");
    if (page.viewportSize()!.width >= 768) return;

    await expect(page.locator("table")).toBeHidden();
    await expect(page.getByRole("list").locator("li").first()).toBeVisible();
  });
});
