import { getState, setState } from './state.js';
import { render } from './ui.js';
import { POKEMONS } from './pokemon.js';

export const LOCATIONS = [
  { id: 0, name: 'Village',  icon: '\u{1F3D8}\uFE0F', x: 50, y: 50, el: null,       diff: 0, adj: [1, 2, 3, 4] },
  { id: 1, name: 'Garden',   icon: '\u{1F33B}',       x: 22, y: 28, el: 'nature',   diff: 1, adj: [0, 5, 6] },
  { id: 2, name: 'Pond',     icon: '\u{1F4A7}',       x: 78, y: 28, el: 'electric', diff: 1, adj: [0, 6, 7] },
  { id: 3, name: 'Campfire', icon: '\u{1F3D5}\uFE0F', x: 22, y: 72, el: 'fire',     diff: 1, adj: [0, 5, 8] },
  { id: 4, name: 'Meadow',   icon: '\u{1F308}',       x: 78, y: 72, el: 'magic',    diff: 1, adj: [0, 7, 8] },
  { id: 5, name: 'Forest',   icon: '\u{1F332}',       x: 6,  y: 50, el: 'nature',   diff: 2, adj: [1, 3] },
  { id: 6, name: 'Beach',    icon: '\u{1F3D6}\uFE0F', x: 50, y: 8,  el: 'electric', diff: 2, adj: [1, 2] },
  { id: 7, name: 'Tower',    icon: '\u{1F5FC}',       x: 94, y: 50, el: 'magic',    diff: 2, adj: [2, 4] },
  { id: 8, name: 'Volcano',  icon: '\u{1F30B}',       x: 50, y: 92, el: 'fire',     diff: 2, adj: [3, 4] },
];

export const ELEMENTS = {
  fire:     { icon: '\u{1F525}', color: '#FF6B6B', item: 'Fire Gem' },
  nature:   { icon: '\u{1F33F}', color: '#4ECDC4', item: 'Leaf Seed' },
  electric: { icon: '\u26A1',    color: '#FFD93D', item: 'Thunder Shard' },
  magic:    { icon: '\u2728',    color: '#B39DDB', item: 'Star Dust' },
};

let prevPos = null;

export function moveToLocation(id) {
  const state = getState();
  const current = LOCATIONS[state.pos];

  if (state.pos === id) return;
  if (!current.adj.includes(id)) return;
  if (state.mp < 1) return;

  prevPos = state.pos;
  setState({ pos: id, mp: state.mp - 1 });
  render();
}

const SVG_NS = 'http://www.w3.org/2000/svg';

