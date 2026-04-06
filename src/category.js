const SUPABASE_URL = 'https://xhezpykmxkacfmzmvbzp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoZXpweWtteGthY2Ztem12YnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTc2NTYsImV4cCI6MjA5MDUzMzY1Nn0.dkMURqCsUaDlBO6zI6MpEK5ajMHvWhlq7GXbqfIMnUo';

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`
};

// ── Hjälpfunktion för fetch ──
async function fetchJSON(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ── Hämta alla rum och bygg tabs ──
async function loadRooms() {
  const tabsEl = document.getElementById('room-tabs');

  try {
    const rooms = await fetchJSON(
      `${SUPABASE_URL}/rest/v1/rooms?select=room_id,name&order=name`
    );

    tabsEl.innerHTML = '';

    if (!rooms.length) {
      tabsEl.innerHTML = '<p class="status-msg">Inga rum hittades i databasen.</p>';
      return;
    }

    rooms.forEach((room, i) => {
      const btn = document.createElement('button');
      btn.className = 'room-tab' + (i === 0 ? ' active' : '');
      btn.textContent = room.name;
      btn.dataset.roomId = room.room_id;
      btn.addEventListener('click', () => selectRoom(room.room_id, room.name, btn));
      tabsEl.appendChild(btn);
    });

    // Välj första rummet automatiskt
    selectRoom(rooms[0].room_id, rooms[0].name, tabsEl.querySelector('.room-tab'));

  } catch (err) {
    tabsEl.innerHTML = `<p class="status-msg">Kunde inte ladda rum: ${err.message}</p>`;
  }
}

// ── Välj ett rum → uppdatera titel och ladda areas ──
function selectRoom(roomId, roomName, clickedBtn) {
  document.querySelectorAll('.room-tab').forEach(b => b.classList.remove('active'));
  clickedBtn.classList.add('active');

  const titleSection = document.getElementById('room-title-section');
  titleSection.style.display = 'block';
  document.getElementById('room-title-text').innerHTML = `<span>${roomName}</span>`;

  loadAreas(roomId);
}

// ── Hämta areas kopplade till valt rum ──
async function loadAreas(roomId) {
  const grid = document.getElementById('areas-grid');
  grid.innerHTML = '<div class="spinner"></div>';

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

    // Hämta problems för alla areas parallellt
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

// ── Hämta problems kopplade till en area ──
async function fetchProblemsForArea(areaId) {
  try {
    const links = await fetchJSON(
      `${SUPABASE_URL}/rest/v1/areas_problems?select=problem_id&area_id=eq.${areaId}`
    );

    if (!links.length) return [];

    const problemIds = links.map(l => l.problem_id);

    const problems = await fetchJSON(
      `${SUPABASE_URL}/rest/v1/problems?select=problem_id,name&problem_id=in.(${problemIds.join(',')})&order=name`
    );

    return problems;
  } catch {
    return [];
  }
}

// ── Bygg area-kort med problems popup ──
function createAreaCard(area, problems) {
  const card = document.createElement('div');
  card.className = 'area-card';

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
      const el = document.createElement('p');
      el.textContent = p.name;
      popup.appendChild(el);
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

// ── Starta ──
loadRooms();