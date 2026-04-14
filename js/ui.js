import { getState, setState, clearState } from './state.js';
import { LOCATIONS, ELEMENTS, renderMap } from './map.js';
import { getTask, renderEasyTask, renderMedTask, renderHardTask, lang } from './tasks.js';
import { renderVocabRest } from './vocab.js';
import { POKEMONS, renderPokemonPanel } from './pokemon.js';

let currentScreen = 'map'; // 'map' | 'task' | 'rest' | 'pokemon'
let taskContext = null;     // { task, difficulty, loc }
let lastResult = null;      // 'win' | 'fail' | null

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

function diffStars(difficulty) {
  if (difficulty === 'easy') return '\u2B50';
  if (difficulty === 'med') return '\u2B50\u2B50';
  return '\u2B50\u2B50\u2B50';
}

function renderHeader() {
  const state = getState();
  const header = document.createElement('div');
  header.className = 'header fade-up';

  const isPokemonScreen = currentScreen === 'pokemon';

  header.innerHTML = `
    <h1>\u{1F5FA}\uFE0F ${lang.ui.title}
      <span>${lang.ui.tasksDone}: ${state.done}</span>
    </h1>
    <div class="header-right">
      <div class="mp-badge">\u{1F9B6} ${state.mp}</div>
      <button class="btn-pokemon">${isPokemonScreen ? '\u2715 ' + lang.ui.close : '\u{1F43E} ' + lang.ui.pokemon}</button>
    </div>
  `;

  const pokeBtn = header.querySelector('.btn-pokemon');
  pokeBtn.addEventListener('click', () => {
    if (currentScreen === 'pokemon') {
      currentScreen = 'map';
    } else {
      currentScreen = 'pokemon';
    }
    render();
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

  // Apply feedback animation
  if (lastResult === 'win') {
    card.classList.add('loc-card--success');
  } else if (lastResult === 'fail') {
    card.classList.add('loc-card--fail');
  }
  lastResult = null;

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
    const difficulty = getDifficulty(loc);
    const taskBtn = document.createElement('button');
    taskBtn.className = 'btn-primary';
    taskBtn.style.background = el.color;
    taskBtn.innerHTML = `\u2694\uFE0F ${lang.ui.doTask} \u2192 ${el.icon} <span class="btn-diff-stars">${diffStars(difficulty)}</span>`;

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

  // Pulse rest button when mp=0 and no element task available
  if (state.mp === 0 && !el) {
    restBtn.classList.add('rest-pulse');
  }

  restBtn.addEventListener('click', () => {
    currentScreen = 'rest';
    render();
  });
  actions.appendChild(restBtn);

  return card;
}

function renderPokeStatus() {
  const state = getState();
  const row = document.createElement('div');
  row.className = 'poke-status fade-up';

  for (const poke of POKEMONS) {
    const el = ELEMENTS[poke.el];
    const stage = state.evo[poke.id] || 0;
    const badge = document.createElement('div');
    badge.className = 'poke-mini-badge';
    badge.style.background = el.color + '1F';
    badge.style.borderColor = el.color + '55';
    badge.textContent = `${poke.icons[stage]} ${poke.stages[stage]}`;
    row.appendChild(badge);
  }

  return row;
}

function renderMapScreen() {
  const frag = document.createDocumentFragment();

  const mapContainer = document.createElement('div');
  mapContainer.className = 'fade-up';
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
    lastResult = 'win';
    currentScreen = 'map';
    render();
  };

  const onFail = () => {
    lastResult = 'fail';
    currentScreen = 'map';
    render();
  };

  if (task.type === 'easy') {
    renderEasyTask(content, task, el.color, onWin, onFail);
  } else if (task.type === 'med') {
    renderMedTask(content, task, el.color, onWin, onFail);
  } else if (task.type === 'hard') {
    renderHardTask(content, task, el.color, onWin);
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

function renderRestScreen() {
  const wrap = document.createElement('div');
  wrap.className = 'fade-up';
  wrap.style.padding = '0 16px';

  const card = document.createElement('div');
  card.className = 'task-card';

  const content = document.createElement('div');
  content.className = 'task-content';

  renderVocabRest(content, '#4338ca', () => {
    const state = getState();
    setState({ mp: state.mp + 3 });
    currentScreen = 'map';
    render();
  });

  card.appendChild(content);

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

function renderPokemonScreen() {
  const wrap = document.createElement('div');
  wrap.className = 'fade-up';
  wrap.style.padding = '0 16px';

  renderPokemonPanel(wrap);

  return wrap;
}

function renderNoMpBanner() {
  const banner = document.createElement('div');
  banner.className = 'no-mp-banner fade-up';
  banner.textContent = lang.ui.noMp;
  return banner;
}

export function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.appendChild(renderHeader());
  app.appendChild(renderItemsBar());

  if (currentScreen === 'task' && taskContext) {
    app.appendChild(renderTaskScreen());
  } else if (currentScreen === 'rest') {
    app.appendChild(renderRestScreen());
  } else if (currentScreen === 'pokemon') {
    app.appendChild(renderPokemonScreen());
  } else {
    const state = getState();
    if (state.mp === 0) {
      app.appendChild(renderNoMpBanner());
    }
    app.appendChild(renderMapScreen());
  }
}
