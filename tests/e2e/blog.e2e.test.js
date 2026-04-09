import { test, expect } from "@playwright/test";

test("bloggsidan laddar och visar inlägg", async ({ page }) => {
await page.goto('/src/blog.html');
  await expect(page.locator("#posts")).toBeVisible();

  await expect(page.locator(".post").first()).toBeVisible();
  await expect(page.locator(".post-title").first()).toBeVisible();
});

test("kategorier visas och går att klicka på", async ({ page }) => {
await page.goto('/src/blog.html');
  await expect(page.locator("#category-list")).toBeVisible();

  const buttons = page.locator("#category-list button");
  await expect(buttons.first()).toBeVisible();

  const count = await buttons.count();

  if (count > 1) {
    await buttons.nth(1).click();
    await expect(page.locator("#posts")).toBeVisible();
  }
});