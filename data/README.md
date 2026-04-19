# Task Library

Portable English-learning task collection (`tasks.json`) designed for reuse in any language-learning game.

## Overview

**125 tasks** across 4 categories:
- **40 Easy** — fill-in-the-blank (4 options)
- **30 Medium** — sentence ordering (words + distractors)
- **15 Hard** — free writing (question + starters + word bank)
- **40 Vocabulary** — EN/PL translation pairs

Target: English learners aged ~8-10, Polish speakers.

## Schema

Every task type has its own structure, documented in the top-level `schema` field of `tasks.json`.

### Easy — fill-in-the-blank
```json
{
  "sentence": "My name ___ Tom.",
  "correct": "is",
  "distractors": ["are", "has", "do"]
}
```
UI: show the sentence with `___` replaced by a gap, present `[correct, ...distractors]` shuffled as 4 buttons.

### Medium — sentence-ordering
```json
{
  "topic": "Describe your friend",
  "words": ["My", "friend", "is", "very", "kind"],
  "distractors": ["the", "has"],
  "alternatives": [["..."]]
}
```
UI: show all words (`words + distractors`) shuffled as chips, student drags them into order.

**Validation:** accept any arrangement of words from `words` that:
- Uses ≥3 words
- Uses no words from `distractors`
- Full correct = all `words` used (award reward)
- Partial = some `words` missing (yellow feedback, no reward)

### Hard — free writing
```json
{
  "question": "Describe your best friend...",
  "starters": ["My best friend is", "We like to"],
  "wordBank": ["tall", "short", "funny", "kind", ...]
}
```
UI: show question, clickable starters that insert text into a textarea, clickable word bank.

**Validation:** always accept once student writes ≥3 words (writing practice — no grammar check).

### Vocabulary — translation pair
```json
{ "en": "kind", "pl": "miły" }
```
UI: use for matching games, flashcards, translation quizzes.

## Usage in JavaScript

```js
const tasks = await fetch('tasks.json').then(r => r.json());

// Pick random easy task
const pick = tasks.easy[Math.floor(Math.random() * tasks.easy.length)];
console.log(pick.sentence, pick.correct);

// Render medium task
function renderMedium(task) {
  const allWords = [...task.words, ...task.distractors].sort(() => Math.random() - 0.5);
  // ...student builds answer from allWords
}

// Validate medium answer
function isValidMedium(built, task) {
  if (built.length < 3) return { valid: false, reason: 'too-short' };
  const pool = [...task.words];
  for (const word of built) {
    if (task.distractors.includes(word)) return { valid: false, reason: 'distractor' };
    const idx = pool.indexOf(word);
    if (idx === -1) return { valid: false, reason: 'invalid-word' };
    pool.splice(idx, 1);
  }
  return { valid: true, complete: built.length === task.words.length };
}
```

## Usage in Python

```python
import json, random

with open('tasks.json') as f:
    data = json.load(f)

# Random vocab pair
pair = random.choice(data['vocabulary'])
print(f"{pair['en']} = {pair['pl']}")

# Filter easy tasks about a topic
visiting_tasks = [t for t in data['easy'] if 'visit' in t['sentence'].lower()]
```

## Extending

To add more tasks, just append to the relevant array. Keep the same field names. Remember to update `stats` at the bottom.

To translate vocabulary to another language:
```json
{ "en": "kind", "pl": "miły", "de": "nett", "fr": "gentil" }
```
Consumers should read whichever target language they need.

## License

MIT — free to use, modify, redistribute. Attribution appreciated.
