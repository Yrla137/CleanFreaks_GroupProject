// mainPageInit.js
import { getAllSearchData } from './api.js';
import { searchInData } from './utils.js';
import { renderResults, popularRecipeSlideshow, showRandomBlogPosts } from './dom.js';

document.addEventListener("DOMContentLoaded", async () => {

    // Rum-knappar
    const roomIconsBtns = document.querySelectorAll(".room");
    roomIconsBtns.forEach(button => {
        button.addEventListener("click", () => {
            const roomId = button.dataset.roomId;
            const roomName = button.dataset.roomName;
            window.location.href =
                `category.html?room_id=${roomId}&room_name=${encodeURIComponent(roomName)}`;
        });
    });

    // Sök
    const searchForm = document.querySelector(".search");
    const searchInput = document.querySelector("#search-input");

    // Hämta all data från API
    let allData = await getAllSearchData();

    // Initiera UI-komponenter
    popularRecipeSlideshow(allData.recipes);
    showRandomBlogPosts(allData.blog_posts);

    // Event listener för sök
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!allData) {
            console.warn("Datan laddas fortfarande...");
            return;
        }
        const results = searchInData(allData, searchInput.value);
        renderResults(results);
    });
});