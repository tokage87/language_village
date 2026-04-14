import { getState, setState, clearState } from './state.js';
import { LOCATIONS, ELEMENTS, renderMap } from './map.js';
import { getTask, renderEasyTask, renderMedTask, lang } from './tasks.js';

let currentScreen = 'map'; // 'map' | 'task'
let taskContext = null;     // { task, difficulty, loc }

function getDifficulty(loc) {
  const state = getState();
  const maxEvo = Math.max(...Object.values(state.evo));

  if (loc.diff === 1) {
    return maxEvo < 1 ? 'easy' : 'med';
  }
  if (loc.diff === 2) {
    return maxEvo < 2 ? 'med' : 'hard';
  }
  return 'easy';
}

function diffLabel(difficulty) {
  if (difficulty === 'easy') return lang.ui.easy;
  if (difficulty === 'med') return lang.ui.medium;
  return lang.ui.hard;
}

function renderHeader() {
  const state = getState();
  const header = document.createElement('div');
  header.className = 'header fade-up';

  header.innerHTML = `
    <h1>\u{1F5FA}\uFE0F ${lang.ui.title}
      <span>${lang.ui.tasksDone}: ${state.done}</span>
    </h1>
    <div class="header-right">
      <div class="mp-badge">\u{1F9B6} ${state.mp}</div>
      <button class="btn-pokemon">\u{1F43E} ${lang.ui.pokemon}</button>
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
    : lang.ui.yourBase;

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
    const difficulty = getDifficulty(loc);
    taskBtn.textContent = `\u2694\uFE0F ${lang.ui.doTask} \u2192 ${el.icon}`;

    taskBtn.addEventListener('click', () => {
      const task = getTask(difficulty);
      taskContext = { task, difficulty, loc };
      currentScreen = 'task';
      render();
    });
    actions.appendChild(taskBtn);
  }

  const restBtn = document.createElement('button');
  restBtn.className = 'btn-secondary';
  restBtn.textContent = '\u{1F9D8} ' + lang.ui.restBtn;
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
  resetBtn.textContent = lang.ui.resetGame;
  resetBtn.addEventListener('click', () => {
    if (confirm('Reset all progress?')) {
      clearState();
      currentScreen = 'map';
      render();
    }
  });
  frag.appendChild(resetBtn);

  return frag;
}

function renderTaskScreen() {
  const { task, difficulty, loc } = taskContext;
  const el = ELEMENTS[loc.el];

  const wrap = document.createElement('div');
  wrap.className = 'fade-up';
  wrap.style.padding = '0 16px';

  // Task card
  const card = document.createElement('div');
  card.className = 'task-card';

  // Card header
  const header = document.createElement('div');
  header.className = 'task-card__header';

  const locInfo = document.createElement('div');
  locInfo.className = 'task-card__loc';
  locInfo.innerHTML = `<span class="task-card__loc-icon">${loc.icon}</span> ${loc.name}`;

  const badge = document.createElement('span');
  badge.className = 'task-diff-badge';
  badge.style.background = el.color + '22';
  badge.style.color = el.color;
  badge.textContent = diffLabel(difficulty);

  header.appendChild(locInfo);
  header.appendChild(badge);
  card.appendChild(header);

  // Task content area
  const content = document.createElement('div');
  content.className = 'task-content';

  const onWin = () => {
    const state = getState();
    const newItems = { ...state.items };
    newItems[loc.el] = (newItems[loc.el] || 0) + 1;
    setState({ items: newItems, done: state.done + 1 });
    currentScreen = 'map';
    render();
  };

  const onFail = () => {
    currentScreen = 'map';
    render();
  };

  if (task.type === 'easy') {
    renderEasyTask(content, task, el.color, onWin, onFail);
  } else if (task.type === 'med') {
    renderMedTask(content, task, el.color, onWin, onFail);
  }

  card.appendChild(content);

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'btn-secondary task-close-btn';
  closeBtn.textContent = '\u2190 ' + lang.ui.close;
  closeBtn.addEventListener('click', () => {
    currentScreen = 'map';
    render();
  });
  card.appendChild(closeBtn);

  wrap.appendChild(card);
  return wrap;
}

export function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.appendChild(renderHeader());
  app.appendChild(renderItemsBar());

  if (currentScreen === 'task' && taskContext) {
    app.appendChild(renderTaskScreen());
  } else {
    app.appendChild(renderMapScreen());
  }
}
