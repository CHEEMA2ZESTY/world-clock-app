const cityInput = document.getElementById('cityInput');
const suggestionsList = document.getElementById('suggestions');
const clocksContainer = document.getElementById('clocksContainer');

const maxCities = 15;
const loadedCities = new Set();

// Load default cities
const defaultCities = ["Lagos", "London", "New York", "Tokyo", "Dubai"];
defaultCities.forEach(city => addCity(city));

// Autocomplete suggestions
cityInput.addEventListener('input', () => {
  const inputVal = cityInput.value.toLowerCase();
  suggestionsList.innerHTML = '';

  if (inputVal === '') return;

  const matches = Object.keys(CITY_TIMEZONES)
    .filter(city => city.toLowerCase().startsWith(inputVal))
    .slice(0, 10);

  matches.forEach(city => {
    const li = document.createElement('li');
    li.textContent = city;
    li.addEventListener('click', () => {
      addCity(city);
      cityInput.value = '';
      suggestionsList.innerHTML = '';
    });
    suggestionsList.appendChild(li);
  });
});

// Add city
function addCity(city) {
  const timezone = CITY_TIMEZONES[city];
  if (!timezone) {
    alert("City not recognized.");
    return;
  }

  const id = timezone.replace(/\//g, '-');
  if (loadedCities.has(id)) return;

  if (loadedCities.size >= maxCities) {
    alert("City limit reached (15 max).");
    return;
  }

  const card = document.createElement('div');
  card.className = 'clock-card';
  card.id = id;
  card.innerHTML = `
    <button class="remove-btn" onclick="removeCity('${id}')">×</button>
    <h2>${city}</h2>
    <p class="time">--:--:--</p>
    <p class="date">Loading...</p>
  `;
  clocksContainer.appendChild(card);
  loadedCities.add(id);

  updateTime(id, timezone);
}

// Remove city
function removeCity(id) {
  const card = document.getElementById(id);
  if (card) {
    card.remove();
    loadedCities.delete(id);
  }
}

// Update clocks
function updateTime(id, timezone) {
  setInterval(() => {
    const now = new Date();
    const timeStr = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: timezone,
      hour12: false
    }).format(now);

    const dateStr = new Intl.DateTimeFormat('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
      timeZone: timezone
    }).format(now);

    const card = document.getElementById(id);
    if (card) {
      card.querySelector('.time').textContent = timeStr;
      card.querySelector('.date').textContent = dateStr;
    }
  }, 1000);
}
