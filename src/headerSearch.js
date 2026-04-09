// headerSearch.js - Inkludera denna på ALLA sidor via <script> i headern/footern
document.addEventListener("DOMContentLoaded", () => {
    const headerSearchInput = document.querySelector("#search-input"); // Kollegans ID

    if (headerSearchInput) {
        headerSearchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                const query = headerSearchInput.value.trim();
                if (query) {
                    // Skicka användaren till sök-sidan med sökordet i URL:en
                    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
                }
            }
        });
    }
});