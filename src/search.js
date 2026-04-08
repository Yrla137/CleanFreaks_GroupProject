// KONFIGURATION (Samma som din kollegas)
const SUPABASE_URL = "https://xhezpykmxkacfmzmvbzp.supabase.co/rest/v1";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoZXpweWtteGthY2Ztem12YnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTc2NTYsImV4cCI6MjA5MDUzMzY1Nn0.dkMURqCsUaDlBO6zI6MpEK5ajMHvWhlq7GXbqfIMnUo";

// HJÄLPFUNKTION FÖR API
async function fetchFromSupabase(endpoint) {
    try {
        const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
            headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
        });
        return await response.json();
    } catch (error) {
        console.error("Fel vid API-anrop:", error);
        return null;
    }
}

// HÄMTA ALL DATA (Precis som på startsidan)
async function getAllSearchData() {
    const [rooms, recipes] = await Promise.all([
        fetchFromSupabase("/rooms?select=*"),
        // Här använder vi din djupa URL för att få med alla kopplingar ner till rumsnivå
        fetchFromSupabase("/recipes?select=*,recipe_problems(problems(name,areas_problems(areas(name,room_area(rooms(name))))))")
    ]);
    return { rooms, recipes };
}

// SÖK-LOGIKEN (Återanvänd)
function searchInData(data, query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    let results = [];

    // --- RUM ---
    (data.rooms || []).forEach(room => {
        if (room.name.toLowerCase().includes(q)) {
            results.push({
                type: "room",
                title: room.name,
                id: room.room_id,
                // URL-format: category.html?type=room&id=1&title=Kök
                url: `category.html?type=room&id=${room.room_id}&title=${encodeURIComponent(room.name)}`
            });
        }
    });

    // --- RECEPT (Bred sökning inkl. rumskoppling) ---
    (data.recipes || []).forEach(recipe => {
        // Kolla titel/beskrivning
        const textMatch = recipe.title?.toLowerCase().includes(q) || recipe.description?.toLowerCase().includes(q);

        // Kolla om rummet matchar inuti relationsträdet
        let roomMatch = false;
        if (recipe.recipe_problems) {
            roomMatch = recipe.recipe_problems.some(rp =>
                rp.problems?.areas_problems?.some(ap =>
                    ap.areas?.room_area?.some(ra =>
                        ra.rooms?.name?.toLowerCase().includes(q)
                    )
                )
            );
        }

        if (textMatch || roomMatch) {
            results.push({
                type: "recipe",
                title: recipe.title,
                image: recipe.image,
                slug: recipe.slug,
                // URL-format: src/recipes/recipes.html?name=slug
                url: `src/recipes/recipes.html?name=${recipe.slug}`
            });
        }
    });

    return results;
}
// --- STARTA SÖKNINGEN ---
document.addEventListener("DOMContentLoaded", async () => {
    const resultsContainer = document.querySelector(".results-grid");
    const searchInput = document.querySelector("#search-input");
    const searchForm = document.querySelector(".search-form");

    // 1. Hämta all data
    const allData = await getAllSearchData();

    // 2. Kolla URL (?q=ugn-bikarbonat)
    const urlParams = new URLSearchParams(window.location.search);
    const queryFromUrl = urlParams.get('q');

    if (queryFromUrl && allData) {
        if (searchInput) searchInput.value = queryFromUrl;
        const results = searchInData(allData, queryFromUrl);
        renderResults(results);
    }

    // 3. Lyssna på nya sökningar på denna sida
    if (searchForm) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const newQuery = searchInput.value;
            const results = searchInData(allData, newQuery);
            renderResults(results);
            // Uppdatera URL utan omladdning
            history.pushState(null, "", `?q=${encodeURIComponent(newQuery)}`);
        });
    }

    function renderResults(results) {
        const container = document.querySelector(".results-grid");
        container.innerHTML = "";

        results.forEach(item => {
            const div = document.createElement("div");
            div.className = "result-card";

            // Visa bild för recept, kanske en ikon för rum?
            const media = item.image ? `<img src="${item.image}" alt="">` : `<div class="room-placeholder">🏠</div>`;

            div.innerHTML = `
            ${media}
            <div class="info">
                <span class="label">${item.type === 'room' ? 'RUM' : 'RECEPT'}</span>
                <h3>${item.title}</h3>
            </div>
        `;

            // Klick-eventet använder den URL vi byggde i sökfunktionen
            div.addEventListener("click", () => {
                window.location.href = item.url;
            });

            container.appendChild(div);
        });
    }
});