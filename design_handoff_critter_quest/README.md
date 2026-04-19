# Handoff: Critter Quest — Retro Pixel-Art Redesign

## Overview

Critter Quest is a browser-based English-learning game for kids (ages 8–10). Players develop a small village by completing English grammar/vocabulary tasks at locations around an overworld map; each task awards MP (movement points) and progresses a collectable creature ("critter"). This handoff covers a **retro 16-bit pixel-art redesign** of three core views:

1. **Overworld Map** — the village and surrounding locations
2. **Task / Quiz Screen** — fill-in-the-blank (and related) English exercises
3. **Critter Collection** — progress tracker for the four collectable creatures

> **Naming / IP note.** The previous prototype used branded creature names (Pichu, Bulbasaur, Charmander, Eevee). The redesign replaces them with **original names**: **Voltpip** (spark/electric), **Leafling** (leaf/grass), **Emberpup** (fire), and **Sparklet** (shine/star). Please use these — or pick your own original set — and **do not ship the branded names** in the production app.

## About the Design Files

The files in this bundle are **design references created in HTML** — prototypes showing the intended look and behavior. They are **not production code to copy directly**. The task is to **recreate these HTML designs in the target codebase's existing environment** (React / Vue / SwiftUI / etc.) using the project's established patterns, state management, router, and asset pipeline. If no environment exists yet, pick the most appropriate stack for the project (React + Vite is a reasonable default for this kind of game) and implement the designs there.

Every "sprite" in the mockups is drawn as a **CSS grid of small colored divs** (no SVG, no PNG) driven by a tiny `PixelSprite` component. This is perfect for a design reference because it stays crisp at any zoom, but in production you will likely want to:

- Re-implement sprites as actual **PNG/WEBP sprite sheets** (or an SVG pixel-grid equivalent) served from `/assets/sprites/`
- OR keep the CSS-grid `PixelSprite` approach — it works fine in production and is easy to edit. Your call.

## Fidelity

**High-fidelity (hifi).** Colors, typography, borders, shadows, and layout are all final and intended to ship. Recreate pixel-perfectly in the target codebase.

---

## Selected variations (what to build)

From the canvas of six designs, the user chose these two variations plus the original overworld:

| View | Variation to build | Source file |
|---|---|---|
| Overworld Map | Original daylight pixel-art map | `Critter Quest - Map.html` |
| Task / Quiz | **Task B — RPG battle dialog** | `critter-views.jsx` → `TaskViewB` |
| Critter Collection | **Collection A — roster grid** | `critter-views.jsx` → `CollectionViewA` |

Ignore the other variations (Task A, Collection B, Map B) — they were alternatives.

---

## Design Tokens

### Colors

**Core UI**
| Token | Hex | Use |
|---|---|---|
| `--ink` | `#1a1420` | Primary border / text, almost-black plum |
| `--ink-2` | `#3d2b3f` | Secondary text |
| `--paper` | `#f4e8c8` | Warm paper background |
| `--paper-2` | `#e8d8a8` | Paper shadow |
| `--ui-bg` | `#fff4d8` | Panel background |

**Grass / Terrain**
| Token | Hex |
|---|---|
| `--grass-1` | `#a8d858` |
| `--grass-2` | `#8fc74a` |
| `--grass-3` | `#6ba832` |
| `--grass-4` | `#4a7c2a` |
| `--grass-dark` | `#2d5020` |

**Path / Sand / Water**
| Token | Hex |
|---|---|
| `--path-1` | `#f0d890` |
| `--path-2` | `#d8b868` |
| `--path-3` | `#a88844` |
| `--sand-1` | `#f8e4b0` |
| `--sand-2` | `#d8b870` |
| `--water-1` | `#8fe0f0` |
| `--water-2` | `#4ab8d8` |
| `--water-3` | `#2870a8` |

**Element colors** (one per critter / region type)
| Element | Hex | Light bg | Used by |
|---|---|---|---|
| Fire | `#e54b4b` | `#fff0e4` | Emberpup, Campfire, Volcano |
| Leaf | `#6fb544` | `#effbe0` | Leafling, Garden, Forest |
| Spark | `#f4c430` | `#fffbdc` | Voltpip, Tower |
| Shine | `#b572d9` | `#f7ecfc` | Sparklet, Meadow |
| Water | `#4ab8d8` | (accent) | Pond, Beach |

### Typography

