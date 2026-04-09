import { getAllSearchData } from "./mainPage_api.js";
import { searchInData, typeLabels, roomIconsSearch } from "./mainPage_logic.js";

export function renderResults(results) {
    const resultsSection = document.querySelector("#search-results");
    const resultsContainer = document.querySelector(".results-grid");
    resultsContainer.innerHTML = "";

    if (!results.length) {
        resultsContainer.innerHTML = "<p>Inga resultat</p>";
        resultsSection.removeAttribute("hidden");
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
            if (item.type === "room") window.location.href = `src/category.html?room_id=${item.id}&room_name=${encodeURIComponent(item.title)}`;
            else console.log("Denna typ stöds inte än:", item.type);
        });

        resultsContainer.appendChild(div);
    });

    resultsSection.removeAttribute("hidden");
}

export function popularRecipeSlideshow(recipes) {
    if (!recipes?.length) return;
    const container = document.querySelector(".recipe-slideshow");
    if (!container) return;

    let index = 0;

    function showRecipe() {
        const recipe = recipes[index];

        container.innerHTML = `
            <div class="slide-wrap">
                <a href="src/recipes/recipes.html?name=${encodeURIComponent(recipe.slug)}" class="slide">
                    <h3>${recipe.title}</h3>
                    <p>${recipe.description || ""}</p>
                </a>
            </div>
        `;

        index = (index + 1) % recipes.length;
    }

    showRecipe();
    setInterval(showRecipe, 8000);
}

export function showRandomBlogPosts(posts) {
    if (!posts?.length) return;
    const container = document.querySelector(".blog-posts");
    if (!container) return;

    const shuffled = [...posts].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    container.innerHTML = selected.map(post => `
        <a href="src/blog.html?name=${encodeURIComponent(post.slug)}"
           class="blog-card"
           style="display:block; color:inherit; text-decoration:none;">
            <h4>${post.title}</h4>
        </a>
    `).join("");
}

// Initiering och event listeners
document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.querySelector(".search");
    const searchInput = document.querySelector("#search-input");
    let allData = null;

    getAllSearchData().then(data => {
        allData = data;
        popularRecipeSlideshow(data.recipes);
        showRandomBlogPosts(data.blog_posts);
    });

    searchForm.addEventListener("submit", e => {
        e.preventDefault();
        if (!allData) return console.warn("Datan laddas fortfarande...");
        const results = searchInData(allData, searchInput.value);
        renderResults(results);
    });

    // Rum-knappar
    document.querySelectorAll(".room").forEach(button => {
        button.addEventListener("click", () => {
            const roomId = button.dataset.roomId;
            const roomName = button.dataset.roomName;
            window.location.href = `src/category.html?room_id=${roomId}&room_name=${encodeURIComponent(roomName)}`;
        });
    });
});