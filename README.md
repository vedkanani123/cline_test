# Nurture

**A personal AI health coach — food, movement, rest and real life in one plan that moves with you.**

This repository currently contains the **frontend concept demo**. There is no backend, no
AI model and no health-device access yet. What exists is a complete, clickable product
surface where **every control does something real** in local state, so the experience can be
reviewed and tested before any server is written.

```bash
npm install
npm run dev      # http://127.0.0.1:5173
```

Other commands:

```bash
npm run lint       # oxlint, warnings are errors
npm run typecheck  # tsc -b, strict
npm run build      # production build
npm run verify     # lint + build
```

## What is real in this demo

| Working | How it works |
|---|---|
| Goal setup | Focus, goal text, your reason, timeframe → saved to the demo store |
| Today | A next good step, daily rhythm, food/water/movement summary, 7-day map |
| Daily schedule | Per-day completion, editable times, move a moment to tomorrow |
| Check-in | Mood, energy, a note, plus small habit toggles |
| Food diary | Add from a sample catalog, servings, per-meal totals, remove entries |
| Photo review | Simulated detection with **editable** figures and a confidence label |
| Recipes | Filter/search, save, push ingredients to groceries, add to the meal plan |
| Meal planner | 7-day plan, build a grocery list from what you planned |
| Groceries | Add, group, tick off, clear completed |
| Water | Glass counter with a display cap and an honest note about targets |
| Workouts | Start a routine, complete sets one at a time, undo, finish, log history |
| Exercise library | Search by group and equipment, cues, easier and harder options |
| Yoga & mobility | Step-through flows that log a real session |
| Cardio | Quick-log walks, runs and rides |
| Activity history | Filter, totals, remove entries |
| Sleep | Log hours and quality, 7-day charts, averages |
| Recovery | Soreness/energy check that produces a plainly explained suggestion |
| Body metrics | Optional weight/waist entries, deletable, never a target |
| Habits & mood | Per-habit 7-day strips, mood log, daily note |
| Insights | Derived from your actual demo actions |
| Trends | 7/14/30-day charts, empty states instead of blank charts |
| Reports | Plain-language summary, copy to clipboard, download as text |
| Coach | Scripted chat with safety escalation, tone-aware replies |
| Voice | Simulated speech → proposed action → **confirm before saving** |
| Plan reviews | Accept or decline proposed plan changes |
| Circle of care | Up to five supporters, message ideas, copy to clipboard |
| Challenges | Join/leave, personal progress, no public leaderboard |
| Creator programs | Transparent revenue-share explanation |
| Kind points | Awarded once per rule per day, with visible caps |
| Badges | Collect with points, disabled until affordable |
| Connections | Per-device and per-app permission detail (nothing actually connects) |
| Import & export | Real JSON export/download, validated import, reset with confirm |
| Account | Profile, reminders, privacy toggles, tone, units, reduced motion |

## What is deliberately not real yet

- **No backend.** State lives in `sessionStorage` and disappears when the tab closes.
- **No AI.** Coach replies are scripted; photo detection is simulated.
- **No device access.** No sensor, watch, ring or health platform is contacted.
- **No account.** Sign-in validates shape only; nothing is verified or stored server-side.

Everything that is simulated says so on screen, in the same place the user would look.

## Repository layout

```
apps/web/                 React + TypeScript + Vite frontend
  src/catalog.ts          All 39 destinations, grouped
  src/content.ts          Sample content library
  src/router.tsx          Tiny dependency-free history router
  src/app/demo.tsx        Shared demo store (the single source of truth)
  src/app/toast.tsx       Toast notifications
  src/app/Shell.tsx       Searchable nav, mobile drawer, profile menu
  src/components/ui.tsx   Shared UI kit
  src/features/*          One module per workspace
  src/styles/*            Design system CSS
docs/FRONTEND_CONTRACT.md How every screen is built
PROJECT_IMPLEMENTATION_PLAN.md  The build plan and current status
```

## Safety boundaries

Nurture is an **adult wellness coach**, not a medical service.

- It never diagnoses, treats or cures anything.
- Photo estimates are editable drafts, never measurements.
- Points and badges never reward calorie restriction, extra exercise or weight change.
- Weight and measurements are optional and never framed as a target.
- Anything that looks medical is escalated to a qualified clinician or registered dietitian.
- Device and sleep figures are presented as trends, not measurements.

## Data

Nothing leaves the browser. `sessionStorage` holds a display name, your demo entries and your
preferences. "Delete everything" in Import & export clears it. When a backend exists, the
product must offer export and deletion as first-class features — that is a stated requirement,
not an afterthought.
