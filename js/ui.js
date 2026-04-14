import { getState, clearState } from './state.js';
import { LOCATIONS, ELEMENTS, renderMap } from './map.js';

function renderHeader() {
  const state = getState();
  const header = document.createElement('div');
  header.className = 'header fade-up';

  header.innerHTML = `
    <h1>\u{1F5FA}\uFE0F English Quest
      <span>Tasks done: ${state.done}</span>
    </h1>
    <div class="header-right">
      <div class="mp-badge">\u{1F9B6} ${state.mp}</div>
      <button class="btn-pokemon">\u{1F43E} Pokemon</button>
    </div>
  `;

  const pokeBtn = header.querySelector('.btn-pokemon');
  pokeBtn.addEventListener('click', () => {
    alert('Pokemon screen coming soon!');
  });

  return header;
}

function renderItemsBar() {
  const state = getState();
  const bar = document.createElement('div');
  bar.className = 'items-bar fade-up';

  for (const [key, el] of Object.entries(ELEMENTS)) {
    const badge = document.createElement('div');
    badge.className = 'item-badge';
    badge.style.background = el.color + '22';
    badge.style.color = el.color;
    badge.textContent = `${el.icon} ${state.items[key]}`;
    bar.appendChild(badge);
  }

  return bar;
}

function renderLocationCard() {
  const state = getState();
  const loc = LOCATIONS[state.pos];
  const card = document.createElement('div');
  card.className = 'loc-card fade-up';

  const el = loc.el ? ELEMENTS[loc.el] : null;
  const elInfo = el
    ? `${el.icon} ${loc.el.charAt(0).toUpperCase() + loc.el.slice(1)} zone \u2014 earn ${el.item}`
    : 'Your base / Twoja baza';

  card.innerHTML = `
    <div class="loc-card__header">
      <span class="loc-card__icon">${loc.icon}</span>
      <div class="loc-card__info">
        <h2>${loc.name}</h2>
        <p>${elInfo}</p>
      </div>
    </div>
    <div class="loc-card__actions"></div>
  `;

  const actions = card.querySelector('.loc-card__actions');

  if (el) {
    const taskBtn = document.createElement('button');
    taskBtn.className = 'btn-primary';
    taskBtn.style.background = el.color;
    taskBtn.textContent = `\u2694\uFE0F Do task \u2192 ${el.icon}`;
    taskBtn.addEventListener('click', () => {
      alert(`Task at ${loc.name} coming soon!`);
    });
    actions.appendChild(taskBtn);
  }

  const restBtn = document.createElement('button');
  restBtn.className = 'btn-secondary';
  restBtn.textContent = '\u{1F9D8} Rest +3 MP';
  restBtn.addEventListener('click', () => {
    alert('Rest mechanic coming soon!');
  });
  actions.appendChild(restBtn);

  return card;
}

function renderPokeStatus() {
  const state = getState();
  const row = document.createElement('div');
  row.className = 'poke-status fade-up';

  const pokemons = [
    { name: 'Pikachu',    icon: '\u26A1',    key: 'pikachu' },
    { name: 'Bulbasaur',  icon: '\u{1F33F}', key: 'bulbasaur' },
    { name: 'Charmander', icon: '\u{1F525}', key: 'charmander' },
    { name: 'Eevee',      icon: '\u2728',    key: 'eevee' },
  ];

  for (const p of pokemons) {
    const badge = document.createElement('div');
    badge.className = 'poke-badge';
    badge.textContent = `${p.icon} ${p.name} ${state.evo[p.key]}`;
    row.appendChild(badge);
  }

  return row;
}

function renderMapScreen() {
  const frag = document.createDocumentFragment();

  const mapContainer = document.createElement('div');
  renderMap(mapContainer);
  frag.appendChild(mapContainer);

  frag.appendChild(renderLocationCard());
  frag.appendChild(renderPokeStatus());

  const resetBtn = document.createElement('button');
  resetBtn.className = 'reset-link';
  resetBtn.textContent = 'Reset game';
  resetBtn.addEventListener('click', () => {
    if (confirm('Reset all progress?')) {
      clearState();
      render();
    }
  });
  frag.appendChild(resetBtn);

  return frag;
}

export function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.appendChild(renderHeader());
  app.appendChild(renderItemsBar());
  app.appendChild(renderMapScreen());
}
