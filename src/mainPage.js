
document.addEventListener("DOMContentLoaded", () => {
  
   // BAS-URL TILL SUPABASE //
  const SUPABASE_URL = "https://xhezpykmxkacfmzmvbzp.supabase.co/rest/v1";

    // PUBLIC/ANON KEY //
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoZXpweWtteGthY2Ztem12YnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTc2NTYsImV4cCI6MjA5MDUzMzY1Nn0.dkMURqCsUaDlBO6zI6MpEK5ajMHvWhlq7GXbqfIMnUo";


  // GENERELL FETCH-FUNKTION //

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
  }

  // TABELL-FÖR-TABELL-FUNKTIONER //

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
     // Väntar tills ALLA anrop är klara med Promise.all.
     // Istället för exmeplvis:
    // const rooms = await getRooms();
    // const areas = await getAreas();
    // Arrayen packas upp i variabler i samma ordning. Exempelvis rooms -> getRooms().
    const [rooms, areas, problems, recipes, blog_posts, ingredients, tools] = await Promise.all([
        getRooms(),
        getAreas(),
        getProblems(),
        getRecipes(),
        getBlogPosts(),
        getIngredients(),
        getTools()
    ]);
    // Packar allt till ett objekt med return.
     return {
    rooms,
    areas,
    problems,
    recipes,
    blog_posts,
    ingredients,
    tools
    };
    // Resultatet blir {
        // rooms: [...],
        // areas: [...],
        // problems: [...],
        // recipes: [...]
    }

    getAllSearchData().then(data => {
    console.log("ALL DATA:", data);
    });


function searchInData(data, query) {
    // data = det från getAllSearchData()
    // query är en parameter (input till funktionen)
    const q = query.trim().toLowerCase();
  // query = det användaren skriver i sökfältet
  // q = samma sak som query, bara i små bokstäver
  // trim()	tar bort mellanslag i början/slutet
  // toLowerCase() gör allt till små bokstäver

  if (!q) return [];
  // Om användaren inte skriver något ska inte massa resultat komma upp.

//   Du bestämmer vad query är när du anropar funktionen:
// searchInData(data, "badrum")
// 👉 Då blir:
// query = "badrum"
// q = "badrum"

  let results = [];
  // Här ska datan läggas in / sparas
  // Vi skapar en varibel som vi kallar results som blir en tom array


// Här Loppas alla arrayer med data igenom.
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

//   Tänk så här:

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
    if (item.title.toLowerCase().includes(q)){
        results.push({
            type: "blog_post",
            title: item.title,
            id: item.blog_post_id
        });
    }
  });

  // Ingredients
  (data.ingredients || []).forEach(item => {
    if(item.name.toLowerCase().includes(q)){
        results.push({
            type: "ingredient",
            title: item.name,
            id: item.ingredient_id
        });
    }
  });

  // Tools
  (data.tools || []).forEach(item => {
    if(item.name.toLowerCase().includes(q)){
        results.push({
            type: "tool",
            title: item.name,
            id: item.tool_id
        });
    }
  });

    // Returnerar resultatet
    // Exempel resultat:
    // [
    //   { type: "room", title: "Kök", id: 1 },
    //   { type: "area", title: "Spis", id: 3 }
    // ]
    return results;

}


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

  if (!allData) return;
// SÄKERHETSCHECK! Om API inte är klart → gör inget

  const results = searchInData(allData, query);

  // Kallar på funktionen renderResults som bygger upp ett synligt sökresultat
  renderResults(results);

    });


const resultsSection = document.querySelector("#search-results");
// Hela sektionen (för att visa/dölja)
const resultsContainer = document.querySelector(".results-grid");
// Där vi stoppar resultaten

// Skapas för att kunna använda typeLables i renderResults och visa sökresultaten på följande sätt
const typeLabels = {
  room: "Rum",
  area: "Område",
  problem: "Problem",
  recipe: "Recept",
  blog_post: "Blogg",
  ingredient: "Ingrediens",
  tool: "Verktyg"
};

// Skapas för att kunna använda roomIcons i renderResults och visa ikonerna i sökresultaten
const roomIcons = {
  "Kök": "fa-solid fa-kitchen-set",
  "Badrum": "fa-solid fa-bath",
  "Vardagsrum": "fa-solid fa-couch",
  "Sovrum": "fa-solid fa-bed",
  "Tvättstuga": "fa-solid fa-sink",
  "Utomhus": "fa-solid fa-umbrella-beach"
};


// RENDER FUNKTION //
function renderResults(results) {

  // Tömmer tidigare resultat
  resultsContainer.innerHTML = "";

  // Om inga resultat return "Inga resultat"
  if (results.length === 0) {
    resultsContainer.innerHTML = "<p>Inga resultat</p>";
    resultsSection.hidden = false;
    return;
  }

  // Loopar igenom resultat och visar reultat om resultat finns
  results.forEach(item => {

    const div = document.createElement("div");
    div.classList.add("result-card");

    let icon = "";
    if (item.type === "room") {
    const iconClass = roomIcons[item.title];

    if (iconClass) {
        icon = `<i class="${iconClass}"></i>`;
    }
    }

    // Skapar innehållet och visar bara description om det finns
    div.innerHTML = `
        ${icon}
        <h3>${item.title}</h3>
        <p>${typeLabels[item.type]}</p>
        ${item.description ? `<p>${item.description}</p>` : ""}
    `;

    // Lägg in innhållet i DOM
    resultsContainer.appendChild(div);
  });

  // Visar sektionen genom att ta bort "hidden" effekten
  resultsSection.hidden = false;
  }

});