import { expect, test } from 'vitest';
import { renderRecipe } from '../../../src/recipes/recipes.js';

test('renderRecipe bör fylla i rubriken korrekt', () => {
    document.body.innerHTML = `
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

    const mockRecipe = {
        title: "Bikarbonat-magi",
        description: "Testbeskrivning"
    };

    renderRecipe(mockRecipe);

    const titleEl = document.getElementById("recipes-title");
    expect(titleEl.innerText).toBe("Bikarbonat-magi");
});