// 1. DOM-ELEMENT
const title = document.getElementById("recipes-title");
const image = document.getElementById("recipes-image");
const description = document.getElementById("recipes-description");
const time = document.getElementById("recipes-time");
const difficulty = document.getElementById("recipes-difficulty");
const ecoFriendly = document.getElementById("recipes-eco-friendly");

const toolsList = document.getElementById("recipes-tools");
const ingredientsList = document.getElementById("recipes-ingredients");
const stepsList = document.getElementById("recipes-steps");

// 2. KONFIGURATION
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoZXpweWtteGthY2Ztem12YnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTc2NTYsImV4cCI6MjA5MDUzMzY1Nn0.dkMURqCsUaDlBO6zI6MpEK5ajMHvWhlq7GXbqfIMnUo";
const BASE_URL = "https://xhezpykmxkacfmzmvbzp.supabase.co/rest/v1/recipes";

/**
 * Hämta ett specifikt recept
 * @param {number} recipeId
 */
function fetchFullRecipe(recipeId) {
    const query = `?select=*,` +
        `recipe_steps(*),` +
        `recipe_tools(*,tools(*)),` +
        `recipe_ingredients(*,ingredients(*),units(*))` +
        `&recipe_id=eq.${recipeId}`;

    fetch(BASE_URL + query, {
        headers: {
            "apikey": API_KEY,
            "Authorization": `Bearer ${API_KEY}`
        }
    })
        .then(response => {
            if (!response.ok) throw new Error("Kunde inte hämta data");
            return response.json();
        })
        .then(data => {
            if (data.length > 0) {
                renderRecipe(data[0]);
            } else {
                console.error("Receptet hittades inte");
            }
        })
        .catch(error => {
            console.error("Hoppsan, något gick fel:", error);
        });
}

/**
 * Funktion som placerar ut datan i HTML
 */
function renderRecipe(recipe) {
    console.log("Fullständig data från Supabase:", recipe);

    document.getElementById("recipes-title").innerText = recipe.title || "";
    document.getElementById("recipes-description").innerText = recipe.description || "";
    document.getElementById("recipes-time").innerText = `⏱️ ${recipe.time_minutes} min`;
    document.getElementById("recipes-difficulty").innerText = `📊 ${recipe.difficulty}`;

    // STEG
    const stepsList = document.getElementById("recipes-steps");
    if (recipe.recipe_steps) {
        const sortedSteps = [...recipe.recipe_steps].sort((a, b) => a.step_order - b.step_order);
        stepsList.innerHTML = sortedSteps.map(s => `<li>${s.step_order}. ${s.instruction}</li>`).join("");
    }

    // BILD 
    if (recipe.image) {
        image.innerHTML = `<img src="${recipe.image}" alt="${recipe.title}" style="max-width:100%;">`;
    } else {
        image.innerHTML = "";
    }

    // ECO-FRIENDLY
    if (recipe.eco_friendly) {
        ecoFriendly.innerHTML = `<span class="eco-friendly">🌿 Miljövänligt val</span>`;
    } else {
        ecoFriendly.innerHTML = "";
    }

    // TOOLS
    if (recipe.recipe_tools && recipe.recipe_tools.length > 0) {
        toolsList.innerHTML = recipe.recipe_tools.map(item => {
            // Om 'tools' finns som ett objekt inuti kopplingstabellen
            const name = item.tools ? item.tools.name : "Okänt verktyg";
            return `<li>${name}</li>`;
        }).join("");
    }

    // INGREDIENSER
    if (recipe.recipe_ingredients && recipe.recipe_ingredients.length > 0) {
        ingredientsList.innerHTML = recipe.recipe_ingredients.map(item => {
            const ingName = item.ingredients ? item.ingredients.name : "Okänd ingrediens";
            const unitName = item.units ? item.units.name : "";
            return `<li>${item.amount || ""} ${unitName} ${ingName}</li>`;
        }).join("");
    }
}

// Här skickar vi in ID:t på det recept vi vill visa (t.ex. 1)
fetchFullRecipe(1);






