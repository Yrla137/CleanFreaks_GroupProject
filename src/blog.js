import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export function createSupabaseClient() {
  return createClient(
    "https://xhezpykmxkacfmzmvbzp.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoZXpweWtteGthY2Ztem12YnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTc2NTYsImV4cCI6MjA5MDUzMzY1Nn0.dkMURqCsUaDlBO6zI6MpEK5ajMHvWhlq7GXbqfIMnUo"
  );
}

export function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("sv-SE");
}

export function getCategoryNames(post) {
  return (
    post.blog_post_categories
      ?.map((pc) => pc.blog_category?.name)
      .filter(Boolean)
      .join(", ") || "Ingen kategori"
  );
}

export function createPostHtml(post) {
  const categories = getCategoryNames(post);

  return `
    <article class="post">
      <div class="post-line">
        <strong class="post-categories">${categories}</strong>
        <span class="post-date">${formatDate(post.published_at)}</span>
      </div>
      <h1 class="post-title">${post.title ?? ""}</h1>
      <p class="post-content">${post.content ?? ""}</p>
      ${post.image ? `<img class="post-image" src="${post.image}" alt="${post.title ?? "Bloggbild"}" />` : ""}
      <div class="blog-body">
        ${post.body ?? ""}
      </div>
    </article>
  `;
}

export function renderPosts(posts, container = document.getElementById("posts")) {
  if (!container) return;

  if (!Array.isArray(posts) || posts.length === 0) {
    container.innerHTML = "<p>Inga inlägg hittades.</p>";
    return;
  }

  container.innerHTML = posts.map(createPostHtml).join("");
}

export function renderCategories(
  categories,
  {
    list = document.getElementById("category-list"),
    onAllClick,
    onCategoryClick,
  } = {}
) {
  if (!list) return;

  list.innerHTML =
    `<li><button data-id="all">Alla</button></li>` +
    categories
      .map(
        (cat) => `
          <li>
            <button data-id="${cat.blog_category_id}">
              ${cat.name}
            </button>
          </li>
        `
      )
      .join("");

  list.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const categoryId = btn.dataset.id;

      if (categoryId === "all") {
        onAllClick?.();
      } else {
        onCategoryClick?.(categoryId);
      }
    });
  });
}

export async function fetchPosts(supabase) {
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

  if (error) throw error;
  return data ?? [];
}

export async function fetchCategories(supabase) {
  const { data, error } = await supabase
    .from("blog_category")
    .select("blog_category_id, name");

  if (error) throw error;
  return data ?? [];
}

export async function fetchPostsByCategory(supabase, categoryId) {
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

  if (error) throw error;
  return data ?? [];
}

export async function loadPosts({
  supabase,
  container = document.getElementById("posts"),
} = {}) {
  try {
    const posts = await fetchPosts(supabase);
    renderPosts(posts, container);
  } catch (error) {
    console.error(error);
    if (container) {
      container.innerHTML = "<p>Kunde inte hämta data</p>";
    }
  }
}

export async function filterPosts({
  supabase,
  categoryId,
  container = document.getElementById("posts"),
} = {}) {
  try {
    const posts = await fetchPostsByCategory(supabase, categoryId);
    renderPosts(posts, container);
  } catch (error) {
    console.error("Filter error:", error);
    if (container) {
      container.innerHTML = "<p>Kunde inte filtrera inlägg</p>";
    }
  }
}

export async function loadCategories({
  supabase,
  list = document.getElementById("category-list"),
  container = document.getElementById("posts"),
} = {}) {
  try {
    const categories = await fetchCategories(supabase);

    renderCategories(categories, {
      list,
      onAllClick: () => loadPosts({ supabase, container }),
      onCategoryClick: (categoryId) =>
        filterPosts({ supabase, categoryId, container }),
    });
  } catch (error) {
    console.error("Kategori-fel:", error);
  }
}

export async function initBlog({
  supabase = createSupabaseClient(),
  postsContainer = document.getElementById("posts"),
  categoryList = document.getElementById("category-list"),
} = {}) {
  await loadPosts({
    supabase,
    container: postsContainer,
  });

  await loadCategories({
    supabase,
    list: categoryList,
    container: postsContainer,
  });
}

initBlog();