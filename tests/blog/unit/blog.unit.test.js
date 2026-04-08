import { describe, it, expect } from "vitest";

describe("blog unit", () => {
  it("skapar korrekt kategoristräng", () => {
    const input = [
      { blog_category: { name: "Städning" } },
      { blog_category: { name: "Tips" } }
    ];

    const result = input
      .map(pc => pc.blog_category?.name)
      .filter(Boolean)
      .join(", ");

    expect(result).toBe("Städning, Tips");
  });

  it('returnerar tom sträng om inga kategorier finns', () => {
    const input = [];

    const result = input
      .map(pc => pc.blog_category?.name)
      .filter(Boolean)
      .join(", ");

    expect(result).toBe("");
  });

  it("ignorerar kategorier utan namn", () => {
    const input = [
      { blog_category: { name: "Städning" } },
      { blog_category: null },
      {},
      { blog_category: { name: "Tips" } }
    ];

    const result = input
      .map(pc => pc.blog_category?.name)
      .filter(Boolean)
      .join(", ");

    expect(result).toBe("Städning, Tips");
  });
});