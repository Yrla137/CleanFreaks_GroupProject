export const typeLabels = {
    room: "Rum", area: "Område", problem: "Problem",
    recipe: "Recept", blog_post: "Blogg", ingredient: "Ingrediens", tool: "Verktyg"
};

const roomIconsSearch = {
    "Kök": "fa-solid fa-kitchen-set",
    "Badrum": "fa-solid fa-bath",
    "Vardagsrum": "fa-solid fa-couch",
    "Sovrum": "fa-solid fa-bed",
    "Tvättstuga": "fa-solid fa-sink",
    "Utomhus": "fa-solid fa-umbrella-beach"
};

export function searchInData(data, query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    let results = [];

    (data.rooms || []).forEach(item => {
        if (item.name.toLowerCase().includes(q)) results.push({ type: "room", title: item.name, id: item.room_id });
    });
    (data.areas || []).forEach(item => {
        if (item.name.toLowerCase().includes(q)) results.push({ type: "area", title: item.name, id: item.area_id });
    });
    (data.problems || []).forEach(item => {
        if (item.name.toLowerCase().includes(q)) results.push({ type: "problem", title: item.name, id: item.problem_id });
    });
    (data.recipes || []).forEach(item => {
        if (item.title.toLowerCase().includes(q)) results.push({ type: "recipe", title: item.title, description: item.description, id: item.recipe_id });
    });
    (data.blog_posts || []).forEach(item => {
        if (item.title.toLowerCase().includes(q)) results.push({ type: "blog_post", title: item.title, id: item.blog_post_id });
    });
    (data.ingredients || []).forEach(item => {
        if (item.name.toLowerCase().includes(q)) results.push({ type: "ingredient", title: item.name, id: item.ingredient_id });
    });
    (data.tools || []).forEach(item => {
        if (item.name.toLowerCase().includes(q)) results.push({ type: "tool", title: item.name, id: item.tool_id });
    });

    return results;
}

export { roomIconsSearch };