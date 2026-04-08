import { expect, test, vi, beforeEach, describe } from 'vitest';
import { fetchFullRecipe } from '../../../src/recipes/recipes.js';

global.fetch = vi.fn();

describe('Recipes Integration - fetchFullRecipe', () => {

    beforeEach(() => {
        document.body.innerHTML = `
            <main id="main-content"></main>
            <h1 id="recipes-title"></h1>
            <div id="recipes-description"></div>
            <div id="recipes-image"></div>
            <div id="recipes-time"></div>
            <div id="recipes-difficulty"></div>
            <div id="recipes-eco-friendly"></div>
            <div id="recipes-tools"></div>
            <div id="recipes-ingredients"></div>
            <div id="recipes-steps"></div>
            <div id="recipe-tags"></div>
        `;
        vi.clearAllMocks();
    });

    test('hämta data från API och uppdater korrekt', async () => {
        const mockApiResponse = [{
            recipe_id: 101,
            title: "Super-Bikarbonat",
            description: "Rengör allt",
            time_minutes: 20,
            difficulty: "Medel"
        }];

        fetch.mockResolvedValue({
            ok: true,
            json: async () => mockApiResponse
        });

        await fetchFullRecipe("test-slug");

        const titleEl = document.getElementById("recipes-title");
        expect(titleEl.innerText).toBe("Super-Bikarbonat");
    });

    test('visa felmeddelande om recept inte hittas', async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: async () => []
        });

        await fetchFullRecipe("finns-inte");

        const mainContent = document.body.innerHTML;
        expect(mainContent).toContain("Hoppsan! Receptet hittades inte.");
    });
});