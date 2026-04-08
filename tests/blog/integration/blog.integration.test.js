import { describe, it, expect, beforeEach } from "vitest";

describe("blog integration", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="posts"></div>`;
  });

  it("renderar blogginlägg i DOM", () => {
    const blogPosts = [
      {
        title: "Test Blog Post",
        content: "This is a test blog post.",
        image: "test.jpg",
        body: "This is the body of the test blog post.",
        published_at: "2024-06-01T12:00:00Z",
        blog_post_categories: [
          { blog_category: { name: "Test Category" } }
        ]
      }
    ];

    const container = document.getElementById("posts");

    // Simulerar integration: data + rendering + DOM
    const html = blogPosts.map(post => {
      const categories = post.blog_post_categories
        ?.map(pc => pc.blog_category?.name)
        .filter(Boolean)
        .join(", ") || "Ingen kategori";

      return `
        <article>
          <h1>${post.title}</h1>
          <span>${categories}</span>
        </article>
      `;
    }).join("");

    container.innerHTML = html;

    expect(container.querySelector("h1").textContent).toBe("Test Blog Post");
    expect(container.textContent).toContain("Test Category");
  });
});