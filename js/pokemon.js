import { getState, setState } from './state.js';
import { ELEMENTS } from './map.js';
import { render } from './ui.js';
import lang from '../lang/en.js';

export const POKEMONS = [
  { id: 'pikachu',    el: 'electric', stages: ['Pichu','Pikachu','Raichu'],          icons: ['\u26A1','\u26A1\u26A1','\u26A1\u26A1\u26A1'],             needs: [4, 7] },
  { id: 'bulbasaur',  el: 'nature',   stages: ['Bulbasaur','Ivysaur','Venusaur'],    icons: ['\u{1F331}','\u{1F33F}','\u{1F33A}'],                      needs: [4, 7] },
  { id: 'charmander', el: 'fire',     stages: ['Charmander','Charmeleon','Charizard'],icons: ['\u{1F525}','\u{1F525}\u{1F525}','\u{1F409}'],             needs: [4, 7] },
  { id: 'eevee',      el: 'magic',    stages: ['Eevee','Espeon','Sylveon'],          icons: ['\u2728','\u{1F52E}','\u{1F4AB}'],                         needs: [4, 7] },
];

export function renderPokemonPanel(container) {
  container.innerHTML = '';
  const state = getState();

  const grid = document.createElement('div');
  grid.className = 'poke-grid fade-up';

  for (const poke of POKEMONS) {
    const el = ELEMENTS[poke.el];
    const stage = state.evo[poke.id] || 0;
    const card = document.createElement('div');
    card.className = 'poke-card';
    card.style.background = `linear-gradient(135deg, ${el.color}15, ${el.color}08)`;

    // Icon
    const icon = document.createElement('div');
    icon.className = 'poke-card__icon';
    icon.textContent = poke.icons[stage];
    card.appendChild(icon);

    // Name
    const name = document.createElement('div');
    name.className = 'poke-card__name';
    name.textContent = poke.stages[stage];
    card.appendChild(name);

    // Stage dots
    const dots = document.createElement('div');
    dots.className = 'poke-card__dots';
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('span');
      dot.className = 'poke-dot';
      dot.style.background = i <= stage ? el.color : '#e2e8f0';
      dots.appendChild(dot);
    }
    const stageLabel = document.createElement('span');
    stageLabel.className = 'poke-card__stage-label';
    stageLabel.textContent = `Stage ${stage + 1}/3`;
    dots.appendChild(stageLabel);
    card.appendChild(dots);

    if (stage < 2) {
      const need = poke.needs[stage];
      const have = state.items[poke.el] || 0;
      const pct = Math.min(100, Math.round((have / need) * 100));

      // Progress bar
      const barWrap = document.createElement('div');
      barWrap.className = 'poke-bar-wrap';

      const bar = document.createElement('div');
      bar.className = 'poke-bar';
      const fill = document.createElement('div');
      fill.className = 'poke-bar__fill';
      fill.style.width = pct + '%';
      fill.style.background = el.color;
      bar.appendChild(fill);
      barWrap.appendChild(bar);

      const barText = document.createElement('div');
      barText.className = 'poke-bar__text';
      barText.textContent = `${el.icon} ${have}/${need}`;
      barWrap.appendChild(barText);

      card.appendChild(barWrap);

      if (have >= need) {
        const evoBtn = document.createElement('button');
        evoBtn.className = 'poke-evolve-btn pulse';
        evoBtn.style.background = el.color;
        evoBtn.textContent = '\u2728 Evolve!';
        evoBtn.addEventListener('click', () => evolve(poke.id));
        card.appendChild(evoBtn);
      }
    } else {
      const maxLabel = document.createElement('div');
      maxLabel.className = 'poke-card__max';
      maxLabel.textContent = `${lang.maxLevel} \u{1F3C6}`;
      card.appendChild(maxLabel);
    }

    grid.appendChild(card);
  }

  // Hint at bottom
  const hint = document.createElement('p');
  hint.className = 'poke-collect-hint';
  hint.textContent = lang.collectItems;

  container.appendChild(grid);
  container.appendChild(hint);
}

function evolve(pokemonId) {
  const state = getState();
  const poke = POKEMONS.find(p => p.id === pokemonId);
  const stage = state.evo[pokemonId] || 0;
  if (stage >= 2) return;

  const need = poke.needs[stage];
  const have = state.items[poke.el] || 0;
  if (have < need) return;

  // Deduct items and increase evo
  const newItems = { ...state.items };
  newItems[poke.el] = have - need;
  const newEvo = { ...state.evo };
  newEvo[pokemonId] = stage + 1;
  setState({ items: newItems, evo: newEvo });

  const newStage = stage + 1;
  const el = ELEMENTS[poke.el];

  // Show evolution popup
  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';

  const card = document.createElement('div');
  card.className = 'popup-card';

  const evoTitle = document.createElement('div');
  evoTitle.className = 'popup-title';
  evoTitle.textContent = lang.evolveTitle;
  card.appendChild(evoTitle);

  const evoIcon = document.createElement('div');
  evoIcon.className = 'popup-icon glow';
  evoIcon.textContent = poke.icons[newStage];
  card.appendChild(evoIcon);

  const evoName = document.createElement('div');
  evoName.className = 'popup-name';
  evoName.textContent = poke.stages[newStage];
  evoName.style.color = el.color;
  card.appendChild(evoName);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'btn-primary popup-close-btn';
  closeBtn.style.background = el.color;
  closeBtn.textContent = lang.evolveBtn;
  closeBtn.addEventListener('click', () => {
    overlay.remove();
    render();
  });
  card.appendChild(closeBtn);

  overlay.appendChild(card);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
      render();
    }
  });

  document.body.appendChild(overlay);
}
