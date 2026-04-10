import { test, expect, describe } from "@playwright/test";
 
describe("MainPage E2E", () => {
 
  test("sökfunktion returnerar korrekt resultat / testar båda typer av sökningar", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".search")).toBeVisible();
 
    await page.fill("#search-input", "kök");
    await page.getByRole("button", { name: /sök/i }).click();
 
    await expect(page.locator(".results-grid h3").first()).toBeVisible();
    await expect(page.locator(".results-grid h3").first()).toHaveText("Kök");
  });
 

  test("rumsikonerna navigerar/uppdaterar DOM korrekt", async ({ page }) => {
    await page.goto("/");
    await expect (page.locator(".rooms")).toBeVisible();
 
    await page.click(".rooms button:has-text('Kök')");
    await expect(page).toHaveURL(/category\.html\?room_id=1/);
  });
 
});