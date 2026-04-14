import lang from '../lang/en.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function renderVocabRest(container, accent, onDone) {
  container.innerHTML = '';

  // Pick 4 random pairs
  const shuffled = shuffle(lang.vocab);
  const pairs = shuffled.slice(0, 4);
  const plShuffled = shuffle([...pairs]);

  // Title
  const title = document.createElement('p');
  title.className = 'vocab-title';
  title.textContent = lang.vocabTitle;
  container.appendChild(title);

  const hint = document.createElement('p');
  hint.className = 'vocab-hint';
  hint.textContent = lang.vocabHint;
  container.appendChild(hint);

  // Columns wrapper
  const columns = document.createElement('div');
  columns.className = 'vocab-columns';

  const leftCol = document.createElement('div');
  leftCol.className = 'vocab-col';
  const leftHeader = document.createElement('div');
  leftHeader.className = 'vocab-col-header';
  leftHeader.textContent = 'ENGLISH';
  leftCol.appendChild(leftHeader);

  const rightCol = document.createElement('div');
  rightCol.className = 'vocab-col';
  const rightHeader = document.createElement('div');
  rightHeader.className = 'vocab-col-header';
  rightHeader.textContent = 'POLSKI';
  rightCol.appendChild(rightHeader);

  let selectedEn = null; // { btn, en }
  let matched = 0;

  // English buttons (left)
  for (const pair of pairs) {
    const btn = document.createElement('button');
    btn.className = 'vocab-word';
    btn.textContent = pair.en;
    btn.dataset.en = pair.en;

    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      // Deselect previous
      if (selectedEn) {
        selectedEn.btn.classList.remove('vocab-word--selected');
        selectedEn.btn.style.background = '';
        selectedEn.btn.style.color = '';
      }
      selectedEn = { btn, en: pair.en };
      btn.classList.add('vocab-word--selected');
      btn.style.background = accent;
      btn.style.color = 'white';
    });

    leftCol.appendChild(btn);
  }

  // Polish buttons (right, shuffled)
  for (const pair of plShuffled) {
    const btn = document.createElement('button');
    btn.className = 'vocab-word';
    btn.textContent = pair.pl;
    btn.dataset.en = pair.en;

    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      if (!selectedEn) return;

      if (selectedEn.en === pair.en) {
        // Correct match
        btn.style.background = '#dcfce7';
        btn.style.color = '#166534';
        btn.style.opacity = '0.6';
        btn.disabled = true;

        selectedEn.btn.style.background = '#dcfce7';
        selectedEn.btn.style.color = '#166534';
        selectedEn.btn.style.opacity = '0.6';
        selectedEn.btn.disabled = true;

        selectedEn = null;
        matched++;

        if (matched === 4) {
          setTimeout(onDone, 600);
        }
      } else {
        // Wrong match
        btn.style.background = '#fee2e2';
        btn.style.color = '#dc2626';
        const wrongBtn = btn;
        const prevSelected = selectedEn;

        setTimeout(() => {
          wrongBtn.style.background = '';
          wrongBtn.style.color = '';
          if (prevSelected) {
            prevSelected.btn.classList.remove('vocab-word--selected');
            prevSelected.btn.style.background = '';
            prevSelected.btn.style.color = '';
          }
        }, 600);

        selectedEn = null;
      }
    });

    rightCol.appendChild(btn);
  }

  columns.appendChild(leftCol);
  columns.appendChild(rightCol);
  container.appendChild(columns);

  // Reward hint
  const reward = document.createElement('p');
  reward.className = 'vocab-reward';
  reward.textContent = lang.vocabReward;
  container.appendChild(reward);
}
