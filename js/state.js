const STORAGE_KEY = 'english_quest_state';

const INITIAL_STATE = {
  pos: 0,
  mp: 5,
  items: { fire: 0, nature: 0, electric: 0, magic: 0 },
  evo: { pikachu: 0, bulbasaur: 0, charmander: 0, eevee: 0 },
  done: 0,
};

let state = null;

export function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      state = JSON.parse(saved);
    } else {
      state = structuredClone(INITIAL_STATE);
    }
  } catch {
    state = structuredClone(INITIAL_STATE);
  }
  return state;
}

export function saveState(s) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
  state = structuredClone(INITIAL_STATE);
  saveState(state);
}

export function getState() {
  return state;
}

export function setState(partial) {
  Object.assign(state, partial);
  saveState(state);
}
