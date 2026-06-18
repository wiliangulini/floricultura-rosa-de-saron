import { expect, test, type Locator, type Page } from "@playwright/test";

import { checkNoHorizontalOverflow } from "./helpers/check-no-horizontal-overflow";

const publicRoutes = [
  { path: "/", name: "Home" },
  { path: "/produtos", name: "Catálogo" },
  { path: "/produto/produto-de-teste-e2e", name: "Produto" },
  { path: "/categoria/categoria-de-teste-e2e", name: "Categoria" },
  { path: "/sobre", name: "Sobre" },
  { path: "/contato", name: "Contato" },
];

const productCardRoutes = [
  { path: "/", name: "Home" },
  { path: "/produtos", name: "Catálogo" },
];

const mobileCardViewports = [
  { height: 832, width: 320 },
  { height: 832, width: 375 },
  { height: 832, width: 425 },
];

type ElementBox = {
  height: number;
  width: number;
  x: number;
  y: number;
};

async function getProductList(page: Page): Promise<Locator> {
  const productList = page
    .locator("main ul")
    .filter({ has: page.getByRole("link", { name: /ver detalhes/i }) })
    .first();

  await expect(productList).toBeVisible();
  return productList;
}

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

test.describe("Cards de produtos — responsividade mobile", () => {
  for (const route of productCardRoutes) {
    for (const viewport of mobileCardViewports) {
      test(`${route.name}: cards centralizados e consistentes em ${viewport.width}px`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);
        await page.goto(route.path);

        expect(await checkNoHorizontalOverflow(page)).toBe(false);

        const productList = await getProductList(page);
        const listBox = await productList.boundingBox();
        expect(listBox).not.toBeNull();

        const cards = productList.locator("article");
        const cardCount = await cards.count();
        expect(cardCount).toBeGreaterThan(0);

        const cardBoxes: ElementBox[] = [];
        const viewportWidth = page.viewportSize()!.width;

        for (let index = 0; index < cardCount; index += 1) {
          const card = cards.nth(index);
          await expect(card).toBeVisible();

          const cardBox = await card.boundingBox();
          expect(cardBox).not.toBeNull();
          cardBoxes.push(cardBox!);

          expect(cardBox!.x).toBeGreaterThanOrEqual(0);
          expect(cardBox!.x + cardBox!.width).toBeLessThanOrEqual(viewportWidth + 1);

          const leftGap = cardBox!.x - listBox!.x;
          const rightGap = listBox!.x + listBox!.width - (cardBox!.x + cardBox!.width);
          expect(Math.abs(leftGap - rightGap)).toBeLessThanOrEqual(1);
        }

        const firstCardWidth = cardBoxes[0].width;
        for (const cardBox of cardBoxes) {
          expect(Math.abs(cardBox.width - firstCardWidth)).toBeLessThanOrEqual(1);
        }

        const verticalGaps = cardBoxes
          .slice(1)
          .map((cardBox, index) => cardBox.y - (cardBoxes[index].y + cardBoxes[index].height));

        if (verticalGaps.length > 1) {
          const firstGap = verticalGaps[0];
          for (const gap of verticalGaps) {
            expect(Math.abs(gap - firstGap)).toBeLessThanOrEqual(1);
          }
        }
      });
    }
  }
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
