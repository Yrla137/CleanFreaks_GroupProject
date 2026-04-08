  import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

  const supabase = createClient(
    "https://xhezpykmxkacfmzmvbzp.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoZXpweWtteGthY2Ztem12YnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTc2NTYsImV4cCI6MjA5MDUzMzY1Nn0.dkMURqCsUaDlBO6zI6MpEK5ajMHvWhlq7GXbqfIMnUo"
  );

  /* test push */

  async function loadPosts() {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(`
        blog_post_id,
        title,
        content,
        image,
        body,
        slug,
        published_at,
        blog_post_categories (
          blog_category (
            blog_category_id,
            name
          )
        )
      `);

    if (error) {
      console.error(error);
      document.getElementById("posts").innerHTML =
        "<p>Kunde inte hämta data</p>";
      return;
    }

    renderPosts(data);
  }


  function renderPosts(posts) {
    const container = document.getElementById("posts");

    container.innerHTML = posts.map(post => {
      const categories = post.blog_post_categories
        ?.map(pc => pc.blog_category?.name)
        .filter(Boolean)
        .join(", ") || "Ingen kategori";

      return `
        <article class="post">
        <div class="post-line">
         <strong class="post-categories">${categories}</strong>
         <span class="post-date">${new Date(post.published_at).toLocaleDateString("sv-SE")}</span>
        </div>
          <h1 class="post-title">${post.title}</h1>
          <p class="post-content">${post.content}</p>
          ${post.image ? `<img class="post-image" src="${post.image}" />` : ""}
<div class="blog-body">
      ${post.body ?? ""}
    </div>          
        </article>
      `;
    }).join("");
  }

  async function loadCategories() {
  const { data, error } = await supabase
    .from("blog_category")
    .select("blog_category_id, name");

  if (error) {
    console.error("Kategori-fel:", error);
    return;
  }

  renderCategories(data);
}

function renderCategories(categories) {
  const list = document.getElementById("category-list");

  list.innerHTML = `
    <li><button data-id="all">Alla</button></li>
  ` + categories.map(cat => `
    <li>
      <button data-id="${cat.blog_category_id}">
        ${cat.name}
      </button>
    </li>
  `).join("");

  document.querySelectorAll("#category-list button").forEach(btn => {
    btn.addEventListener("click", () => {
      const categoryId = btn.dataset.id;

      if (categoryId === "all") {
        loadPosts();
      } else {
        filterPosts(categoryId);
      }
    });
  });
}

async function filterPosts(categoryId) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      blog_post_id,
      title,
      content,
      image,
      body,
      slug,
      published_at,
      blog_post_categories!inner (
        blog_category_id,
        blog_category (
          name
        )
      )
    `)
    .eq("blog_post_categories.blog_category_id", categoryId);

  if (error) {
    console.error("Filter error:", error);
    return;
  }

}

  loadPosts();
  loadCategories();
