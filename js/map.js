import { getState, setState } from './state.js';
import { render } from './ui.js';

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

const NS = 'http://www.w3.org/2000/svg';
function svg(tag, a) {
  const e = document.createElementNS(NS, tag);
  if (a) for (const k in a) e.setAttribute(k, a[k]);
  return e;
}

// ── Dense forest border (Kingdom Rush style) ──
function buildForestBorder(root) {
  // Shadow layer under canopies
  const shadowG = svg('g', { opacity: '0.18' });
  // Trunk layer
  const trunkG = svg('g');
  // Dark canopy layer (back)
  const darkG = svg('g');
  // Medium canopy layer
  const medG = svg('g');
  // Bright canopy highlights
  const hiG = svg('g');

  // Generate dense tree wall along edges
  // Top edge (skip gap for Beach at x~50)
  for (let x = -4; x <= 104; x += 3.5) {
    if (x > 34 && x < 66) continue; // gap for Beach
    addTreeCluster(x, -2 + Math.sin(x * 0.3) * 2, 1.0);
    addTreeCluster(x + 1.5, 4 + Math.cos(x * 0.5) * 1.5, 0.85);
    if (x % 7 < 4) addTreeCluster(x + 0.8, 9 + Math.sin(x) * 1, 0.65);
  }
  // Bottom edge (skip gap for Volcano at x~50)
  for (let x = -4; x <= 104; x += 3.5) {
    if (x > 34 && x < 66) continue;
    addTreeCluster(x, 102 + Math.sin(x * 0.3) * 2, 1.0);
    addTreeCluster(x + 1.5, 96 + Math.cos(x * 0.5) * 1.5, 0.85);
    if (x % 7 < 4) addTreeCluster(x + 0.8, 91 + Math.sin(x) * 1, 0.65);
  }
  // Left edge (dense — Forest is IN the trees)
  for (let y = -2; y <= 102; y += 3.2) {
    addTreeCluster(-3 + Math.sin(y * 0.4) * 1.5, y, 1.0);
    addTreeCluster(3 + Math.cos(y * 0.3) * 1.5, y + 1.5, 0.9);
    addTreeCluster(8 + Math.sin(y * 0.5) * 1, y + 0.8, 0.7);
    if (y > 15 && y < 85) addTreeCluster(13 + Math.cos(y * 0.2) * 2, y + 1.2, 0.5);
  }
  // Right edge (skip gap area around Tower x~94)
  for (let y = -2; y <= 102; y += 3.5) {
    if (y > 38 && y < 62) continue;
    addTreeCluster(103 + Math.sin(y * 0.4) * 1.5, y, 1.0);
    addTreeCluster(97 + Math.cos(y * 0.3) * 1.5, y + 1.5, 0.85);
    if (y % 7 < 4) addTreeCluster(92 + Math.sin(y * 0.5) * 1, y + 0.8, 0.6);
  }
  // Corner extra density
  const corners = [[5, 5], [95, 5], [5, 95], [95, 95]];
  for (const [cx, cy] of corners) {
    for (let i = 0; i < 6; i++) {
      addTreeCluster(cx + (i % 3) * 3 - 3, cy + Math.floor(i / 3) * 3 - 3, 0.9);
    }
  }

  function addTreeCluster(tx, ty, scale) {
    const r = 3.2 * scale;
    // Shadow
    shadowG.appendChild(svg('ellipse', {
      cx: String(tx + 0.5), cy: String(ty + r * 0.7),
      rx: String(r * 0.9), ry: String(r * 0.4), fill: '#000'
    }));
    // Trunk
    trunkG.appendChild(svg('rect', {
      x: String(tx - 0.4 * scale), y: String(ty - 0.5 * scale),
      width: String(0.8 * scale), height: String(2.5 * scale),
      fill: '#4e342e', rx: '0.3'
    }));
    // Dark canopy (back)
    darkG.appendChild(svg('circle', {
      cx: String(tx), cy: String(ty - 1 * scale), r: String(r),
      fill: '#2e7d32'
    }));
    // Medium canopy (mid)
    medG.appendChild(svg('circle', {
      cx: String(tx - 0.4 * scale), cy: String(ty - 1.5 * scale), r: String(r * 0.8),
      fill: '#388e3c'
    }));
    // Highlight (top)
    hiG.appendChild(svg('circle', {
      cx: String(tx + 0.3 * scale), cy: String(ty - 2.2 * scale), r: String(r * 0.55),
      fill: '#4caf50', opacity: '0.8'
    }));
  }

  root.appendChild(shadowG);
  root.appendChild(trunkG);
  root.appendChild(darkG);
  root.appendChild(medG);
  root.appendChild(hiG);
}

