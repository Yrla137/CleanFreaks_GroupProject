const SUPABASE_URL = 'https://xhezpykmxkacfmzmvbzp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoZXpweWtteGthY2Ztem12YnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTc2NTYsImV4cCI6MjA5MDUzMzY1Nn0.dkMURqCsUaDlBO6zI6MpEK5ajMHvWhlq7GXbqfIMnUo';

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`
};

async function fetchJSON(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function getRoomIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('room_id');
}

async function init() {
  const roomId = getRoomIdFromURL();
  const titleEl = document.getElementById('room-title');
  const grid = document.getElementById('areas-grid');

  if (!roomId) {
    titleEl.textContent = 'Inget rum valt';
    grid.innerHTML = '<p class="status-msg">Gå tillbaka till startsidan och välj ett rum.</p>';
    return;
  }

  try {
    const rooms = await fetchJSON(
      `${SUPABASE_URL}/rest/v1/rooms?select=name&room_id=eq.${roomId}`
    );

    if (!rooms.length) {
      titleEl.textContent = 'Rum hittades ej';
      grid.innerHTML = '<p class="status-msg">Det valda rummet finns inte i databasen.</p>';
      return;
    }

    titleEl.textContent = rooms[0].name;
    await loadAreas(roomId, grid);

  } catch (err) {
    titleEl.textContent = 'Fel uppstod';
    grid.innerHTML = `<p class="status-msg">Kunde inte ladda data: ${err.message}</p>`;
  }
}

async function loadAreas(roomId, grid) {
  try {
    const roomAreas = await fetchJSON(
      `${SUPABASE_URL}/rest/v1/room_area?select=area_id&room_id=eq.${roomId}`
    );

    if (!roomAreas.length) {
      grid.innerHTML = '<p class="status-msg">Inga areas hittades för detta rum.</p>';
      return;
    }

    const areaIds = roomAreas.map(r => r.area_id);

    const areas = await fetchJSON(
      `${SUPABASE_URL}/rest/v1/areas?select=area_id,name&area_id=in.(${areaIds.join(',')})&order=name`
    );

    grid.innerHTML = '';

    const problemsPerArea = await Promise.all(
      areas.map(area => fetchProblemsForArea(area.area_id))
    );

    areas.forEach((area, i) => {
      const card = createAreaCard(area, problemsPerArea[i]);
      grid.appendChild(card);
    });

  } catch (err) {
    grid.innerHTML = `<p class="status-msg">Fel vid hämtning av areas: ${err.message}</p>`;
  }
}

async function fetchProblemsForArea(areaId) {
  try {
    const links = await fetchJSON(
      `${SUPABASE_URL}/rest/v1/areas_problems?select=problem_id&area_id=eq.${areaId}`
    );

    if (!links.length) return [];

    const problemIds = links.map(l => l.problem_id);

    // Hämta problem_id OCH name så vi kan länka vidare
    return await fetchJSON(
      `${SUPABASE_URL}/rest/v1/problems?select=problem_id,name&problem_id=in.(${problemIds.join(',')})&order=name`
    );
  } catch {
    return [];
  }
}

function createAreaCard(area, problems) {
  const card = document.createElement('div');
  card.className = 'area-card';

  // Z-index fix – popup hamnar inte bakom andra kort
  card.addEventListener('mouseenter', () => { card.style.zIndex = '200'; });
  card.addEventListener('mouseleave', () => { card.style.zIndex = ''; });

  const title = document.createElement('h3');
  title.textContent = area.name;
  card.appendChild(title);

  const popup = document.createElement('div');
  popup.className = 'problems-popup';

  const popupTitle = document.createElement('p');
  popupTitle.className = 'popup-title';
  popupTitle.textContent = 'Problem';
  popup.appendChild(popupTitle);

  if (problems.length) {
    problems.forEach(p => {
      // Varje problem är nu en klickbar länk till recipes.html
      const link = document.createElement('a');
      link.className = 'problem-link';
      link.href = `recipes.html?problem_id=${p.problem_id}`;
      link.textContent = p.name;
      popup.appendChild(link);
    });
  } else {
    const none = document.createElement('p');
    none.className = 'no-problems';
    none.textContent = 'Inga problem registrerade';
    popup.appendChild(none);
  }

  card.appendChild(popup);
  return card;
}

init();