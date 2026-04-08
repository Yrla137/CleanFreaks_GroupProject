// DOM-ELEMENT
const title = document.getElementById("recipes-title");
const image = document.getElementById("recipes-image");
const description = document.getElementById("recipes-description");
const time = document.getElementById("recipes-time");
const difficulty = document.getElementById("recipes-difficulty");
const ecoFriendly = document.getElementById("recipes-eco-friendly");

const toolsList = document.getElementById("recipes-tools");
const ingredientsList = document.getElementById("recipes-ingredients");
const stepsList = document.getElementById("recipes-steps");

// KONFIGURATION
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoZXpweWtteGthY2Ztem12YnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTc2NTYsImV4cCI6MjA5MDUzMzY1Nn0.dkMURqCsUaDlBO6zI6MpEK5ajMHvWhlq7GXbqfIMnUo";
const BASE_URL = "https://xhezpykmxkacfmzmvbzp.supabase.co/rest/v1/recipes";


function fetchFullRecipe(slug) {
    const query = `?select=*,` +
        `recipe_steps(*),` +
        `recipe_tools(*,tools(*)),` +
        `recipe_ingredients(*,ingredients(*),units(*)),` +
        `recipe_problems(*,problems(*,areas_problems(*,areas(*,room_area(*,rooms(*))))))` +
        `&slug=eq.${slug}`;

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
                fetchRelatedRecipes(data[0].recipe_id);
                data.map(recipe => renderRecipe(recipe));
            } else {
                document.querySelector("main").innerHTML = "<h2>Hoppsan! Receptet hittades inte.</h2>";
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

    title.innerText = recipe.title || "";
    description.innerText = recipe.description || "";
    time.innerText = `⏱️ ${recipe.time_minutes} min`;
    difficulty.innerText = `📊 ${recipe.difficulty}`;

    if (recipe.image) {
        image.innerHTML = `<img src="${recipe.image}" alt="${recipe.title}" style="max-width:100%;">`;
    } else {
        image.innerHTML = "";
    }

    if (recipe.eco_friendly) {
        ecoFriendly.innerHTML = `<span class="eco-friendly">🌿 Miljövänligt val</span>`;
    } else {
        ecoFriendly.innerHTML = "";
    }

    if (recipe.recipe_tools && recipe.recipe_tools.length > 0) {
        toolsList.innerHTML = `<h3>Verktyg</h3><ul>${recipe.recipe_tools.map(item => `<li>${item.tools?.name || "Verktyg"}</li>`).join("")}</ul>`;
    } else {
        toolsList.innerHTML = "";
    }

    if (recipe.recipe_ingredients && recipe.recipe_ingredients.length > 0) {
        ingredientsList.innerHTML = `<h3>Ingredienser</h3><ul>${recipe.recipe_ingredients.map(item => {
            const ingName = item.ingredients?.name || '';
            const unitName = item.units?.name || '';
            return `<li>${item.amount || ""} ${unitName} ${ingName}</li>`;
        }).join("")}</ul>`;
    } else {
        ingredientsList.innerHTML = "";
    }

    if (recipe.recipe_steps && recipe.recipe_steps.length > 0) {
        const sortedSteps = [...recipe.recipe_steps].sort((a, b) => a.step_order - b.step_order);
        stepsList.innerHTML = `<h3>Så gör du</h3><ol>${sortedSteps.map(s => `<li>${s.instruction}</li>`).join("")}</ol>`;
    } else {
        stepsList.innerHTML = "";
    }

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
        Array.from(uniqueTags).forEach(tag => {
            tagHTML += `<a href="search.html?q=${encodeURIComponent(tag.name)}" class="tag tag-${tag.type}">${tag.name}</a>`;
        });
        tagHTML += `</div>`;
        tagsContainer.innerHTML = tagHTML;
    } else {
        tagsContainer.innerHTML = "";
    }
}

/** RELATED RECIPES **/
function fetchRelatedRecipes(currentId) {
    const query = `?select=title,image,slug,recipe_id&recipe_id=neq.${currentId}&limit=12`;
    fetch(BASE_URL + query, {
        headers: {
            "apikey": API_KEY,
            "Authorization": `Bearer ${API_KEY}`
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const shuffled = data.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 3);
            renderRelated(selected);
        })
        .catch(err => console.error("Kunde inte hämta relaterade recept:", err));
}

function renderRelated(recipes) {
    console.log(recipes);
    const container = document.getElementById("related-recipes-container");
    if (!container) return;
    if (recipes.length === 0) {
        container.innerHTML = "<p>Inga fler recept hittades.</p>";
        return;
    }
    container.innerHTML = recipes.map(recipe => `
        <a href="recipes.html?name=${recipe.slug}" class="related-card">
            <div class="related-img-wrapper">
                <img src="${recipe.image}" alt="${recipe.title}">
            </div>
            <h4>${recipe.title}</h4>
        </a>
    `).join("");
}

const urlParams = new URLSearchParams(window.location.search);
const recipeSlug = urlParams.get('name'); // Hämtar det som står efter ?name=

if (recipeSlug) {
    fetchFullRecipe(recipeSlug);
} else {
    console.error("Ingen slug hittades i URL:en");
}
