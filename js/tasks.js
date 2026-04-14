import lang from '../lang/en.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getTask(difficulty) {
  if (difficulty === 'easy') {
    const pool = lang.easyTasks;
    return { type: 'easy', data: pool[Math.floor(Math.random() * pool.length)] };
  }
  if (difficulty === 'med') {
    const pool = lang.medTasks;
    return { type: 'med', data: pool[Math.floor(Math.random() * pool.length)] };
  }
  if (difficulty === 'hard') {
    const pool = lang.hardTasks;
    return { type: 'hard', data: pool[Math.floor(Math.random() * pool.length)] };
  }
  return { type: 'easy', data: lang.easyTasks[0] };
}

export function renderEasyTask(container, task, accent, onWin, onFail) {
  container.innerHTML = '';

  const [sentence, correct, ...wrong] = task.data;

  const prompt = document.createElement('p');
  prompt.className = 'task-prompt';
  prompt.textContent = lang.ui.fillPrompt;
  container.appendChild(prompt);

  const sentenceDiv = document.createElement('div');
  sentenceDiv.className = 'task-sentence';
  const parts = sentence.split('___');
  const before = document.createTextNode(parts[0]);
  const gap = document.createElement('span');
  gap.className = 'task-gap';
  gap.style.borderBottomColor = accent;
  gap.textContent = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';
  const after = document.createTextNode(parts[1] || '');
  sentenceDiv.appendChild(before);
  sentenceDiv.appendChild(gap);
  sentenceDiv.appendChild(after);
  container.appendChild(sentenceDiv);

  const options = shuffle([correct, ...wrong]);
  const grid = document.createElement('div');
  grid.className = 'task-options';

  let answered = false;

  for (const opt of options) {
    const btn = document.createElement('button');
    btn.className = 'task-opt-btn';
    btn.textContent = opt;

    btn.addEventListener('click', () => {
      if (answered) return;
      answered = true;

      gap.textContent = opt;

      // Disable all buttons visually
      for (const b of grid.querySelectorAll('.task-opt-btn')) {
        b.disabled = true;
      }

      if (opt === correct) {
        btn.style.background = '#dcfce7';
        btn.style.borderColor = '#86efac';
        gap.style.color = '#16a34a';
        setTimeout(onWin, 800);
      } else {
        btn.style.background = '#fee2e2';
        btn.style.borderColor = '#fca5a5';
        gap.style.color = '#dc2626';
        // Highlight the correct one
        for (const b of grid.querySelectorAll('.task-opt-btn')) {
          if (b.textContent === correct) {
            b.style.background = '#dcfce7';
            b.style.borderColor = '#86efac';
          }
        }
        setTimeout(onFail, 800);
      }
    });

    grid.appendChild(btn);
  }

  container.appendChild(grid);
}

export function renderMedTask(container, task, accent, onWin, onFail) {
  container.innerHTML = '';

  const prompt = document.createElement('p');
  prompt.className = 'task-prompt';
  prompt.textContent = lang.ui.orderPrompt;
  container.appendChild(prompt);

  const hint = document.createElement('p');
  hint.className = 'task-hint';
  hint.innerHTML = '\u{1F4A1} ' + task.data.q;
  container.appendChild(hint);

  const buildZone = document.createElement('div');
  buildZone.className = 'task-build-zone';
  buildZone.style.borderColor = '#cbd5e1';

  const placeholder = document.createElement('span');
  placeholder.className = 'task-build-placeholder';
  placeholder.textContent = lang.ui.tapWords;
  buildZone.appendChild(placeholder);

  container.appendChild(buildZone);

  const pool = document.createElement('div');
  pool.className = 'task-word-pool';

  const allWords = shuffle([...task.data.w, ...task.data.x]);
  const built = [];

  function refreshPlaceholder() {
    const ph = buildZone.querySelector('.task-build-placeholder');
    if (built.length === 0 && !ph) {
      const newPh = document.createElement('span');
      newPh.className = 'task-build-placeholder';
      newPh.textContent = lang.ui.tapWords;
      buildZone.insertBefore(newPh, buildZone.firstChild);
    } else if (built.length > 0 && ph) {
      ph.remove();
    }
  }

  function addWordToBuild(word, poolBtn) {
    poolBtn.style.display = 'none';
    built.push({ word, poolBtn });

    const tag = document.createElement('button');
    tag.className = 'task-build-word';
    tag.style.background = accent + '22';
    tag.style.color = accent;
    tag.style.borderColor = accent;
    tag.textContent = word;

    tag.addEventListener('click', () => {
      // Return word to pool
      const idx = built.findIndex(b => b.poolBtn === poolBtn);
      if (idx !== -1) built.splice(idx, 1);
      tag.remove();
      poolBtn.style.display = '';
      refreshPlaceholder();
    });

    buildZone.appendChild(tag);
    refreshPlaceholder();
  }

  for (const word of allWords) {
    const btn = document.createElement('button');
    btn.className = 'task-pool-word';
    btn.style.borderColor = accent;
    btn.style.color = accent;
    btn.textContent = word;

    btn.addEventListener('click', () => {
      addWordToBuild(word, btn);
    });

    pool.appendChild(btn);
  }

  container.appendChild(pool);

  const checkBtn = document.createElement('button');
  checkBtn.className = 'btn-primary task-check-btn';
  checkBtn.style.background = accent;
  checkBtn.textContent = '\u2713 ' + lang.ui.check;

  checkBtn.addEventListener('click', () => {
    const builtWords = built.map(b => b.word);
    const validAnswers = [task.data.w, ...(task.data.alt || [])];

    const isCorrect = validAnswers.some(correct =>
      builtWords.length === correct.length && builtWords.every((w, i) => w === correct[i])
    );

    if (isCorrect) {
      buildZone.style.background = '#dcfce7';
      buildZone.style.borderColor = '#86efac';
      checkBtn.disabled = true;
      setTimeout(onWin, 800);
    } else {
      buildZone.style.background = '#fee2e2';
      buildZone.style.borderColor = '#fca5a5';

      setTimeout(() => {
        // Reset
        buildZone.style.background = '';
        buildZone.style.borderColor = '#cbd5e1';
        // Return all words to pool
        for (const b of built) {
          b.poolBtn.style.display = '';
        }
        built.length = 0;
        // Remove build-word buttons
        for (const tag of [...buildZone.querySelectorAll('.task-build-word')]) {
          tag.remove();
        }
        refreshPlaceholder();
        // Re-shuffle pool
        const poolBtns = [...pool.children];
        const shuffled = shuffle(poolBtns);
        pool.innerHTML = '';
        for (const b of shuffled) pool.appendChild(b);
      }, 1000);
    }
  });

  container.appendChild(checkBtn);
}