Load via Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
```

| Role | Font | Size | Notes |
|---|---|---|---|
| Headings, buttons, labels, stats | **Press Start 2P** | 9–14px | Pixel font — **never scale above ~16px or it becomes unreadable**. Use for all-caps. |
| Body text, dialog, subtitles, numbers | **VT323** | 14–30px | Pixel-style monospace — readable at larger sizes. Use for question sentences and paragraph copy. |

Also set `-webkit-font-smoothing: none; font-smooth: never;` on the root to keep text crisp, and `image-rendering: pixelated` on any sprite container.

### Borders, shadows, corners

- **Border width: 3px solid `--ink`** is the universal rule. Never use rounded corners. Never use `border-radius`.
- **Shadow: hard offset, no blur.** Standard shadows: `3px 3px 0 0 rgba(0,0,0,.35)` for subtle, `3px 3px 0 0 #1a1420` for solid.
- **Button pressed state**: `transform: translate(3–4px, 3–4px)` + shadow collapses to `0 0 0 0`.
- **Active/selected glow**: triple stacked outline — `box-shadow: 0 0 0 3px #fff, 0 0 0 6px #1a1420, 0 0 0 9px #f4c430`.

### Spacing scale

4 / 6 / 8 / 10 / 12 / 14 / 16 / 20 / 24 / 32px. Use multiples of 2.

### Animation primitives

All animations must feel **stepped** (8-bit), not smooth. Use `animation-timing-function: steps(N)` everywhere.

| Name | Keyframes | Duration | Steps |
|---|---|---|---|
| `blink` | opacity 1 → 0 → 1 | 1s | `steps(2)` |
| `hop` | translateY 0 → -2px → 0 | 1s | `steps(2)` |
| `shimmer` | background-position 0 → 16px | 2s | `steps(4)` |
| `walkBob` (NPCs) | translateY 0 → -1.5px | 0.4s | `steps(2)` |
| `roam` (NPC paths) | waypoints every 25–33% | 10–18s | `linear` (movement) but the sprite bobs stepped |

---

## Screens / Views

### 1. Overworld Map

Source: `Critter Quest - Map.html` (fully working reference)

**Purpose.** Player's home base. Shows the village at center, 8 surrounding locations connected by dashed-road paths. Each location has an element (fire/leaf/spark/shine/water), an MP cost (usually 1), and a progress cap (6 per element). Villagers and mini-critters wander along the paths.

**Layout (portrait, max-width 720px).**

```
┌─────────────────────────────────┐
│ Header bar (house + title + HUD chips) │
├─────────────────────────────────┤
│ Stats row: 4 element pills              │
├─────────────────────────────────┤
│                                         │
│   MAP FRAME (1:1 aspect ratio)          │
│   ├─ grass tiles (repeating-linear)     │
│   ├─ sand beach (top band)              │
│   ├─ water sea (top center, inside sand)│
│   ├─ dashed roads between nodes         │
│   ├─ 9 location nodes                   │
│   ├─ 4 corner badges (element counters) │
│   ├─ scattered trees (decor)            │
│   └─ wandering NPCs + mini critters     │
│                                         │
│   footer: ▶ active node · MAP 01        │
├─────────────────────────────────┤
│ Village / Action panel                  │
│   [House icon] VILLAGE  ▸ your base     │
│   [REST +3 MP button, full width]       │
├─────────────────────────────────┤
│ Critter roster (4 columns)              │
├─────────────────────────────────┤
│ ‹ RESET GAME                            │
└─────────────────────────────────┘
```

**Nodes (percentage positions in the map canvas, `transform: translate(-50%,-50%)`)**

| Key | x,y | Label | Element | Cost |
|---|---|---|---|---|
| village | 50, 50 | VILLAGE | — | 0 |
| beach | 50, 12 | BEACH | water | 1 |
| garden | 25, 30 | GARDEN | leaf | 1 |
| pond | 75, 30 | POND | water | 1 |
| forest | 10, 50 | FOREST | leaf | 1 |
| tower | 90, 50 | TOWER | spark | 1 |
| campfire | 25, 70 | CAMPFIRE | fire | 1 |
| meadow | 75, 70 | MEADOW | shine | 1 |
| volcano | 50, 88 | VOLCANO | fire | 1 |

**Connections** (road edges, draw a dashed line from A to B):
- village → beach, garden, pond, forest, tower, campfire, meadow, volcano
- garden → beach, beach → pond, garden → forest, pond → tower
- forest → campfire, tower → meadow, campfire → volcano, meadow → volcano

