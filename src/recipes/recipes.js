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
        `recipe_ingredients(*,ingredients(*),units(*)),` +
        `recipe_problems(*,problems(*,areas_problems(*,areas(*,room_area(*,rooms(*))))))` +
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
        toolsList.innerHTML = `
            <h3>Verktyg</h3>
            <ul>
                ${recipe.recipe_tools.map(item => `<li>${item.tools?.name || "Verktyg"}</li>`).join("")}
            </ul>
        `;
    } else {
        toolsList.innerHTML = ""; // Helt tomt om inga verktyg finns
    }

    // INGREDIENSER
    if (recipe.recipe_ingredients && recipe.recipe_ingredients.length > 0) {
        ingredientsList.innerHTML = `
            <h3>Ingredienser</h3>
            <ul>
                ${recipe.recipe_ingredients.map(item => {
            const ingName = item.ingredients?.name || '';
            const unitName = item.units?.name || '';
            return `<li>${item.amount || ""} ${unitName} ${ingName}</li>`;
        }).join("")}
            </ul>
        `;
    } else {
        ingredientsList.innerHTML = "";
    }

    // STEG
    if (recipe.recipe_steps && recipe.recipe_steps.length > 0) {
        const sortedSteps = [...recipe.recipe_steps].sort((a, b) => a.step_order - b.step_order);
        stepsList.innerHTML = `
            <h3>Så gör du</h3>
            <ol>
                ${sortedSteps.map(s => `<li>${s.instruction}</li>`).join("")}
            </ol>
        `;
    } else {
        stepsList.innerHTML = "";
    }

    // TAGGAR
    const tagsContainer = document.getElementById("recipe-tags");
    if (recipe.recipe_problems && recipe.recipe_problems.length > 0) {

        let tagHTML = `<div class="tag-group">`;

        const uniqueTags = new Set();

        recipe.recipe_problems.forEach(rp => {
            const prob = rp.problems;
            if (prob) {
                uniqueTags.add({ name: prob.name, type: 'problem' });

                prob.areas_problems?.forEach(ap => {
                    if (ap.areas) {
                        uniqueTags.add({ name: ap.areas.name, type: 'area' });

                        ap.areas.room_area?.forEach(ra => {
                            if (ra.rooms) uniqueTags.add({ name: ra.rooms.name, type: 'room' });
                        });
                    }
                });
            }
        });

        // Rita ut taggarna länkar
        Array.from(uniqueTags).forEach(tag => {
            tagHTML += `
            <a href="search.html?q=${encodeURIComponent(tag.name)}" class="tag tag-${tag.type}">
                ${tag.name}
            </a>`;
        });

        tagHTML += `</div>`;
        tagsContainer.innerHTML = tagHTML;
    } else {
        tagsContainer.innerHTML = "";
    }
}

// Här skickar vi in ID:t på det recept vi vill visa (t.ex. 1)
fetchFullRecipe(1);