export function renderHardTask(container, task, accent, onWin) {
  container.innerHTML = '';

  const prompt = document.createElement('p');
  prompt.className = 'task-prompt';
  prompt.textContent = lang.writePrompt;
  container.appendChild(prompt);

  const question = document.createElement('p');
  question.className = 'task-hard-question';
  question.textContent = '\u2753 ' + task.data.q;
  container.appendChild(question);

  // Starters
  const starterLabel = document.createElement('p');
  starterLabel.className = 'task-helper-label';
  starterLabel.textContent = lang.startWith;
  container.appendChild(starterLabel);

  const starterRow = document.createElement('div');
  starterRow.className = 'task-starters';

  const textarea = document.createElement('textarea');
  textarea.className = 'task-textarea';
  textarea.rows = 3;
  textarea.placeholder = 'Write your answer here...';

  for (const st of task.data.st) {
    const btn = document.createElement('button');
    btn.className = 'task-starter-btn';
    btn.textContent = st;

    btn.addEventListener('click', () => {
      textarea.value = st + ' ';
      textarea.focus();
      updateWordCount();
      updateStarterHighlight();
    });

    starterRow.appendChild(btn);
  }
  container.appendChild(starterRow);

  // Word bank
  const wbLabel = document.createElement('p');
  wbLabel.className = 'task-helper-label';
  wbLabel.textContent = lang.words;
  container.appendChild(wbLabel);

  const wbRow = document.createElement('div');
  wbRow.className = 'task-word-bank';

  for (const w of task.data.wb) {
    const btn = document.createElement('button');
    btn.className = 'task-wb-btn';
    btn.style.borderColor = accent;
    btn.style.color = accent;
    btn.textContent = w;

    btn.addEventListener('click', () => {
      textarea.value += w + ' ';
      textarea.focus();
      updateWordCount();
    });

    wbRow.appendChild(btn);
  }
  container.appendChild(wbRow);

  // Textarea
  container.appendChild(textarea);

  // Word count
  const wordCount = document.createElement('div');
  wordCount.className = 'task-word-count';
  wordCount.textContent = '0 words';
  container.appendChild(wordCount);

  function countWords() {
    return textarea.value.trim().split(/\s+/).filter(w => w.length > 0).length;
  }

  function updateWordCount() {
    const n = countWords();
    wordCount.textContent = n + ' word' + (n !== 1 ? 's' : '');
    doneBtn.disabled = n < 3;
    if (n >= 3) {
      doneBtn.style.opacity = '1';
      wordCount.classList.add('task-word-count--ok');
    } else {
      doneBtn.style.opacity = '0.5';
      wordCount.classList.remove('task-word-count--ok');
    }
  }

  function updateStarterHighlight() {
    const val = textarea.value;
    for (const btn of starterRow.querySelectorAll('.task-starter-btn')) {
      if (val.startsWith(btn.textContent)) {
        btn.style.borderColor = accent;
        btn.style.background = accent + '18';
      } else {
        btn.style.borderColor = '#e2e8f0';
        btn.style.background = '';
      }
    }
  }

  textarea.addEventListener('input', () => {
    updateWordCount();
    updateStarterHighlight();
  });

  // Done button
  const doneBtn = document.createElement('button');
  doneBtn.className = 'btn-primary task-check-btn';
  doneBtn.style.background = accent;
  doneBtn.textContent = '\u2713 ' + lang.done;
  doneBtn.disabled = true;
  doneBtn.style.opacity = '0.5';

  doneBtn.addEventListener('click', () => {
    if (countWords() < 3) return;
    doneBtn.disabled = true;
    textarea.disabled = true;
    onWin();
  });

  container.appendChild(doneBtn);
}

export { lang };