**Node tile** — 56×48px, `#fff4d8` background tinted with element color at 13% alpha, `3px solid #1a1420` border, `3px 3px 0 rgba(0,0,0,.4)` shadow. Contains a 2.6× pixel sprite centered. Label below in Press Start 2P 8px with 1px ink-colored text-shadow (outline). If cost > 0, show `1 MP` under the label in `#fce078` with 1px text-shadow.

**Corner badges** — 56×56, positioned `-10px` inset on each corner. Border colored by element (leaf TL, spark TR, fire BL, shine BR). Inside: element glyph + `count/cap` number in Press Start 2P 9px.

**Sand beach** — `left:22%; top:1%; width:56%; height:22%`. Background: `repeating-linear-gradient(45deg, #f8e4b0 0 4px, #d8b870 4px 8px)` + a few radial dots at low alpha for dither. `3px solid #a88844` border. On top of the sand: a tiny sand castle sprite, 3 colored seashells, and 5 footprint dots.

**Sea** — `left:30%; top:1%; width:40%; height:13%`, sitting on top of the sand. Repeating stripes `#8fe0f0 / #4ab8d8`, `3px solid #2870a8` border, shimmering via `animation: shimmer 2s steps(4) infinite`.

**Wandering NPCs / critters** — 5 sprites, each positioned `absolute`, `transform: translate(-50%,-50%)`, `z-index:3`. Each has a `roamA..roamE` keyframe animation (see Animations table) that moves the sprite between 3–4 waypoints over 10–18s. Inside the sprite, a child element runs `walkBob 0.4s steps(2) infinite` for a 1.5px vertical bob.

**Header bar** — 3 chips right-aligned: foot icon + MP, book icon (opens Collection), paw icon + total captured count.

**Stats row** — 4 element pills, each `3px solid ${elementColor}`, pastel element tint background, glyph + count.

**Village action panel** — below the map. Row with 64×64 house tile, "VILLAGE" title (Press Start 2P 14), "▸ your base camp" subtitle (VT323 18). Then a full-width **REST +3 MP** button (Press Start 2P 12, `#a8d858` background).

**Critter roster** — 4-column grid at the bottom. Each cell: pixel sprite top, name below, tinted background matching element, hover lifts `translateY(-2px)`.

### 2. Task / Quiz Screen — **VARIATION B (RPG battle dialog)**

Source: `critter-views.jsx` → `TaskViewB`

**Purpose.** When the player taps a non-village location that has budget (MP) and capacity, show a task. If they answer correctly, award +1 to that location's element and close. Wrong answer = try again or flee.

**Layout (portrait, 520px wide).**

```
┌─────────────────────────────────┐
│ HEADER — dark plum panel            │
│  [Campfire sprite]                  │
│   CAMPFIRE QUEST                    │
│   Battle #07 · Grammar              │
│                        [+1 FIRE]    │
├─────────────────────────────────┤
│ DIALOG BOX (paper inside ink border)│
│  ▸ COMPLETE THE SENTENCE            │
│                                     │
│  She [speaks] English very well.    │
│                                     │
│                                  ▼  │
├─────────────────────────────────┤
│ Answer grid, 2×2:                   │
│  [A▸ SPEAK]   [B▸ SPEAKING]         │
│  [C▸ SPOKE]   [D▸ SPEAKS]           │
├─────────────────────────────────┤
│ [◂ FLEE]   [ATTACK ▸]               │
└─────────────────────────────────┘
```

**Tokens**
- Screen background: `#1a1420` (deep plum)
- Header: `#2a1830` bg, `3px solid #f4c430` border, `3px 3px 0 0 #000` shadow
- Header title: Press Start 2P 13, `#f4c430`
- Header subtitle: VT323 16, `#fce078`
- Dialog box: `#f4e8c8` bg, `4px solid #1a1420` border with `inset 0 0 0 2px #f4c430` (double frame), padding 18px, min-height 130px
- Prompt line: VT323 28, ink, line-height 1.4
- Blank for selected answer: inline span, `#ffc040` bg, `3px solid #1a1420`, padding `0 10px`, min-width 100, centered
- Blinking ▼ at bottom-right of dialog: Press Start 2P 8, `#e54b4b`
- Answer button: 2×2 grid, 10px gap
  - Default: `#2a1830` bg, `3px solid #f4c430`, `#fce078` text, `3px 3px 0 0 #000` shadow
  - Prefix letter (`A▸ / B▸ / C▸ / D▸`) in `#e54b4b`, right-padded 8
  - Selected: `#c8e890` bg, `3px solid #2d5020`, ink text; prefix letter goes `#2d5020`
  - Wrong: `#ffb8b8` bg, `3px solid #c83820` (show briefly, reset)
