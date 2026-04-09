// KONFIGURATION
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

// HÄMTA ALL DATA
async function getAllSearchData() {
    const [rooms, recipes] = await Promise.all([
        fetchFromSupabase("/rooms?select=*"),
        fetchFromSupabase("/recipes?select=*,recipe_problems(problems(name,areas_problems(areas(name,room_area(rooms(name))))))")
    ]);
    return { rooms, recipes };
}

// SÖK-LOGIKEN
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
                url: `category.html?room_id=${room.room_id}&room_name=${encodeURIComponent(room.name)}`
            });
        }
    });

    // --- RECEPT ---
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
                description: recipe.description,
                image: recipe.image,
                slug: recipe.slug,
                url: `recipes/recipes.html?name=${recipe.slug}`
            });
        }
    });

    return results;
}


document.addEventListener("DOMContentLoaded", async () => {
    // 1. Hämta all data från Supabase direkt
    const allData = await getAllSearchData();

    // 2. Kolla vad som står i URL:en (t.ex. ?q=badrum)
    const urlParams = new URLSearchParams(window.location.search);
    const queryFromUrl = urlParams.get('q');

    // 3. Om det finns ett sökord, kör sökningen och rita ut
    if (queryFromUrl && allData) {
        const results = searchInData(allData, queryFromUrl);
        renderResults(results);
    } else if (allData) {
        // Om man landar på sidan utan att ha sökt
        document.querySelector(".results-grid").innerHTML =
            "<p>Använd sökfältet i menyn för att hitta städtips!</p>";
    }
});

function renderResults(results) {
    const container = document.querySelector(".results-grid");
    container.innerHTML = "";

    const roomIconsSearch = {
        "kök": "fa-solid fa-kitchen-set",
        "badrum": "fa-solid fa-bath",
        "vardagsrum": "fa-solid fa-couch",
        "sovrum": "fa-solid fa-bed",
        "tvättstuga": "fa-solid fa-sink",
        "utomhus": "fa-solid fa-umbrella-beach"
    };

    results.forEach(item => {
        const div = document.createElement("div");

        if (item.type === "room") {
            div.className = "room result-card-room";
            const lookupName = item.title.toLowerCase();
            const iconClass = roomIconsSearch[lookupName] || "fa-solid fa-house";

            div.innerHTML = `
                <i class="${iconClass}"></i>
                <h3>${item.title}</h3>
                `;
        } else {
            div.className = "result-card";
            const media = item.image ? `<img src="${item.image}" alt="">` : `<div class="placeholder">🍳</div>`;

            div.innerHTML = `
                ${media}
                <div class="info">
                    <span class="label">STÄDTIPS</span>
                    <h3>${item.title}</h3>
                    ${item.description ? `<p class="result-description">${item.description}</p>` : ""}
                </div>
                `;
        }

        div.addEventListener("click", () => {
            window.location.href = item.url;
        });
        container.appendChild(div);
    });
}