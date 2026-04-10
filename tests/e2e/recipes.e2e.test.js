import { test, expect } from '@playwright/test';

test.describe('Receptsidan E2E', () => {

    test('ska ladda och visa ett recept korrekt', async ({ page }) => {
        await page.goto('/src/recipes/recipes.html?name=dusch-attika');

        const title = page.locator('#recipes-title');

        await expect(title).toBeVisible({ timeout: 10000 });
        await expect(title).not.toBeEmpty();

        const ingredients = page.locator('#recipes-ingredients');
        await expect(ingredients).toContainText('Ingredienser');
    });

    test('ska visa felmeddelande om receptet inte finns', async ({ page }) => {
        await page.goto('/src/recipes/recipes.html?name=finns-inte-123');

        const main = page.locator('main');
        await expect(main).toContainText('Hoppsan! Receptet hittades inte.');
    });
});