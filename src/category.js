// Din specifika anslutning
const supabaseUrl = 'https://xhezpykmxkacfmzmvbzp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoZXpweWtteGthY2Ztem12YnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTc2NTYsImV4cCI6MjA5MDUzMzY1Nn0.dkMURqCsUaDlBO6zI6MpEK5ajMHvWhlq7GXbqfIMnUo';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Denna körs så fort sidan laddas
document.addEventListener('DOMContentLoaded', () => {
    console.log("Kategorisidan laddad - hämtar data...");
    displayAllRooms();
});

// STEG 1: Hämta och visa alla rum (Badrum, Kök, etc.) [cite: 72, 125]
async function displayAllRooms() {
    const { data: rooms, error } = await _supabase
        .from('rooms')
        .select('*');

    if (error) {
        console.error("Kunde inte hämta rum:", error);
        return;
    }

    const container = document.getElementById('category-content'); 
    container.innerHTML = '<h2>Välj ett rum</h2>';
    
    const grid = document.createElement('div');
    grid.className = 'category-grid'; // Styling fixar vi i CSS

    rooms.forEach(room => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `<h3>${room.name}</h3>`;
        
        // Vid klick går vi till STEG 2 [cite: 83, 84]
        card.onclick = () => displayAreasForRoom(room.id, room.name);
        
        grid.appendChild(card);
    });
    
    container.appendChild(grid);
}

// STEG 2: Visa objekt i valt rum [cite: 4, 73]
async function displayAreasForRoom(roomId, roomName) {
    const { data, error } = await _supabase
        .from('room_area')
        .select(`
            areas (
                area_id,
                name
            )
        `)
        .eq('room_id', roomId);

    if (error) return console.error(error);

    const container = document.getElementById('category-content');
    container.innerHTML = `<h2>Objekt i ${roomName}</h2>`;
    
    const backBtn = document.createElement('button');
    backBtn.innerText = "← Tillbaka till rum";
    backBtn.onclick = displayAllRooms;
    container.appendChild(backBtn);

    const grid = document.createElement('div');
    grid.className = 'category-grid';

    data.forEach(item => {
        const area = item.areas;
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `<h3>${area.name}</h3>`;
        
        // Här sparar vi klicket för nästa steg: Problem! [cite: 23, 137]
        card.onclick = () => console.log("Hämta problem för: " + area.name);
        
        grid.appendChild(card);
    });
    
    container.appendChild(grid);
}