function el(tag, attrs, children) {
  const e = document.createElementNS(SVG_NS, tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (children) for (const c of children) e.appendChild(c);
  return e;
}

function buildScenery() {
  const g = el('g');

  // --- Water area near Beach (top) ---
  g.appendChild(el('ellipse', { cx: '50', cy: '4', rx: '22', ry: '5', fill: '#81d4fa', opacity: '0.4' }));
  g.appendChild(el('ellipse', { cx: '50', cy: '5', rx: '18', ry: '3', fill: '#4fc3f7', opacity: '0.35' }));
  // Sand shore
  g.appendChild(el('ellipse', { cx: '50', cy: '9', rx: '14', ry: '2.5', fill: '#ffe0b2', opacity: '0.5' }));

  // --- Pond water (right-upper area) ---
  g.appendChild(el('ellipse', { cx: '78', cy: '28', rx: '7', ry: '5', fill: '#81d4fa', opacity: '0.3' }));

  // --- Volcano glow (bottom) ---
  g.appendChild(el('ellipse', { cx: '50', cy: '92', rx: '8', ry: '5', fill: '#ff8a65', opacity: '0.2' }));
  g.appendChild(el('ellipse', { cx: '50', cy: '94', rx: '12', ry: '3', fill: '#bf360c', opacity: '0.1' }));

  // --- Forest trees (left cluster) ---
  const treePositions = [
    [3, 42], [8, 43], [2, 48], [10, 47], [4, 54], [9, 55], [2, 58], [7, 38],
    [12, 41], [5, 61], [11, 52],
  ];
  for (const [tx, ty] of treePositions) {
    // trunk
    g.appendChild(el('rect', { x: String(tx - 0.3), y: String(ty), width: '0.6', height: '2', fill: '#5d4037', rx: '0.2' }));
    // canopy
    g.appendChild(el('circle', { cx: String(tx), cy: String(ty - 0.5), r: '2.2', fill: '#2e7d32', opacity: '0.7' }));
  }
  // Extra dense canopy overlay
  g.appendChild(el('circle', { cx: '6', cy: '50', r: '5', fill: '#1b5e20', opacity: '0.15' }));

  // --- Scattered trees around map ---
  const scatteredTrees = [
    [16, 18], [30, 14], [70, 14], [84, 18],
    [14, 82], [30, 86], [70, 86], [86, 82],
    [36, 38], [64, 38], [36, 62], [64, 62],
  ];
  for (const [tx, ty] of scatteredTrees) {
    g.appendChild(el('rect', { x: String(tx - 0.2), y: String(ty), width: '0.4', height: '1.5', fill: '#5d4037', rx: '0.1' }));
    g.appendChild(el('circle', { cx: String(tx), cy: String(ty - 0.3), r: '1.6', fill: '#43a047', opacity: '0.6' }));
  }

  // --- Bushes / hedges ---
  const bushes = [
    [18, 50], [82, 50], [50, 18], [50, 82],
    [35, 25], [65, 25], [35, 75], [65, 75],
    [28, 50], [72, 50], [50, 35], [50, 65],
    [15, 35], [85, 35], [15, 65], [85, 65],
  ];
  for (const [bx, by] of bushes) {
    g.appendChild(el('ellipse', { cx: String(bx), cy: String(by), rx: '1.8', ry: '1.2', fill: '#66bb6a', opacity: '0.5' }));
  }

  // --- Flowers near Garden ---
  const flowers = [[18, 24], [26, 25], [19, 31], [25, 32], [20, 22]];
  const flowerColors = ['#f48fb1', '#ce93d8', '#fff176', '#ef5350', '#ff8a65'];
  for (let i = 0; i < flowers.length; i++) {
    const [fx, fy] = flowers[i];
    g.appendChild(el('circle', { cx: String(fx), cy: String(fy), r: '0.8', fill: flowerColors[i], opacity: '0.7' }));
  }

  // --- Rocks near Volcano ---
  const rocks = [[45, 88], [55, 89], [43, 94], [57, 93], [48, 96]];
  for (const [rx, ry] of rocks) {
    g.appendChild(el('ellipse', { cx: String(rx), cy: String(ry), rx: '1.5', ry: '1', fill: '#78909c', opacity: '0.5' }));
  }

  // --- Magic sparkles near Tower/Meadow ---
  const sparkles = [[90, 44], [96, 56], [82, 68], [74, 76], [92, 42]];
  for (const [sx, sy] of sparkles) {
    g.appendChild(el('circle', { cx: String(sx), cy: String(sy), r: '0.5', fill: '#ce93d8', opacity: '0.5' }));
  }

  // --- Hedge border around map ---
  const hedgeTop = [];
  for (let hx = 2; hx < 100; hx += 4) {
    hedgeTop.push([hx, 1]);
    hedgeTop.push([hx, 99]);
  }
  for (let hy = 4; hy < 98; hy += 4) {
    hedgeTop.push([1, hy]);
    hedgeTop.push([99, hy]);
  }
  for (const [hx, hy] of hedgeTop) {
    g.appendChild(el('ellipse', { cx: String(hx), cy: String(hy), rx: '2', ry: '1.4', fill: '#388e3c', opacity: '0.55' }));
  }

  return g;
}

function buildPath(x1, y1, x2, y2) {
  // Create a slightly curved path between two points
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  // Offset midpoint perpendicular to the line for curve
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const off = len * 0.08;
  const cx = mx + (-dy / len) * off;
  const cy = my + (dx / len) * off;

  const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

  const g = el('g');

  // Wide sandy path base
  g.appendChild(el('path', {
    d, fill: 'none', stroke: '#d7ccc8', 'stroke-width': '3.5',
    'stroke-linecap': 'round', opacity: '0.6'
  }));
  // Inner dirt path
  g.appendChild(el('path', {
    d, fill: 'none', stroke: '#bcaaa4', 'stroke-width': '2',
    'stroke-linecap': 'round', opacity: '0.7'
  }));
  // Dotted center line (footsteps feel)
  g.appendChild(el('path', {
    d, fill: 'none', stroke: '#8d6e63', 'stroke-width': '0.4',
    'stroke-linecap': 'round', 'stroke-dasharray': '1,2', opacity: '0.5'
  }));

  return g;
}

function buildPokemonCorners(mapDiv) {
  const state = getState();
  // Map each pokemon to a corner; order matches POKEMONS:
  // pikachu -> top-right, bulbasaur -> top-left, charmander -> bottom-left, eevee -> bottom-right
  const cornerMap = {
    pikachu:    'tr',
    bulbasaur:  'tl',
    charmander: 'bl',
    eevee:      'br',
  };

  for (const poke of POKEMONS) {
    const corner = cornerMap[poke.id];
    if (!corner) continue;
    const el = ELEMENTS[poke.el];
    const stage = state.evo[poke.id] || 0;
    const isMax = stage >= 2;
    const need = isMax ? 0 : poke.needs[stage];
    const have = state.items[poke.el] || 0;
    const pct = isMax ? 100 : Math.min(100, Math.round((have / need) * 100));

    const badge = document.createElement('div');
    badge.className = `map-corner map-corner--${corner}`;
    badge.style.borderColor = el.color;
    badge.title = `${poke.stages[stage]} — ${isMax ? 'MAX' : have + '/' + need + ' ' + el.item}`;

    badge.innerHTML = `
      <div class="map-corner__icon">${poke.icons[stage]}</div>
      <div class="map-corner__bar">
        <div class="map-corner__fill" style="width:${pct}%; background:${el.color};"></div>
      </div>
      <div class="map-corner__text">${isMax ? '\u{1F3C6} MAX' : have + '/' + need}</div>
    `;
    mapDiv.appendChild(badge);
  }
}

function buildCharacter(x, y, fromX, fromY) {
  const character = document.createElement('div');
  character.className = 'map-character';

  // Determine facing direction
  const goingRight = x > fromX;
  const goingLeft = x < fromX;
  character.textContent = '\u{1F9D2}'; // child emoji

  if (fromX !== null && fromY !== null && (fromX !== x || fromY !== y)) {
    // Start at old position, animate to new
    character.style.left = fromX + '%';
    character.style.top = fromY + '%';
    character.classList.add('map-character--walking');
    if (goingLeft) character.style.transform = 'translate(-50%, -50%) scaleX(-1)';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        character.style.left = x + '%';
        character.style.top = y + '%';
        if (!goingLeft) character.style.transform = 'translate(-50%, -50%)';
      });
    });
  } else {
    character.style.left = x + '%';
    character.style.top = y + '%';
  }

  return character;
}

