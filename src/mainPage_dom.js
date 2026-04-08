import { typeLabels, roomIconsSearch } from './utils.js';

// Recipes slideshow
export function popularRecipeSlideshow(recipes) {
    if (!recipes || recipes.length === 0) return;

    const container = document.querySelector(".recipe-slideshow");
    if (!container) return;

    let index = 0;

    function showRecipe() {
        const recipe = recipes[index];
        container.innerHTML = `
            <div class="slide">
                <h3>${recipe.title}</h3>
                <p>${recipe.description || ""}</p>
            </div>
        `;
        index = (index + 1) % recipes.length;
    }

    showRecipe();
    setInterval(showRecipe, 8000);
}

// Blog posts
export function showRandomBlogPosts(posts) {
    if (!posts || posts.length === 0) return;

    const container = document.querySelector(".blog-posts");
    if (!container) return;

    const shuffled = [...posts].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    container.innerHTML = selected.map(post => `
        <div class="blog-card">
            <h4>${post.title}</h4>
        </div>
    `).join("");
}

// Render search results
export function renderResults(results) {
    const resultsSection = document.querySelector("#search-results");
    const resultsContainer = document.querySelector(".results-grid");

    resultsContainer.innerHTML = "";

    if (results.length === 0) {
        resultsContainer.innerHTML = "<p>Inga resultat</p>";
        resultsSection.hidden = false;
        return;
    }

    results.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("result-card");

        let icon = "";
        if (item.type === "room") {
            const iconClass = roomIconsSearch[item.title] || "fa-solid fa-house";
            icon = `<i class="${iconClass}"></i>`;
        }

        div.innerHTML = `
            ${icon}
            <h3>${item.title}</h3>
            <p>${typeLabels[item.type]}</p>
            ${item.description ? `<p>${item.description}</p>` : ""}
        `;

        div.addEventListener("click", () => {
            if (item.type === "room") {
                window.location.href = `category.html?room_id=${item.id}`;
            } else {
                console.log("Denna typ stöds inte än:", item.type);
            }
        });

        resultsContainer.appendChild(div);
    });

    resultsSection.hidden = false;
}