- Bottom actions: flex row, 10px gap
  - **FLEE** — `flex:1`, `#e54b4b` bg, white text, Press Start 2P 10
  - **ATTACK** — `flex:2`, `#6fb544` bg, white text, Press Start 2P 10

**Behavior**
- Click an answer → mark selected. On commit (ATTACK), evaluate:
  - Correct → play a flash/sparkle on the answer, increment element count, grant MP, close after 600ms
  - Wrong → shake button, deduct 1 MP (or don't, per designer), re-enable choices
- FLEE → close without reward, refund 0 MP
- Keyboard: 1/2/3/4 or A/B/C/D select, Enter commits, Esc flees.

**Content variety.** The Campfire example is fill-in-the-blank. The same component handles:
- Fill-in-the-blank (shown)
- Multiple choice (hide the blank, put the question as prompt text)
- Picture-match (replace one answer tile with a sprite)
- Translate PL↔EN (VT323 prompt, 4 word options)

All use the **same 4-answer layout** — only the prompt area changes.

### 3. Critter Collection — **VARIATION A (roster grid)**

Source: `critter-views.jsx` → `CollectionViewA`

**Purpose.** Show the four collectable critters, their current stage, XP-style progress toward the next stage, and the badge unlocked by hitting milestones.

**Layout (portrait, 520px wide).**

```
┌─────────────────────────────────┐
│ GameHeader (same as map)        │
├─────────────────────────────────┤
│ StatsRow (4 element pills)      │
├─────────────────────────────────┤
│ 2×2 grid of critter cards:      │
│  ┌─────────┐  ┌─────────┐       │
│  │ VOLTPIP │  │LEAFLING │       │
│  │ [sprite]│  │ [sprite]│       │
│  │ • • •   │  │ • • •   │       │
│  │ Stage 1 │  │ Stage 1 │       │
│  │ [ bar ] │  │ [ bar ] │       │
│  │  0/6    │  │  0/6    │       │
│  │ 🔒 BADGE│  │ 🔒 BADGE│       │
│  └─────────┘  └─────────┘       │
│  ┌─────────┐  ┌─────────┐       │
│  │EMBERPUP │  │SPARKLET │       │
│  │  ...    │  │  ...    │       │
│  └─────────┘  └─────────┘       │
├─────────────────────────────────┤
│ ▸ Collect element items on map! │
└─────────────────────────────────┘
```

**Critter card**
- Background: element's light bg (`#fff8dc` / `#e4f4cc` / `#ffe4d4` / `#eed8f4`)
- Border: `3px solid #1a1420`; shadow `3px 3px 0 0 #1a1420`
- Padding 12px
- **Sprite frame**: 72×72 white box, `3px solid #1a1420`, `inset 0 0 0 2px ${elementColor}`, sprite rendered at scale 3.5× centered
- **Name** (Press Start 2P 11, ink, centered, uppercase)
- **Stage dots**: 3 dots, 10×10, filled with `elementColor` if `i < stage` else `#c8c0b8`, each `2px solid #1a1420`. Followed by Press Start 2P 8 text `STAGE {stage}/3`
- **XP bar**: 14px tall, `#fff` bg, `3px solid #1a1420`; fill = `elementColor` with diagonal shimmer overlay (`repeating-linear-gradient(90deg, rgba(255,255,255,.2) 0 4px, transparent 4px 8px)`)
- **Count line**: Press Start 2P 9, `count/cap`, centered
- **Badge chip**: `rgba(0,0,0,.05)` bg, `2px dashed #1a1420` border, lock sprite + Press Start 2P 8 `#6b4020` label, e.g. `SPARK COLLECTOR (3/6)`

**Critter data**
| Critter | Element | Element color | Card bg | Badge |
|---|---|---|---|---|
| Voltpip | spark | `#f4c430` | `#fff8dc` | SPARK COLLECTOR (3/6) |
| Leafling | leaf | `#6fb544` | `#e4f4cc` | SEED GATHERER (3/6) |
| Emberpup | fire | `#e54b4b` | `#ffe4d4` | FLAME STARTER (3/6) |
| Sparklet | shine | `#b572d9` | `#eed8f4` | STAR SEEKER (3/6) |

**Stage progression** — stage advances when count hits `cap/3, cap*2/3, cap`. With cap=6: stage 1 at 0–1, stage 2 at 2–3, stage 3 at 4–6 (tunable).

---

## Interactions & Behavior

**Global navigation.** Three top-level views reachable from the header: **Map** (default), **Collection** (book icon), **Task** (opens as a modal/overlay when a map node is tapped).

**Map → Task.** Clicking a non-village node:
1. If `mp < node.cost` → toast "NOT ENOUGH MP!"
2. If `counts[element] >= caps[element]` → toast "{NODE} IS FULL!"
3. Otherwise → open TaskViewB for this location. On correct answer: `mp -= cost`, `counts[element] += 1`, `tasks += 1`, close.

**Rest button.** Adds +3 MP (no max cap, or cap at 10 if you prefer).

**Toasts.** Fixed-position, top-center, `#1a1420` bg, `#fce078` text, Press Start 2P 10, `3px solid #f4c430`, slide-in from above over 200ms.

**LocalStorage** — persist state under key `critter-quest-state-v1`:
```ts
{
  mp: number,
  tasks: number,
  activeNode: string,
  counts: { fire, leaf, spark, shine },
  caps:   { fire, leaf, spark, shine }  // 6 each
}
```

---

## State Management

```ts
type GameState = {
  mp: number;
  tasks: number;
  activeNode: NodeKey;
  counts: Record<Element, number>;
  caps:   Record<Element, number>;
  currentTask: Task | null;       // populated when a quiz is open
};

type Task = {
  locationKey: NodeKey;
  type: 'fill-blank' | 'multiple-choice' | 'picture-match' | 'translate';
  prompt: string;                  // e.g. "She ___ English very well."
  answers: string[];               // 4 options
  correctIndex: number;
  difficulty: 'EASY' | 'MED' | 'HARD';
};
```

Persistence is one-way write on every state change.

Task content should come from a **JSON file** (`tasks.json`) keyed by location — 15–30 tasks per location, picked at random. The app never runs out because it can re-cycle.

---

## Assets

- **Sprites.** Every sprite (critters, locations, NPCs, icons) is authored as a 2D character grid + palette map. See `critter-views.jsx` → `const SPR = { ... }` for all 24 sprites. Copy this object directly, or convert to `.png` if you prefer a bitmap pipeline.
- **Fonts.** Google Fonts: Press Start 2P + VT323.
- **No images, no SVG.** Everything is CSS.

---

## Files in this bundle

| File | Purpose |
|---|---|
| `README.md` | This document |
| `Critter Quest - Map.html` | Fully working overworld map (includes sand beach, wandering NPCs, Tweaks panel with day/dusk/night + palette) |
| `Critter Quest - All Views.html` | Design canvas showing all six variations side by side. Zoom/pan enabled. |
| `critter-views.jsx` | All view components as React (inline JSX). Contains `SPR` sprite atlas, `PixelSprite`, `GameHeader`, `StatsRow`, `TaskViewA/B`, `CollectionViewA/B`, `MapViewA/B`. |
| `design-canvas.jsx` | Canvas shell (not needed in production — just for the canvas reference file) |

**Start with `Critter Quest - Map.html`** — it's the most polished single-view reference, and its CSS token block at the top of the file is the source of truth for colors and spacing.

---

## Recommended implementation order

1. **Scaffold** — React + Vite + localStorage hook. Load fonts. Set root `image-rendering: pixelated; font-smooth: never;`.
2. **Design tokens** — port the CSS variables block from `Critter Quest - Map.html` into a `tokens.css` (or Tailwind theme).
3. **`PixelSprite` component** — port verbatim from `critter-views.jsx`. Add a `<SpriteAtlas>` file that exports the `SPR` object.
4. **Primitives** — `Panel`, `Chip`, `PixelButton`, `PixelSprite`. These cover ~80% of the UI.
5. **GameHeader + StatsRow** — used in all three views.
6. **Map view** — nodes, roads, sand/sea, corner badges. Wandering NPCs can be v2.
7. **Task modal (Variation B)** — wire to map-node clicks with task data from JSON.
8. **Collection view (Variation A)** — reads state, renders 2×2 grid.
9. **Polish** — toasts, animations (`blink`, `hop`, `shimmer`, `walkBob`), keyboard shortcuts.
10. **Content** — populate `tasks.json` with real English exercises for ages 8–10.
