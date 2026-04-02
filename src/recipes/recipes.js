let title = document.getElementById("recipes-title");
let image = document.getElementById("recipes-image");

fetch("https://xhezpykmxkacfmzmvbzp.supabase.co/rest/v1/recipes?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoZXpweWtteGthY2Ztem12YnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTc2NTYsImV4cCI6MjA5MDUzMzY1Nn0.dkMURqCsUaDlBO6zI6MpEK5ajMHvWhlq7GXbqfIMnUo")
    .then(response => response.json())
    .then(data => {
        title.innerText = data[0].title;
        image.innerHTML = `<img src="${data[0].image}" alt="${data[0].title}">`
    })
    .catch(error => console.error("Hoppsan, något gick fel:", error));










