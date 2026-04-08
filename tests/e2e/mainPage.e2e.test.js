import { test, expect } from "@playwright/test";

test.describe("MainPage E2E", () => {

  test("sökfunktion returnerar korrekt resultat / testar båda typer av sökningar", async ({ page }) => {
    await page.goto("http://localhost:5500/src/mainPage.html");
    await expect(page.locator(".search")).toBeVisible();

    await page.fill("#search-input", "Kök");
    await page.getByRole("button", { name: "Sök" }).click();

    await expect(page.locator("#search-results")).toBeVisible();
    await expect(page.locator(".results-grid > div")).toContainText("Kök");


    await page.fill("#search-input", "kök");
    await page.getByRole("button", { name: "Sök" }).click();

    await expect(page.locator("#search-results")).toBeVisible();
    await expect(page.locator(".results-grid > div")).toContainText("kök");
  });


  test("rumsikonerna navigerar/uppdaterar DOM korrekt", async ({ page }) => {
    await page.goto("http://localhost:5500/mainPage.html");
    await expect (page.locator(".rooms")).toBeVisible();

    await page.click(".rooms button:has-text('Kök')");
    await expect(page).toHaveURL(/category\.html\?room_id=1/);
  });

});