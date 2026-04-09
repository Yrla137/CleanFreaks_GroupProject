import { searchInData } from "../../src/mainPage/mainPage_logic.js";
import { renderResults } from "../../src/mainPage/mainPage_dom.js";
import { expect, describe, beforeEach, test } from "vitest";
 
describe("Integration: search + DOM", () => {
 
  beforeEach(() => {
    // Mock DOM-element för sökresultat
    document.body.innerHTML = `
      <section id="search-results" hidden>
        <div class="results-grid"></div>
      </section>
    `;
  });
 
    const mockData = {
            rooms: [
                { name: "Kök", room_id: 1 },
                { name: "Badrum", room_id: 2 }
            ],
            areas: [],
            problems: [],
            recipes: [],
            blog_posts: [],
            ingredients: [],
            tools: []
            };
 
  test("hämta all data och rendera första resultatet korrekt", () => {
 
    document.querySelector(".results-grid").innerHTML = "";
 
    const results = searchInData(mockData, "Kök");
    renderResults(results);
 
    const resultsGrid = document.querySelector(".results-grid");
    expect(resultsGrid.children.length).toBe(1);
 
    const firstResult = resultsGrid.children[0];
    expect(firstResult.querySelector("h3").textContent).toBe("Kök");
    expect(firstResult.querySelector("p").textContent).toBe("Rum");
 
    });
 
 
    test("uppdatera DOM när ett rum klickas på", () => {
    document.querySelector(".results-grid").innerHTML = "";
 
    const results = searchInData(mockData, "Kök");
    renderResults(results);
 
    const searchResult = document.querySelector("#search-results");
    const firstResult = searchResult.querySelector(".result-card");
 
    delete window.location;
    window.location = { href: "" };
    firstResult.click();
 
    expect(searchResult.hidden).toBe(false);
    expect(window.location.href).toContain("category.html?room_id=1");
    });
});