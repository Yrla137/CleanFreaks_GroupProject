import { describe, it, expect } from "vitest";

describe("blog", () => {
  it("should be true", () => {
    expect(true).toBe(true);
  });

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

});