// ── Terrain details ──
function buildTerrain(root) {
  const g = svg('g');

  // Grass color variation patches
  const patches = [
    [30, 40, 12, 8, '#8bc34a', 0.15], [60, 35, 10, 7, '#7cb342', 0.12],
    [45, 60, 14, 9, '#9ccc65', 0.13], [25, 55, 8, 6, '#aed581', 0.14],
    [70, 60, 11, 7, '#8bc34a', 0.12], [50, 45, 16, 10, '#c5e1a5', 0.1],
    [35, 78, 9, 6, '#7cb342', 0.15], [65, 80, 10, 7, '#8bc34a', 0.12],
    [40, 20, 11, 7, '#9ccc65', 0.13], [55, 25, 8, 5, '#aed581', 0.1],
  ];
  for (const [px, py, rx, ry, fill, op] of patches) {
    g.appendChild(svg('ellipse', { cx: String(px), cy: String(py), rx: String(rx), ry: String(ry), fill, opacity: String(op) }));
  }

  // Small grass tufts (dark dots)
  const tufts = [
    [32,33],[42,44],[58,42],[68,55],[38,58],[52,65],[28,48],[72,48],
    [45,35],[55,55],[33,68],[67,35],[48,78],[53,23],[62,68],[38,22],
    [43,52],[57,48],[26,62],[74,38],[44,82],[56,18],[34,45],[66,52],
  ];
  for (const [tx, ty] of tufts) {
    g.appendChild(svg('ellipse', { cx: String(tx), cy: String(ty), rx: '0.8', ry: '0.5', fill: '#558b2f', opacity: '0.25' }));
  }

  // Water at Beach area (top)
  g.appendChild(svg('ellipse', { cx: '50', cy: '2', rx: '18', ry: '4', fill: '#29b6f6', opacity: '0.5' }));
  g.appendChild(svg('ellipse', { cx: '50', cy: '4', rx: '15', ry: '3', fill: '#4fc3f7', opacity: '0.4' }));
  g.appendChild(svg('ellipse', { cx: '50', cy: '6', rx: '12', ry: '2', fill: '#81d4fa', opacity: '0.35' }));
  // Sand
  g.appendChild(svg('ellipse', { cx: '50', cy: '9', rx: '10', ry: '3', fill: '#d7ccc8', opacity: '0.6' }));
  g.appendChild(svg('ellipse', { cx: '50', cy: '10', rx: '8', ry: '2', fill: '#efebe9', opacity: '0.5' }));

  // Pond water
  g.appendChild(svg('ellipse', { cx: '78', cy: '29', rx: '6', ry: '4', fill: '#4fc3f7', opacity: '0.3' }));
  g.appendChild(svg('ellipse', { cx: '78', cy: '28', rx: '4', ry: '2.5', fill: '#81d4fa', opacity: '0.25' }));

  // Volcano area (bottom)
  g.appendChild(svg('ellipse', { cx: '50', cy: '93', rx: '10', ry: '5', fill: '#5d4037', opacity: '0.15' }));
  g.appendChild(svg('ellipse', { cx: '50', cy: '92', rx: '6', ry: '3', fill: '#bf360c', opacity: '0.12' }));
  g.appendChild(svg('ellipse', { cx: '50', cy: '91', rx: '3', ry: '1.5', fill: '#ff6e40', opacity: '0.15' }));

  // Rocks scattered
  const rocks = [
    [32,50,1.2,0.7],[68,50,1,0.6],[45,38,0.9,0.5],[55,62,1.1,0.6],
    [25,42,0.8,0.5],[75,58,1,0.6],[42,72,0.9,0.5],[58,28,0.8,0.5],
    [46,88,1.5,0.9],[54,89,1.3,0.8],[42,94,1.2,0.7],[58,93,1.4,0.8],
    [48,86,1,0.6],[52,95,1.1,0.7],
  ];
  for (const [rx, ry, w, h] of rocks) {
    g.appendChild(svg('ellipse', { cx: String(rx), cy: String(ry), rx: String(w), ry: String(h), fill: '#90a4ae', opacity: '0.4' }));
    g.appendChild(svg('ellipse', { cx: String(rx - 0.2), cy: String(ry - 0.2), rx: String(w * 0.6), ry: String(h * 0.6), fill: '#b0bec5', opacity: '0.3' }));
  }

  // Flowers near Garden
  const flowers = [
    [18,24,'#f48fb1'],[20,26,'#ce93d8'],[25,25,'#fff176'],[17,30,'#ef5350'],
    [26,31,'#ff8a65'],[19,22,'#f06292'],[24,33,'#ba68c8'],[16,27,'#ffee58'],
  ];
  for (const [fx, fy, c] of flowers) {
    g.appendChild(svg('circle', { cx: String(fx), cy: String(fy), r: '0.7', fill: c, opacity: '0.7' }));
    g.appendChild(svg('circle', { cx: String(fx), cy: String(fy), r: '0.3', fill: '#fff9c4', opacity: '0.6' }));
  }

  // Magic sparkles near Tower
  const sparkles = [
    [90,44],[96,56],[88,48],[92,54],[86,42],[94,46],[90,58],[96,42]
  ];
  for (const [sx, sy] of sparkles) {
    g.appendChild(svg('circle', { cx: String(sx), cy: String(sy), r: '0.4', fill: '#e1bee7', opacity: '0.6' }));
  }

  // Scattered small bushes near paths
  const bushes = [
    [36,36],[64,36],[36,64],[64,64],[30,50],[70,50],[50,30],[50,70],
    [42,40],[58,40],[42,60],[58,60],
  ];
  for (const [bx, by] of bushes) {
    g.appendChild(svg('ellipse', { cx: String(bx), cy: String(by), rx: '1.5', ry: '1', fill: '#66bb6a', opacity: '0.45' }));
    g.appendChild(svg('ellipse', { cx: String(bx + 0.3), cy: String(by - 0.3), rx: '1', ry: '0.7', fill: '#81c784', opacity: '0.35' }));
  }

  root.appendChild(g);
}

