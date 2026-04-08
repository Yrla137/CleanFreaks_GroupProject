// src/api.js

// Bas-URL till Supabase
const SUPABASE_URL = "https://xhezpykmxkacfmzmvbzp.supabase.co/rest/v1";
// Public/anon key
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoZXpweWtteGthY2Ztem12YnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTc2NTYsImV4cCI6MjA5MDUzMzY1Nn0.dkMURqCsUaDlBO6zI6MpEK5ajMHvWhlq7GXbqfIMnUo";

// FETCH-FUNKTION
export async function fetchFromSupabase(endpoint) {
    try {
        const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
            headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
        });

        if (!response.ok) throw new Error(`API-fel: ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error("Fel vid API-anrop:", error);
        return null;
    }
}

// Tabeller
export const getRooms = () => fetchFromSupabase("/rooms?select=*");
export const getAreas = () => fetchFromSupabase("/areas?select=*");
export const getProblems = () => fetchFromSupabase("/problems?select=*");
export const getRecipes = () => fetchFromSupabase("/recipes?select=*");
export const getBlogPosts = () => fetchFromSupabase("/blog_posts?select=*");
export const getIngredients = () => fetchFromSupabase("/ingredients?select=*");
export const getTools = () => fetchFromSupabase("/tools?select=*");

// Hämtar all data samtidigt
export async function getAllSearchData() {
    const [rooms, areas, problems, recipes, blog_posts, ingredients, tools] =
        await Promise.all([
            getRooms(),
            getAreas(),
            getProblems(),
            getRecipes(),
            getBlogPosts(),
            getIngredients(),
            getTools()
        ]);

    return { rooms, areas, problems, recipes, blog_posts, ingredients, tools };
}