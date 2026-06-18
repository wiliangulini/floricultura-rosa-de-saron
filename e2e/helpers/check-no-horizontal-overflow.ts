import type { Page } from "@playwright/test";

export async function checkNoHorizontalOverflow(page: Page): Promise<boolean> {
  return page.evaluate(() => document.body.scrollWidth > window.innerWidth);
}
