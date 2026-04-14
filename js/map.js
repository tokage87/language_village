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

export function moveToLocation(id) {
  const state = getState();
  const current = LOCATIONS[state.pos];

  if (state.pos === id) return;
  if (!current.adj.includes(id)) return;
  if (state.mp < 1) return;

  setState({ pos: id, mp: state.mp - 1 });
  render();
}

export function renderMap(container) {
  const state = getState();
  const current = LOCATIONS[state.pos];

  container.innerHTML = '';

  const mapDiv = document.createElement('div');
  mapDiv.className = 'game-map';

  // SVG for connection lines
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.style.position = 'absolute';
  svg.style.top = '0';
  svg.style.left = '0';
  svg.style.width = '100%';
  svg.style.height = '100%';

  const drawnEdges = new Set();
  for (const loc of LOCATIONS) {
    for (const adjId of loc.adj) {
      const edgeKey = [Math.min(loc.id, adjId), Math.max(loc.id, adjId)].join('-');
      if (drawnEdges.has(edgeKey)) continue;
      drawnEdges.add(edgeKey);

      const adj = LOCATIONS[adjId];
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', loc.x);
      line.setAttribute('y1', loc.y);
      line.setAttribute('x2', adj.x);
      line.setAttribute('y2', adj.y);
      line.setAttribute('stroke', '#5d4037');
      line.setAttribute('stroke-dasharray', '2,2');
      line.setAttribute('stroke-width', '0.5');
      line.setAttribute('opacity', '0.4');
      svg.appendChild(line);
    }
  }
  mapDiv.appendChild(svg);

  // Nodes
  for (const loc of LOCATIONS) {
    const isCurrent = loc.id === state.pos;
    const isReachable = !isCurrent && current.adj.includes(loc.id) && state.mp >= 1;
    const isLocked = !isCurrent && !isReachable;

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

    // Pin for current location
    if (isCurrent) {
      const pin = document.createElement('span');
      pin.className = 'map-node__pin';
      pin.textContent = '\u{1F4CD}';
      btn.appendChild(pin);
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
