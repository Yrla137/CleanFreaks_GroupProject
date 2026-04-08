document.addEventListener("DOMContentLoaded", () => {

    // BAS-URL TILL SUPABASE //
    const SUPABASE_URL = "https://xhezpykmxkacfmzmvbzp.supabase.co/rest/v1";

    // PUBLIC/ANON KEY //
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoZXpweWtteGthY2Ztem12YnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTc2NTYsImV4cCI6MjA5MDUzMzY1Nn0.dkMURqCsUaDlBO6zI6MpEK5ajMHvWhlq7GXbqfIMnUo";


    // FETCH-FUNKTION //
    async function fetchFromSupabase(endpoint) {
        try {
            const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
                headers: {
                    apikey: SUPABASE_ANON_KEY,
                    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                },
            });

            if (!response.ok) {
                throw new Error(`API-fel: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Fel vid API-anrop:", error);
            return null;
        }
    };
// Supabase REST API - bas-URL och anonym nyckel
// fetchFromSupabase(endpoint) gör GET-anrop med korrekt header och felhantering


    // FUNKTIONER SOM HÄMTAR ALLA ROOMS //
    async function getRooms() {
        return fetchFromSupabase("/rooms?select=*")
    };

    async function getAreas() {
        return fetchFromSupabase("/areas?select=*")
    };

    async function getProblems() {
        return fetchFromSupabase("/problems?select=*")
    };

    async function getRecipes() {
        return fetchFromSupabase("/recipes?select=*")
    };

    async function getBlogPosts() {
        return fetchFromSupabase("/blog_posts?select=*")
    };

    async function getIngredients() {
        return fetchFromSupabase("/ingredients?select=*")
    };

    async function getTools() {
        return fetchFromSupabase("/tools?select=*")
    };


    async function getAllSearchData() {
        
        const [rooms, areas, problems, recipes, blog_posts, ingredients, tools] = await Promise.all([
        // Promise.all gör att sidan väntar tills ALLA anrop är klara så att man inte behöver ta await på en i taget med exempelvis const rooms = await getRooms(); och const areas = await getAreas();
        // Arrayen nedan packas upp i variabler i samma ordning. Exempelvis rooms -> getRooms().
            getRooms(),
            getAreas(),
            getProblems(),
            getRecipes(),
            getBlogPosts(),
            getIngredients(),
            getTools()
        ]);

        return { rooms, areas, problems, recipes, blog_posts, ingredients, tools};
        // Hämtar alla tabeller parallellt och packar i objekt
        // Resultatet blir {
        // rooms: [...],
        // areas: [...],
        // problems: [...],
        // recipes: [...]
    };

    function searchInData(data, query) {
        // data = det från getAllSearchData()
        // query är en parameter (input till funktionen)
        const q = query.trim().toLowerCase();
        // query = det användaren skriver i sökfältet och q = samma sak som query, bara i små bokstäver
        // trim() tar bort mellanslag i början/slutet
        // toLowerCase() gör allt till små bokstäver

        // Du bestämmer vad query är när du anropar funktionen:
        // searchInData(data, "badrum")
        // 👉 Då blir:
        // query = "badrum"
        // q = "badrum"

        if (!q) return [];
        // Om användaren inte skriver något ska inte massa resultat komma upp.

        let results = [];
        // Här ska datan läggas in / sparas
        // Vi skapar en varibel som vi kallar results som blir en tom array


        // Här nedanför loppas alla arrayer med data igenom.
        // If-villkoren säger "Finns söktexten i namnet?" genom q som blivit variabeln för queryn.
        // Exempel:
        // | item.name | query | match? |
        // | --------- | ----- | ------ |
        // | "Kök"     | "kö"  | ✅      |
        // | "Badrum"  | "kö"  | ❌      |

        // Rooms
        (data.rooms || []).forEach(item => {
            // item skapas av forEach loopen
            // Vad betyder det?
            // 👉 “Om data.rooms finns → använd den
            // 👉 annars → använd tom array []”
            if (item.name.toLowerCase().includes(q)) {

                // Här läggs resultatet till. Skapar ett standardformat.
                // Exempelvis: { type: "room", title: "Kök", id: 1 }
                results.push({
                    // Här fylls variablen med de tomma arrayen results i efter att datan loopats igenom
                    // OM det matchar i if → lägg till i listan
                    type: "room",
                    title: item.name,
                    id: item.room_id
                });
            }
        });

        // Tänk så här:

        // data.rooms = [
        //   { room_id: 1, name: "Kök" },
        //   { room_id: 2, name: "Badrum" }
        // ]

        // 👉 loopen gör:

        // item = { room_id: 1, name: "Kök" }
        // item = { room_id: 2, name: "Badrum" }

        // Areas
        (data.areas || []).forEach(item => {
            if (item.name.toLowerCase().includes(q)) {
                results.push({
                    type: "area",
                    title: item.name,
                    id: item.area_id
                });
            }
        });

        // Problems
        (data.problems || []).forEach(item => {
            if (item.name.toLowerCase().includes(q)) {
                results.push({
                    type: "problem",
                    title: item.name,
                    id: item.problem_id
                });
            }
        });

        // Recipes
        (data.recipes || []).forEach(item => {
            if (item.title.toLowerCase().includes(q)) {
                results.push({
                    type: "recipe",
                    title: item.title,
                    description: item.description,
                    id: item.recipe_id
                });
            }
        });

        // Blog_posts
        (data.blog_posts || []).forEach(item => {
            if (item.title.toLowerCase().includes(q)) {
                results.push({
                    type: "blog_post",
                    title: item.title,
                    id: item.blog_post_id
                });
            }
        });

        // Ingredients
        (data.ingredients || []).forEach(item => {
            if (item.name.toLowerCase().includes(q)) {
                results.push({
                    type: "ingredient",
                    title: item.name,
                    id: item.ingredient_id
                });
            }
        });

        // Tools
        (data.tools || []).forEach(item => {
            if (item.name.toLowerCase().includes(q)) {
                results.push({
                    type: "tool",
                    title: item.name,
                    id: item.tool_id
                });
            }
        });

        return results;
        // Returnerar resultatet
        // Exempel resultat:
        // [ { type: "room", title: "Kök", id: 1 }, { type: "area", title: "Spis", id: 3 } ]

    }


    // KLICKBARA HTML RUMIKNOER //
    const roomIconsBtns = document.querySelectorAll(".room");
    // Skapar alla knappar med klassen "room"

    roomIconsBtns.forEach(button => {
    button.addEventListener("click", () => {
        // Lägger på en click-event på varje knapp

        const roomId = button.dataset.roomId;
        // Läser ID från data-attributet
        const roomName = button.dataset.roomName;
        // dataset läser data-attributet från HTML.
        // Om knappen har exempelvis data-room-id="1" → button.dataset.roomId blir "1" (en sträng).

        window.location.href = `category.html?type=room&id=${roomId}&title=${encodeURIComponent(roomName)}`;
        // Navigerar till sidan med room_id i querystringen
        // encodeURIComponent gör att specialtecken och mellanslag i texten blir giltiga i URL.
        // Exempel: "Tvättstuga & Kök" → "Tv%C3%A4ttstuga%20%26%20K%C3%B6k"
    });
});


    // HAMBURGARMENY //
    const menuBtn = document.querySelector(".menu-btn");
    const menu = document.querySelector(".menu");
    // Skapar variabler för meny-knappen och själva menyn

    menuBtn.addEventListener("click", () => {
        menu.classList.toggle("active");
        // Lägger på/tar bort klassen "active" på både knappen och menyn när man klickar på knappen
        if (menu.classList.contains("active")) {
        // Om menyn har klassen "active" → aria-label = "Stäng meny"
            menuBtn.setAttribute("aria-label", "Stäng meny");
        } else {
            menuBtn.setAttribute("aria-label", "Öppna meny");
        // Om menyn inte har klassen "active" → aria-label = "Öppna meny"
        }
    });

    const links = menu.querySelectorAll("a");
    // Alla länkar i menyn
    links.forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.remove("active");
            menuBtn.setAttribute("aria-label", "Öppna meny");
            // När man klickar på en länk i menyn → döljs menyn och aria-label ändras tillbaka till "Öppna meny"
        });
    });


    const searchForm = document.querySelector(".search");
    const searchInput = document.querySelector("#search-input");

    let allData = null;

    getAllSearchData().then(data => {
        allData = data;
    });

    searchForm.addEventListener("submit", (e) => {
        // Körs när man trycker Enter / klickar sök
        e.preventDefault();
        // Stoppar sidan från att ladda om

        const query = searchInput.value;
        // Det användaren skriver

        if (!allData){
            console.warn("Datan laddas fortfarande, vänligen vänta...");
            return;
        }
        // SÄKERHETSCHECK! Om API inte är klart → varna användaren och stoppa funktionen

        const results = searchInData(allData, query);

        renderResults(results);
        // Kör searchInData i vaiabeln results med query och renderResults

    });


    const resultsSection = document.querySelector("#search-results");
    // Hela sektionen (för att visa/dölja)
    const resultsContainer = document.querySelector(".results-grid");
    // Där vi stoppar resultaten

    const popularRecipesContainer = document.querySelector(".popular-recipes");
    const blogPostsContainer = document.querySelector(".blog-posts");
    // Variabler för att visa populära recept och blogginlägg på startsidan

    // Här skapas typeLables för att i renderResults kunna visa sökresultaten på följande sätt
    const typeLabels = {
        room: "Rum",
        area: "Område",
        problem: "Problem",
        recipe: "Recept",
        blog_post: "Blogg",
        ingredient: "Ingrediens",
        tool: "Verktyg"
    };

    // Här skapas roomIcons för att i renderResults kunna visa ikonerna i sökresultaten
    const roomIconsSearch = {
        "Kök": "fa-solid fa-kitchen-set",
        "Badrum": "fa-solid fa-bath",
        "Vardagsrum": "fa-solid fa-couch",
        "Sovrum": "fa-solid fa-bed",
        "Tvättstuga": "fa-solid fa-sink",
        "Utomhus": "fa-solid fa-umbrella-beach"
    };

    // POPULÄRA-RECEPT FUNKTION //
    function startRecipeSlideshow(data) {
 
    if (!recipes || recipes.length === 0) {
        popularRecipesContainer.innerHTML = "<p>Inga populära recept att visa</p>";
        return;
    }

    // BLOGGINLÄGG FUNKTION //
    function renderRandomBlogPosts(data) {
        if (!blog_posts || blog_posts.length === 0) {
            blogPostsContainer.innerHTML = "<p>Inga blogginlägg att visa</p>";
            return;
        }
    }



    // RENDER FUNKTION //
    function renderResults(results) {

        resultsContainer.innerHTML = "";
        // Tömmer tidigare resultat

        if (results.length === 0) {
            resultsContainer.innerHTML = "<p>Inga resultat</p>";
            resultsSection.hidden = false;
            return;
        // Om inga resultat return "Inga resultat"
        }

        results.forEach(item => {
        // Loopar igenom resultat och visar reultat om resultat finns

            const div = document.createElement("div");
            div.classList.add("result-card");

            let icon = "";
            if (item.type === "room") {
                const iconClass = roomIconsSearch[item.title] || "fa-solid fa-house";
                // Med || som betyder "eller" så ser man till att alltid få en ikon om någon skulle sakna.

                icon = `<i class="${iconClass}"></i>`;
            }


            // Här skapas innehållet och visar bara description om det finns
            div.innerHTML = `
                ${icon}
                <h3>${item.title}</h3>
                <p>${typeLabels[item.type]}</p>
                ${item.description ? `<p>${item.description}</p>` : ""}
            `;


            div.addEventListener("click", () => {
            // körs när man klickar på ett resultat

            window.location.href = `category.html?type=${item.type}&id=${item.id}&title=${encodeURIComponent(item.title)}`;
            // Skickar användaren till en room/area/problem, osv. sida
            // Skickar med ID → nästa sida kan läsa av det
});

            // Lägg in innhållet i DOM
            resultsContainer.appendChild(div);
        });

        // Visar sektionen genom att ta bort "hidden" effekten
        resultsSection.hidden = false;
    }

});