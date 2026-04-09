// KONFIGURATION
const SUPABASE_URL = "https://xhezpykmxkacfmzmvbzp.supabase.co/rest/v1";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoZXpweWtteGthY2Ztem12YnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTc2NTYsImV4cCI6MjA5MDUzMzY1Nn0.dkMURqCsUaDlBO6zI6MpEK5ajMHvWhlq7GXbqfIMnUo";

// 1. HJÄLPFUNKTION FÖR API
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

// 2. HÄMTA ALL DATA
async function getAllSearchData() {
    const [rooms, recipes, areas] = await Promise.all([
        fetchFromSupabase("/rooms?select=*"),
        fetchFromSupabase("/recipes?select=*,recipe_problems(problems(name,areas_problems(areas(name,room_area(rooms(room_id,name))))))"),
        fetchFromSupabase("/areas?select=*,room_area(rooms(room_id,name))")
    ]);
    return { rooms, recipes, areas };
}

// 3. SÖK-LOGIKEN 
function searchInData(data, query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    let results = [];

    // --- RUM & AREAS ---
    (data.rooms || []).forEach(room => {
        const roomMatch = room.name.toLowerCase().includes(q);
        const areaMatch = (data.areas || []).some(area => {
            const nameMatch = area.name.toLowerCase().includes(q);
            const belongsToRoom = Array.isArray(area.room_area) && area.room_area.some(ra =>
                ra.rooms && ra.rooms.room_id === room.room_id
            );
            return nameMatch && belongsToRoom;
        });

        if (roomMatch || areaMatch) {
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
        const textMatch = recipe.title?.toLowerCase().includes(q) || recipe.description?.toLowerCase().includes(q);
        let deepMatch = false;

        if (Array.isArray(recipe.recipe_problems)) {
            recipe.recipe_problems.forEach(rp => {
                // Problem-namn
                if (rp.problems?.name?.toLowerCase().includes(q)) deepMatch = true;

                if (Array.isArray(rp.problems?.areas_problems)) {
                    rp.problems.areas_problems.forEach(ap => {
                        // Area-namn
                        if (ap.areas?.name?.toLowerCase().includes(q)) deepMatch = true;

                        // Rums-namn via receptet
                        if (Array.isArray(ap.areas?.room_area)) {
                            ap.areas.room_area.forEach(ra => {
                                if (ra.rooms?.name?.toLowerCase().includes(q)) deepMatch = true;
                            });
                        }
                    });
                }
            });
        }

        if (textMatch || deepMatch) {
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

    return results.filter((v, i, a) => a.findIndex(t => t.url === v.url) === i);
}

// 4. RENDERA RESULTAT
function renderResults(results) {
    const container = document.querySelector(".results-grid");
    if (!container) return;
    container.innerHTML = "";

    const roomIconsSearch = {
        "kök": "fa-solid fa-kitchen-set",
        "badrum": "fa-solid fa-bath",
        "vardagsrum": "fa-solid fa-couch",
        "sovrum": "fa-solid fa-bed",
        "tvättstuga": "fa-solid fa-sink",
        "utomhus": "fa-solid fa-umbrella-beach"
    };

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

    container.style.display = "grid";

    results.forEach(item => {
        const div = document.createElement("div");
        if (item.type === "room") {
            div.className = "room result-card-room";
            const iconClass = roomIconsSearch[item.title.toLowerCase()] || "fa-solid fa-house";
            div.innerHTML = `<i class="${iconClass}"></i><span>${item.title}</span>`;
        } else {
            div.className = "result-card";
            const media = item.image ? `<img src="${item.image}" alt="">` : `<div class="placeholder">🍳</div>`;
            div.innerHTML = `
                ${media}
                <div class="info">
                    <span class="label">RECEPT</span>
                    <h3>${item.title}</h3>
                    ${item.description ? `<p class="result-description">${item.description}</p>` : ""}
                </div>`;
        }
        div.addEventListener("click", () => { window.location.href = item.url; });
        container.appendChild(div);
    });
}

// 5. STARTPUNKT
document.addEventListener("DOMContentLoaded", async () => {
    /* global loader */
    if (typeof loader !== 'undefined') loader.show();

    const allData = await getAllSearchData();

    if (typeof loader !== 'undefined') loader.hide();

    if (!allData) return;

    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    const titleElement = document.getElementById("search-title");

    if (query) {
        if (titleElement) titleElement.innerText = `Resultat för: "${query}"`;
        const results = searchInData(allData, query);
        renderResults(results);
    } else {
        if (titleElement) titleElement.innerText = "Sök efter städtips";
        const grid = document.querySelector(".results-grid");
        if (grid) grid.innerHTML = "<p>Börja skriva i fältet ovan!</p>";
    }
});