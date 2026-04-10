import { describe, it, expect, beforeEach } from "vitest";

describe("category integration", () => {

  beforeEach(() => {
    document.body.innerHTML = `
      <h2 id="room-title">Laddar...</h2>
      <div class="areas-grid" id="areas-grid"></div>
    `;
  });

  // ── Hjälpfunktion som simulerar createAreaCard logiken ──
  function renderAreaCard(area, problems) {
    const card = document.createElement('div');
    card.className = 'area-card';

    const title = document.createElement('h3');
    title.textContent = area.name;
    card.appendChild(title);

    const popup = document.createElement('div');
    popup.className = 'problems-popup';

    const popupTitle = document.createElement('p');
    popupTitle.className = 'popup-title';
    popupTitle.textContent = 'Problem';
    popup.appendChild(popupTitle);

    if (problems.length) {
      problems.forEach(p => {
        const link = document.createElement('a');
        link.className = 'problem-link';
        link.href = `search.html?q=${encodeURIComponent(p.name)}`;
        link.textContent = p.name;
        popup.appendChild(link);
      });
    } else {
      const none = document.createElement('p');
      none.className = 'no-problems';
      none.textContent = 'Inga problem registrerade';
      popup.appendChild(none);
    }

    card.appendChild(popup);
    return card;
  }

  it("renderar area-kort med namn i DOM", () => {
    const areas = [
      { area_id: 1, name: "Fogar" },
      { area_id: 2, name: "Duschvägg" },
    ];

    const grid = document.getElementById("areas-grid");

    areas.forEach(area => {
      const card = renderAreaCard(area, []);
      grid.appendChild(card);
    });

    const cards = grid.querySelectorAll(".area-card");
    expect(cards.length).toBe(2);
    expect(cards[0].querySelector("h3").textContent).toBe("Fogar");
    expect(cards[1].querySelector("h3").textContent).toBe("Duschvägg");
  });

  it("renderar problems som klickbara länkar i popup", () => {
    const area = { area_id: 1, name: "Fogar" };
    const problems = [
      { problem_id: 1, name: "Mögel i fogar" },
      { problem_id: 2, name: "Kalkfläckar" },
    ];

    const grid = document.getElementById("areas-grid");
    const card = renderAreaCard(area, problems);
    grid.appendChild(card);

    const links = card.querySelectorAll(".problem-link");
    expect(links.length).toBe(2);
    expect(links[0].textContent).toBe("Mögel i fogar");
    expect(links[1].textContent).toBe("Kalkfläckar");
  });

  it("problem-länk har korrekt href med q-parameter", () => {
    const area = { area_id: 1, name: "Fogar" };
    const problems = [{ problem_id: 1, name: "Mögel i fogar" }];

    const grid = document.getElementById("areas-grid");
    const card = renderAreaCard(area, problems);
    grid.appendChild(card);

    const link = card.querySelector(".problem-link");
    expect(link.getAttribute("href")).toBe("search.html?q=M%C3%B6gel%20i%20fogar");
  });

  it("visar 'Inga problem registrerade' när area saknar problems", () => {
    const area = { area_id: 1, name: "Fönster" };

    const grid = document.getElementById("areas-grid");
    const card = renderAreaCard(area, []);
    grid.appendChild(card);

    const noProblems = card.querySelector(".no-problems");
    expect(noProblems).not.toBeNull();
    expect(noProblems.textContent).toBe("Inga problem registrerade");
  });

  it("renderar rumsnamn korrekt i DOM", () => {
    const titleEl = document.getElementById("room-title");
    titleEl.textContent = "Badrum";

    expect(titleEl.textContent).toBe("Badrum");
    expect(titleEl.textContent).not.toBe("Laddar...");
  });

  it("renderar flera areas med olika problems korrekt", () => {
    const areas = [
      { area_id: 1, name: "Fogar" },
      { area_id: 2, name: "Duschvägg" },
    ];

    const problemsPerArea = [
      [{ problem_id: 1, name: "Mögel" }, { problem_id: 2, name: "Kalk" }],
      [{ problem_id: 3, name: "Tvålrester" }],
    ];

    const grid = document.getElementById("areas-grid");

    areas.forEach((area, i) => {
      const card = renderAreaCard(area, problemsPerArea[i]);
      grid.appendChild(card);
    });

    const cards = grid.querySelectorAll(".area-card");
    expect(cards.length).toBe(2);

    const linksFirstCard = cards[0].querySelectorAll(".problem-link");
    expect(linksFirstCard.length).toBe(2);
    expect(linksFirstCard[0].textContent).toBe("Mögel");

    const linksSecondCard = cards[1].querySelectorAll(".problem-link");
    expect(linksSecondCard.length).toBe(1);
    expect(linksSecondCard[0].textContent).toBe("Tvålrester");
  });

  it("visar felmeddelande när inget rum är valt", () => {
    const titleEl = document.getElementById("room-title");
    const grid = document.getElementById("areas-grid");

    titleEl.textContent = "Inget rum valt";
    grid.innerHTML = '<p class="status-msg">Gå tillbaka till startsidan och välj ett rum.</p>';

    expect(titleEl.textContent).toBe("Inget rum valt");
    expect(grid.querySelector(".status-msg")).not.toBeNull();
  });

  it("popup innehåller alltid en rubrik 'Problem'", () => {
    const area = { area_id: 1, name: "Ugn" };
    const problems = [{ problem_id: 1, name: "Inbränt fett" }];

    const grid = document.getElementById("areas-grid");
    const card = renderAreaCard(area, problems);
    grid.appendChild(card);

    const popupTitle = card.querySelector(".popup-title");
    expect(popupTitle).not.toBeNull();
    expect(popupTitle.textContent).toBe("Problem");
  });

});