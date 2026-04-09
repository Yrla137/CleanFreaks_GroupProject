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
    const allData = await getAllSearchData();
    if (!allData) return;

    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    const titleElement = document.getElementById("search-title");

    if (query && allData) {
        titleElement.innerText = `Resultat för: "${query}"`;

        const results = searchInData(allData, query);
        renderResults(results);
    } else {
        titleElement.innerText = "Sök efter städtips";
        document.querySelector(".results-grid").innerHTML = "<p>Börja skriva i fältet ovan!</p>";
    }
});

function renderResults(results) {
    const container = document.querySelector(".results-grid");
    container.innerHTML = "";

    // Din ikon-mappning för rummen
    const roomIconsSearch = {
        "kök": "fa-solid fa-kitchen-set",
        "badrum": "fa-solid fa-bath",
        "vardagsrum": "fa-solid fa-couch",
        "sovrum": "fa-solid fa-bed",
        "tvättstuga": "fa-solid fa-sink",
        "utomhus": "fa-solid fa-umbrella-beach"
    };

    // 1. KOLLA OM DET FINNS RESULTAT
    if (results.length === 0) {
        container.innerHTML = `
            <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <i class="fa-regular fa-face-frown" style="font-size: 3rem; color: var(--dark-blue); margin-bottom: 1rem;"></i>
                <p>Hoppsan! Vi hittade inget som matchade din sökning.</p>
                <p>Prova att söka på något annat, t.ex. "Kök", "Ättika" eller "Bikarbonat".</p>
            </div>
        `;
        container.style.display = "block";
        return;
    }

    // 2. Återställ till Grid om vi har resultat
    container.style.display = "grid";

    // 3. RITA UT RESULTATEN
    results.forEach(item => {
        const div = document.createElement("div");

        if (item.type === "room") {
            // RUM-utseende (samma som startsidan)
            div.className = "room result-card-room";
            const lookupName = item.title.toLowerCase();
            const iconClass = roomIconsSearch[lookupName] || "fa-solid fa-house";

            div.innerHTML = `
                <i class="${iconClass}"></i>
                <span>${item.title}</span>
            `;
        } else {
            // RECEPT-utseende
            div.className = "result-card";
            const media = item.image ? `<img src="${item.image}" alt="">` : `<div class="placeholder">🍳</div>`;

            div.innerHTML = `
                ${media}
                <div class="info">
                    <span class="label">RECEPT</span>
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