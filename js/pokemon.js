import { getState, setState } from './state.js';
import { ELEMENTS } from './map.js';
import { render } from './ui.js';
import lang from '../lang/en.js';

export const POKEMONS = [
  { id: 'pikachu',    el: 'electric', stages: ['Pichu','Pikachu','Raichu'],          icons: ['\u26A1','\u26A1\u26A1','\u26A1\u26A1\u26A1'],   needs: [6, 10],
    milestones: [
      { at: 3, stage: 0, key: 'pikachu-0', name: 'Spark Collector', icon: '\u26A1\u{1F31F}' },
      { at: 5, stage: 1, key: 'pikachu-1', name: 'Thunder Lord',    icon: '\u26A1\u26A1\u{1F31F}' },
    ] },
  { id: 'bulbasaur',  el: 'nature',   stages: ['Bulbasaur','Ivysaur','Venusaur'],    icons: ['\u{1F331}','\u{1F33F}','\u{1F33A}'],             needs: [6, 10],
    milestones: [
      { at: 3, stage: 0, key: 'bulbasaur-0', name: 'Seed Gatherer',    icon: '\u{1F331}\u{1F31F}' },
      { at: 5, stage: 1, key: 'bulbasaur-1', name: 'Forest Guardian',  icon: '\u{1F33F}\u{1F31F}' },
    ] },
  { id: 'charmander', el: 'fire',     stages: ['Charmander','Charmeleon','Charizard'],icons: ['\u{1F525}','\u{1F525}\u{1F525}','\u{1F409}'],   needs: [6, 10],
    milestones: [
      { at: 3, stage: 0, key: 'charmander-0', name: 'Flame Starter', icon: '\u{1F525}\u{1F31F}' },
      { at: 5, stage: 1, key: 'charmander-1', name: 'Fire Master',   icon: '\u{1F525}\u{1F525}\u{1F31F}' },
    ] },
  { id: 'eevee',      el: 'magic',    stages: ['Eevee','Espeon','Sylveon'],          icons: ['\u2728','\u{1F52E}','\u{1F4AB}'],                needs: [6, 10],
    milestones: [
      { at: 3, stage: 0, key: 'eevee-0', name: 'Star Seeker',   icon: '\u2728\u{1F31F}' },
      { at: 5, stage: 1, key: 'eevee-1', name: 'Cosmic Wizard', icon: '\u{1F52E}\u{1F31F}' },
    ] },
];

// Check milestones after item gain — returns new milestone or null
export function checkMilestones() {
  const state = getState();
  for (const poke of POKEMONS) {
    const stage = state.evo[poke.id] || 0;
    const have = state.items[poke.el] || 0;
    for (const ms of poke.milestones) {
      if (ms.stage === stage && have >= ms.at && !state.milestones.includes(ms.key)) {
        const newMs = [...state.milestones, ms.key];
        setState({ milestones: newMs });
        return { poke, milestone: ms };
      }
    }
  }
  return null;
}

export function showMilestonePopup(poke, milestone) {
  const el = ELEMENTS[poke.el];

  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';

  const card = document.createElement('div');
  card.className = 'popup-card';

  const title = document.createElement('div');
  title.className = 'popup-title';
  title.textContent = lang.milestoneTitle;
  card.appendChild(title);

  const badge = document.createElement('div');
  badge.className = 'milestone-popup-badge';
  badge.style.background = el.color + '18';
  badge.style.borderColor = el.color;
  badge.textContent = milestone.icon;
  card.appendChild(badge);

  const name = document.createElement('div');
  name.className = 'popup-name';
  name.style.color = el.color;
  name.textContent = milestone.name;
  card.appendChild(name);

  const desc = document.createElement('div');
  desc.className = 'milestone-popup-desc';
  const st = getState();
  desc.textContent = `${poke.stages[milestone.stage]} \u2192 ${el.icon} ${st.items[poke.el]}/${poke.needs[milestone.stage]}`;
  card.appendChild(desc);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'btn-primary popup-close-btn';
  closeBtn.style.background = el.color;
  closeBtn.textContent = lang.milestoneBtn;
  closeBtn.addEventListener('click', () => {
    overlay.remove();
  });
  card.appendChild(closeBtn);

  overlay.appendChild(card);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  document.body.appendChild(overlay);
}

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

      // Milestone badges for this stage
      const stageMilestones = poke.milestones.filter(m => m.stage === stage);
      for (const ms of stageMilestones) {
        const achieved = state.milestones.includes(ms.key);
        const msBadge = document.createElement('div');
        msBadge.className = 'poke-milestone' + (achieved ? ' poke-milestone--done' : '');
        msBadge.style.borderColor = achieved ? el.color : '#e2e8f0';
        msBadge.style.color = achieved ? el.color : '#ccc';
        msBadge.textContent = achieved ? `${ms.icon} ${ms.name}` : `\u{1F512} ${ms.name} (${ms.at}/${need})`;
        card.appendChild(msBadge);
      }

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

      // Show all achieved milestones
      for (const ms of poke.milestones) {
        if (state.milestones.includes(ms.key)) {
          const msBadge = document.createElement('div');
          msBadge.className = 'poke-milestone poke-milestone--done';
          msBadge.style.borderColor = el.color;
          msBadge.style.color = el.color;
          msBadge.textContent = `${ms.icon} ${ms.name}`;
          card.appendChild(msBadge);
        }
      }
    }

    grid.appendChild(card);
  }

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

  const newItems = { ...state.items };
  newItems[poke.el] = have - need;
  const newEvo = { ...state.evo };
  newEvo[pokemonId] = stage + 1;
  setState({ items: newItems, evo: newEvo });

  const newStage = stage + 1;
  const el = ELEMENTS[poke.el];

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
