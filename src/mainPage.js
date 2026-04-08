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

            if (!response.ok) throw new Error(`API-fel: ${response.status}`);

            return await response.json();
        } catch (error) {
            console.error("Fel vid API-anrop:", error);
            return null;
        }
    }

    // Tabeller
    const getRooms = () => fetchFromSupabase("/rooms?select=*");
    const getAreas = () => fetchFromSupabase("/areas?select=*");
    const getProblems = () => fetchFromSupabase("/problems?select=*");
    const getRecipes = () => fetchFromSupabase("/recipes?select=*");
    const getBlogPosts = () => fetchFromSupabase("/blog_posts?select=*");
    const getIngredients = () => fetchFromSupabase("/ingredients?select=*");
    const getTools = () => fetchFromSupabase("/tools?select=*");

    async function getAllSearchData() {
        const [rooms, areas, problems, recipes, blog_posts, ingredients, tools] =
            await Promise.all([
                getRooms(),
                getAreas(),
                getProblems(),
                getRecipes(),
                getBlogPosts(),
                getIngredients(),
                getTools()
            ]);
        // Promise.all gör att sidan väntar tills ALLA anrop är klara så att man inte behöver ta await på en i taget med exempelvis const rooms = await getRooms(); och const areas = await getAreas();
        // Arrayen nedan packas upp i variabler i samma ordning. Exempelvis rooms -> getRooms().

        return { rooms, areas, problems, recipes, blog_posts, ingredients, tools };
    }


    // SÖK-LOGIK //
    function searchInData(data, query) {
        // data = det från getAllSearchData()
        // query är en parameter (input till funktionen)
        const q = query.trim().toLowerCase();
        // query = det användaren skriver i sökfältet och q = samma sak som query, bara i små bokstäver
        // trim() tar bort mellanslag i början/slutet
        // toLowerCase() gör allt till små bokstäver
        if (!q) return [];
        // Om användaren inte skriver något ska inte massa resultat komma upp.

        let results = [];
        // Här ska datan läggas in / sparas
        // Vi skapar en varibel som vi kallar results som blir en tom array som vi sedan fyller på med det som matchar sökningen i de olika tabellerna.


        (data.rooms || []).forEach(item => {
            // item skapas av forEach loopen
            // Vad betyder det?
            // “Om data.rooms finns → använd den
            // annars → använd tom array []”
            if (item.name.toLowerCase().includes(q)) {
            // Här läggs resultatet till. Skapar ett standardformat.
            // Exempelvis: { type: "room", title: "Kök", id: 1 }
                results.push({ type: "room", title: item.name, id: item.room_id });
            // Här fylls variablen med de tomma arrayen results i efter att datan loopats igenom
            // OM det matchar i if → lägg till i listan
            }
        });

        (data.areas || []).forEach(item => {
            if (item.name.toLowerCase().includes(q)) {
                results.push({ type: "area", title: item.name, id: item.area_id });
            }
        });

        (data.problems || []).forEach(item => {
            if (item.name.toLowerCase().includes(q)) {
                results.push({ type: "problem", title: item.name, id: item.problem_id });
            }
        });

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

        (data.blog_posts || []).forEach(item => {
            if (item.title.toLowerCase().includes(q)) {
                results.push({
                    type: "blog_post",
                    title: item.title,
                    id: item.blog_post_id
                });
            }
        });

        (data.ingredients || []).forEach(item => {
            if (item.name.toLowerCase().includes(q)) {
                results.push({
                    type: "ingredient",
                    title: item.name,
                    id: item.ingredient_id
                });
            }
        });

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
    }


    // UI DATA - labels & ikoner //

    const typeLabels = {
        // Här skapas typeLables för att i renderResults kunna visa sökresultaten på följande sätt
        room: "Rum",
        area: "Område",
        problem: "Problem",
        recipe: "Recept",
        blog_post: "Blogg",
        ingredient: "Ingrediens",
        tool: "Verktyg"
    };

    const roomIconsSearch = {
        // Här skapas roomIcons för att i renderResults kunna visa ikonerna i sökresultaten
        "Kök": "fa-solid fa-kitchen-set",
        "Badrum": "fa-solid fa-bath",
        "Vardagsrum": "fa-solid fa-couch",
        "Sovrum": "fa-solid fa-bed",
        "Tvättstuga": "fa-solid fa-sink",
        "Utomhus": "fa-solid fa-umbrella-beach"
    };

    
    // KOMPONENTER (UI-FUNKTIONER) //

    // Recipes slideshow //
    function popularRecipeSlideshow(recipes) {
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

    // Blog posts //
    function showRandomBlogPosts(posts) {
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


    // RENDERING // VISNING AV SÖKRESULTAT //

    const resultsSection = document.querySelector("#search-results");
    // Hela sektionen (för att visa/dölja)
    const resultsContainer = document.querySelector(".results-grid");
    // Där vi stoppar resultaten

    function renderResults(results) {
        resultsContainer.innerHTML = "";
        // Tömmer tidigare resultat

        if (results.length === 0) {
        // Om inga resultat return "Inga resultat"
            resultsContainer.innerHTML = "<p>Inga resultat</p>";
            resultsSection.hidden = false;
            return;
        }

        results.forEach(item => {
        // Loopar igenom resultat och visar reultat om resultat finns
            const div = document.createElement("div");
            div.classList.add("result-card");

            let icon = "";
            if (item.type === "room") {
                const iconClass = roomIconsSearch[item.title] || "fa-solid fa-house";
                icon = `<i class="${iconClass}"></i>`;
            }
            // Med || som betyder "eller" så ser man till att alltid få en ikon om någon skulle sakna.

            div.innerHTML = `
                ${icon}
                <h3>${item.title}</h3>
                <p>${typeLabels[item.type]}</p>
                ${item.description ? `<p>${item.description}</p>` : ""}
            `;
            // Här skapas innehållet och visar bara description om det finns

            div.addEventListener("click", () => {
            // körs när man klickar på ett resultat
            if (item.type === "room") {
            window.location.href = `category.html?room_id=${item.id}`;
            } else {
            console.log("Denna typ stöds inte än:", item.type);
           }
            // Skickar användaren till en room/area/problem, osv. sida
            // Skickar med ID → nästa sida kan läsa av det
        });

            resultsContainer.appendChild(div);
            // Lägger in innhållet i DOM
        });

        resultsSection.hidden = false;
        // Visar sektionen genom att ta bort "hidden" effekten
    }


    // EVENTS & INITIALISERING //

    // Rum-knappar //
    const roomIconsBtns = document.querySelectorAll(".room");

    roomIconsBtns.forEach(button => {
        button.addEventListener("click", () => {
            const roomId = button.dataset.roomId;
            // Läser ID från data-attributet
            const roomName = button.dataset.roomName;
            // dataset läser data-attributet från HTML.
            // Om knappen har exempelvis data-room-id="1" → button.dataset.roomId blir "1" (en sträng).

            window.location.href =
                `category.html?room_id=${roomId}&room_name=${encodeURIComponent(roomName)}`;
            // window.location.href = `category.html?type=room&id=${roomId}&title=${encodeURIComponent(roomName)}`;
            // Navigerar till sidan med room_id i querystringen
            // encodeURIComponent gör att specialtecken och mellanslag i texten blir giltiga i URL.
            // Exempel: "Tvättstuga & Kök" → "Tv%C3%A4ttstuga%20%26%20K%C3%B6k"
        });
    });


    // SÖK //
    const searchForm = document.querySelector(".search");
    const searchInput = document.querySelector("#search-input");

    let allData = null;

    getAllSearchData().then(data => {
        allData = data;

        popularRecipeSlideshow(data.recipes);
        showRandomBlogPosts(data.blog_posts);
    });

    searchForm.addEventListener("submit", (e) => {
        // Körs när man trycker Enter / klickar sök
        e.preventDefault();
        // Stoppar sidan från att ladda om
        const query = searchInput.value;
        // Det användaren skriver

        if (!allData) {
            console.warn("Datan laddas fortfarande...");
            return;
        }
        // SÄKERHETSCHECK! Om API inte är klart → varna användaren och stoppa funktionen

        const results = searchInData(allData, query);
        renderResults(results);
        // Kör searchInData i vaiabeln results med query och renderResults
    });

});