export function renderMap(container) {
  const state = getState();
  const current = LOCATIONS[state.pos];

  container.innerHTML = '';

  const mapDiv = document.createElement('div');
  mapDiv.className = 'game-map';

  // SVG layer
  const svg = el('svg', { viewBox: '0 0 100 100', preserveAspectRatio: 'none' });
  svg.style.position = 'absolute';
  svg.style.top = '0';
  svg.style.left = '0';
  svg.style.width = '100%';
  svg.style.height = '100%';

  // Grass texture background patches (fixed positions for stable rendering)
  const grassPatches = el('g');
  const grassColors = ['#a5d6a7', '#81c784', '#c8e6c9', '#aed581'];
  const grassData = [
    [12,15,8], [35,10,7], [72,12,9], [88,20,6], [8,80,7],
    [25,65,10], [60,75,8], [85,70,6], [45,30,9], [55,60,7],
    [20,45,8], [70,45,6], [40,85,9], [90,55,7], [15,55,8],
    [50,20,6], [75,85,7], [30,35,8], [65,55,9], [45,50,10],
  ];
  for (let i = 0; i < grassData.length; i++) {
    const [gx, gy, gr] = grassData[i];
    grassPatches.appendChild(el('ellipse', {
      cx: String(gx), cy: String(gy), rx: String(gr), ry: String(gr * 0.7),
      fill: grassColors[i % 4], opacity: '0.3'
    }));
  }
  svg.appendChild(grassPatches);

  // Scenery (trees, bushes, water, rocks)
  svg.appendChild(buildScenery());

  // Paths between locations
  const drawnEdges = new Set();
  for (const loc of LOCATIONS) {
    for (const adjId of loc.adj) {
      const edgeKey = [Math.min(loc.id, adjId), Math.max(loc.id, adjId)].join('-');
      if (drawnEdges.has(edgeKey)) continue;
      drawnEdges.add(edgeKey);
      const adj = LOCATIONS[adjId];
      svg.appendChild(buildPath(loc.x, loc.y, adj.x, adj.y));
    }
  }

  // Location clearings (flat spots under nodes)
  for (const loc of LOCATIONS) {
    svg.appendChild(el('circle', {
      cx: String(loc.x), cy: String(loc.y), r: '5',
      fill: '#e8f5e9', opacity: '0.6'
    }));
    // Inner lighter circle
    svg.appendChild(el('circle', {
      cx: String(loc.x), cy: String(loc.y), r: '3',
      fill: '#f1f8e9', opacity: '0.5'
    }));
  }

  mapDiv.appendChild(svg);

  // Character
  const fromLoc = prevPos !== null ? LOCATIONS[prevPos] : current;
  const charEl = buildCharacter(
    current.x, current.y,
    prevPos !== null ? fromLoc.x : null,
    prevPos !== null ? fromLoc.y : null
  );
  mapDiv.appendChild(charEl);
  prevPos = null;

  // Pokemon progress badges in corners
  buildPokemonCorners(mapDiv);

  // Location nodes
  for (const loc of LOCATIONS) {
    const isCurrent = loc.id === state.pos;
    const isReachable = !isCurrent && current.adj.includes(loc.id) && state.mp >= 1;

    const btn = document.createElement('button');
    btn.className = 'map-node';
    if (isCurrent) btn.classList.add('map-node--current');
    else if (isReachable) btn.classList.add('map-node--reachable');
    else btn.classList.add('map-node--locked');

    btn.style.left = loc.x + '%';
    btn.style.top = loc.y + '%';
    btn.style.transform = 'translate(-50%, -50%)';

    if (isCurrent && loc.el && ELEMENTS[loc.el]) {
      btn.style.outline = `3px solid ${ELEMENTS[loc.el].color}`;
      btn.style.outlineOffset = '2px';
    } else if (isCurrent && !loc.el) {
      btn.style.outline = '3px solid #78909c';
      btn.style.outlineOffset = '2px';
    }

    // Icon
    const iconSpan = document.createElement('span');
    iconSpan.textContent = loc.icon;
    btn.appendChild(iconSpan);

    // Label
    const label = document.createElement('span');
    label.className = 'map-node__label';
    label.textContent = loc.name;
    btn.appendChild(label);

    // MP cost for reachable
    if (isReachable) {
      const mpText = document.createElement('span');
      mpText.className = 'map-node__mp';
      mpText.textContent = '1 MP';
      btn.appendChild(mpText);
    }

    if (isReachable) {
      btn.addEventListener('click', () => moveToLocation(loc.id));
    }

    mapDiv.appendChild(btn);
  }

  container.appendChild(mapDiv);
}
