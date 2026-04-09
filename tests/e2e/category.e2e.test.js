import { test, expect, describe } from "@playwright/test";

describe("Category Page E2E", () => {

  test("sidan visar 'Inget rum valt' när inget room_id finns i URL", async ({ page }) => {
    await page.goto("/src/category.html");

    await expect(page.locator("#room-title")).toHaveText("Inget rum valt", { timeout: 10000 });
    await expect(page.locator(".status-msg")).toBeVisible();
  });

  test("rumsnamnet renderas korrekt från databasen", async ({ page }) => {
    await page.goto("/src/category.html?room_id=1");

    await expect(page.locator("#room-title")).not.toHaveText("Laddar...", { timeout: 10000 });
    await expect(page.locator("#room-title")).not.toBeEmpty();
  });

  test("area-kort visas efter att rum valts", async ({ page }) => {
    await page.goto("/src/category.html?room_id=1");

    await expect(page.locator(".area-card").first()).toBeVisible({ timeout: 10000 });
  });

  test("problems popup visas vid hover på area-kort", async ({ page }) => {
    await page.goto("/src/category.html?room_id=1");

    const firstCard = page.locator(".area-card").first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });

    await firstCard.hover();

    await expect(firstCard.locator(".problems-popup")).toBeVisible();
  });

  test("problems i popup är klickbara länkar med korrekt href", async ({ page }) => {
    await page.goto("/src/category.html?room_id=1");

    const firstCard = page.locator(".area-card").first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });

    await firstCard.hover();

    const firstLink = firstCard.locator(".problem-link").first();
    await expect(firstLink).toBeVisible();

    const href = await firstLink.getAttribute("href");
    expect(href).toMatch(/recipes\.html\?problem_id=\d+/);
  });

  test("klick på problem navigerar till recipes.html med rätt problem_id", async ({ page }) => {
    await page.goto("/src/category.html?room_id=1");

    const firstCard = page.locator(".area-card").first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });

    await firstCard.hover();

    const firstLink = firstCard.locator(".problem-link").first();
    await expect(firstLink).toBeVisible();

    await firstLink.click();

    await expect(page).toHaveURL(/recipes\.html\?problem_id=\d+/);
  });

  test("tillbaka-knappen navigerar till startsidan", async ({ page }) => {
    await page.goto("/src/category.html?room_id=1");

    await expect(page.locator(".back-btn")).toBeVisible({ timeout: 10000 });
    await page.click(".back-btn");

    // back-btn pekar på ../index.html
    await expect(page).toHaveURL(/index\.html|localhost:4173\/$/);
  });

  test("spinner visas medan data laddas och försvinner sedan", async ({ page }) => {
    await page.route("**/rest/v1/**", async route => {
      await new Promise(resolve => setTimeout(resolve, 800));
      await route.continue();
    });

    await page.goto("/src/category.html?room_id=1");

    await expect(page.locator(".spinner")).toBeVisible({ timeout: 5000 });
    await expect(page.locator(".spinner")).not.toBeVisible({ timeout: 10000 });
  });

  test("sidan fungerar för flera olika rum", async ({ page }) => {
    await page.goto("/src/category.html?room_id=2");

    await expect(page.locator("#room-title")).not.toHaveText("Laddar...", { timeout: 10000 });
    await expect(page.locator(".area-card").first()).toBeVisible({ timeout: 10000 });
  });

});