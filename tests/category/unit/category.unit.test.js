import { describe, it, expect } from "vitest";

describe("category unit", () => {

  // ── Bygger search-länk ──
  it("skapar korrekt search-länk med q-parameter", () => {
    const problem = { problem_id: 1, name: "Mögel i fogar" };
    const href = `search.html?q=${encodeURIComponent(problem.name)}`;

    expect(href).toBe("search.html?q=M%C3%B6gel%20i%20fogar");
  });

  it("skapar korrekt search-länk för enkla ord utan specialtecken", () => {
    const problem = { problem_id: 2, name: "Kalk" };
    const href = `search.html?q=${encodeURIComponent(problem.name)}`;

    expect(href).toBe("search.html?q=Kalk");
  });

  it("hanterar problemnamn med mellanslag korrekt i URL", () => {
    const problem = { problem_id: 3, name: "Inbränt fett" };
    const href = `search.html?q=${encodeURIComponent(problem.name)}`;

    expect(href).toContain("q=");
    expect(href).not.toContain(" ");
  });

  // ── Extraherar area_ids från room_area ──
  it("extraherar area_ids korrekt från room_area data", () => {
    const roomAreas = [
      { area_id: 1 },
      { area_id: 2 },
      { area_id: 3 },
    ];

    const areaIds = roomAreas.map(r => r.area_id);

    expect(areaIds).toEqual([1, 2, 3]);
    expect(areaIds.length).toBe(3);
  });

  it("returnerar tom array om inga areas finns", () => {
    const roomAreas = [];
    const areaIds = roomAreas.map(r => r.area_id);

    expect(areaIds).toEqual([]);
    expect(areaIds.length).toBe(0);
  });

  // ── Extraherar problem_ids från areas_problems ──
  it("extraherar problem_ids korrekt från areas_problems data", () => {
    const links = [
      { problem_id: 5 },
      { problem_id: 11 },
      { problem_id: 14 },
    ];

    const problemIds = links.map(l => l.problem_id);

    expect(problemIds).toEqual([5, 11, 14]);
  });

  it("returnerar tom array om inga problems finns för en area", () => {
    const links = [];
    const problemIds = links.map(l => l.problem_id);

    expect(problemIds).toEqual([]);
  });

  // ── Bygger in()-sträng för Supabase-query ──
  it("bygger korrekt in()-sträng för Supabase från ids", () => {
    const ids = [1, 2, 3];
    const query = `problem_id=in.(${ids.join(",")})`;

    expect(query).toBe("problem_id=in.(1,2,3)");
  });

  it("hanterar ett enda id korrekt i in()-sträng", () => {
    const ids = [7];
    const query = `area_id=in.(${ids.join(",")})`;

    expect(query).toBe("area_id=in.(7)");
  });

  // ── Hanterar rum-id från URL ──
  it("läser room_id korrekt från URL-sträng", () => {
    const url = "category.html?room_id=3";
    const params = new URLSearchParams(url.split("?")[1]);

    expect(params.get("room_id")).toBe("3");
  });

  it("returnerar null om room_id saknas i URL", () => {
    const url = "category.html";
    const params = new URLSearchParams(url.split("?")[1]);

    expect(params.get("room_id")).toBeNull();
  });

});