// ── Dirt paths ──
function buildPaths(root) {
  const g = svg('g');
  const drawnEdges = new Set();

  for (const loc of LOCATIONS) {
    for (const adjId of loc.adj) {
      const key = Math.min(loc.id, adjId) + '-' + Math.max(loc.id, adjId);
      if (drawnEdges.has(key)) continue;
      drawnEdges.add(key);
      const adj = LOCATIONS[adjId];

      const x1 = loc.x, y1 = loc.y, x2 = adj.x, y2 = adj.y;
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      const dx = x2 - x1, dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      const off = len * 0.12;
      const cx = mx + (-dy / len) * off;
      const cy = my + (dx / len) * off;
      const d = `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;

      // Ground shadow under path
      g.appendChild(svg('path', {
        d, fill: 'none', stroke: '#3e2723', 'stroke-width': '6',
        'stroke-linecap': 'round', opacity: '0.08'
      }));
      // Wide dirt base
      g.appendChild(svg('path', {
        d, fill: 'none', stroke: '#8d6e63', 'stroke-width': '5',
        'stroke-linecap': 'round', opacity: '0.5'
      }));
      // Inner lighter dirt
      g.appendChild(svg('path', {
        d, fill: 'none', stroke: '#bcaaa4', 'stroke-width': '3.5',
        'stroke-linecap': 'round', opacity: '0.6'
      }));
      // Sandy center
      g.appendChild(svg('path', {
        d, fill: 'none', stroke: '#d7ccc8', 'stroke-width': '2',
        'stroke-linecap': 'round', opacity: '0.7'
      }));
      // Highlight streak
      g.appendChild(svg('path', {
        d, fill: 'none', stroke: '#efebe9', 'stroke-width': '0.8',
        'stroke-linecap': 'round', opacity: '0.4'
      }));
    }
  }

  root.appendChild(g);
}

// ── Location clearings ──
function buildClearings(root) {
  const g = svg('g');
  for (const loc of LOCATIONS) {
    // Outer dirt clearing
    g.appendChild(svg('circle', {
      cx: String(loc.x), cy: String(loc.y), r: '6',
      fill: '#a5d6a7', opacity: '0.4'
    }));
    g.appendChild(svg('circle', {
      cx: String(loc.x), cy: String(loc.y), r: '4.5',
      fill: '#c8e6c9', opacity: '0.5'
    }));
    g.appendChild(svg('circle', {
      cx: String(loc.x), cy: String(loc.y), r: '3',
      fill: '#e8f5e9', opacity: '0.6'
    }));
  }
  root.appendChild(g);
}

// ── Walking character ──
function buildCharacter(x, y, fromX, fromY) {
  const ch = document.createElement('div');
  ch.className = 'map-character';
  ch.textContent = '\u{1F9D2}';

  if (fromX !== null && fromY !== null && (fromX !== x || fromY !== y)) {
    ch.style.left = fromX + '%';
    ch.style.top = fromY + '%';
    ch.classList.add('map-character--walking');
    if (x < fromX) ch.style.transform = 'translate(-50%, -50%) scaleX(-1)';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ch.style.left = x + '%';
        ch.style.top = y + '%';
        if (x >= fromX) ch.style.transform = 'translate(-50%, -50%)';
      });
    });
  } else {
    ch.style.left = x + '%';
    ch.style.top = y + '%';
  }
  return ch;
}

// ── Main render ──
export function renderMap(container) {
  const state = getState();
  const current = LOCATIONS[state.pos];
  container.innerHTML = '';

  const mapDiv = document.createElement('div');
  mapDiv.className = 'game-map';

  const s = svg('svg', { viewBox: '0 0 100 100', preserveAspectRatio: 'xMidYMid slice' });
  s.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%';

  // Layer order: terrain → paths → clearings → forest border (on top for depth)
  buildTerrain(s);
  buildPaths(s);
  buildClearings(s);
  buildForestBorder(s);

  mapDiv.appendChild(s);

  // Character
  const from = prevPos !== null ? LOCATIONS[prevPos] : current;
  mapDiv.appendChild(buildCharacter(
    current.x, current.y,
    prevPos !== null ? from.x : null,
    prevPos !== null ? from.y : null
  ));
  prevPos = null;

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

    const iconSpan = document.createElement('span');
    iconSpan.textContent = loc.icon;
    btn.appendChild(iconSpan);

    const label = document.createElement('span');
    label.className = 'map-node__label';
    label.textContent = loc.name;
    btn.appendChild(label);

    if (isReachable) {
      const mpText = document.createElement('span');
      mpText.className = 'map-node__mp';
      mpText.textContent = '1 MP';
      btn.appendChild(mpText);
      btn.addEventListener('click', () => moveToLocation(loc.id));
    }

    mapDiv.appendChild(btn);
  }

  container.appendChild(mapDiv);
}
