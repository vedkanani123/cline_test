# Nurture — implementation plan

**Status:** frontend concept demo complete · backend not started
**Last updated:** this commit

## 1. The product in one paragraph

Nurture is a personal health coach for adults. You give it a goal — "100 days, I want to feel
better" — and it builds a daily routine around your real life: what to eat, when to move, when
to drink water, when to wind down. You log what actually happened (a meal, a photo, a walk, a
bad night), and each week it reviews the pattern, explains what it noticed and proposes one
small change. Nothing changes without your approval. It is a coach, not a clinic.

## 2. Principles the build follows

1. **One next step.** Opening the app answers "what now?" in under 20 seconds.
2. **Never shame.** A missed day is information. Rest counts as progress.
3. **Explain everything.** Any suggestion shows its reasoning and can be declined.
4. **Honest limits.** Estimates are labelled. Simulated features say they are simulated.
5. **Your data is yours.** Export and deletion are launch features, not settings buried later.
6. **Accessible by default.** Keyboard, focus, contrast, motion, plain language.

## 3. Workspaces and destinations

39 destinations across 11 workspaces. Every one resolves to a real screen.

| Workspace | Destinations |
|---|---|
| Today | Overview · Daily schedule · Check-in |
| Your plan | 100-day journey · Weekly plan · Goals |
| Food | Food diary · Review a meal photo · Recipes · Meal planner · Groceries · Water |
| Movement | Workouts · Exercise library · Yoga & mobility · Cardio & walks · Activity history |
| Wellbeing | Sleep · Recovery · Body metrics · Habits & mood |
| Progress | Insights · Trends · Reports |
| Coach | Ask Coach · Voice assistant · Plan reviews |
| Community | Circle of care · Small challenges · Creator programs |
| Rewards | Kind points · Badge history |
| Connections | Devices · Connected apps · Import & export |
| Account | Profile · Reminders · Privacy & data · Settings |

## 4. Architecture

```
apps/web/src
  catalog.ts          Route + navigation metadata (the single page map)
  content.ts          Sample content: foods, recipes, exercises, challenges, creators
  router.tsx          History-based router: Link, navigate, useLocation
  app/demo.tsx        DemoState + DemoProvider + useDemo() — one shared store
  app/toast.tsx       ToastProvider + useToast()
  app/Shell.tsx       Grouped searchable nav, drawer, profile menu, reset
  components/ui.tsx   PageHeader, Panel, Stat, Toggle, Meter, charts, DayStrip
  features/<area>/    One module per workspace
  styles/             base · shell · landing · dashboard · responsive
```

**Why one store.** The demo is only convincing if actions connect. Logging a meal in Food must
change Today, Insights and Kind points. `useDemo()` is the only writer, so that holds.

**Why no router dependency.** ~40 routes and no server rendering. A 90-line history router is
less risk than a version bump.

**Why `sessionStorage`.** It survives navigation and reload (so the demo feels real) and
disappears when the session ends (so nothing lingers).

## 5. Build phases

### Phase 0 — Foundation ✅ done
Scaffold, design tokens, UI kit, router, catalog, demo store, content library, shell,
toasts, contract document.

### Phase 1 — Public surface ✅ done
Landing page (hero, how it works, spaces, journey, FAQ, CTA), demo log in, demo registration,
not-found page.

### Phase 2 — Daily loop ✅ done
Today overview, daily schedule, check-in, goal editor, 100-day journey, weekly plan.

### Phase 3 — Food ✅ done
Food diary, photo review, recipes, meal planner, groceries, water.

### Phase 4 — Movement ✅ done
Workouts with live set tracking, exercise library, yoga flows, cardio logging, activity history.

### Phase 5 — Wellbeing ✅ done
Sleep, recovery, body metrics, habits and mood.

### Phase 6 — Progress ✅ done
Insights, trends, reports (copy + download).

### Phase 7 — Coach ✅ done
Scripted chat with safety escalation, voice simulation with confirm-before-save, plan reviews.

### Phase 8 — Community, rewards, account ✅ done
Circle of care, challenges, creator programs, kind points, badge history, profile, reminders,
privacy, settings, connections, import/export.

### Phase 9 — Verification 🔄 in progress
Typecheck, lint, production build, route sweep, responsive pass, accessibility pass,
safety-copy review.

### Phase 10 — Backend and real integrations ⛔ not started

| Area | Work |
|---|---|
| Accounts | Real auth, sessions, password reset, account deletion |
| Database | Health data model, migrations, row-level access control |
| API | Versioned REST/GraphQL, idempotent writes, optimistic updates |
| AI | Server-side model calls, prompt versioning, output validation, refusal rules |
| Food data | Licensed nutrition database, barcode coverage, regional foods |
| Vision | Photo estimation service with confidence and mandatory user confirmation |
| Devices | Apple HealthKit, Android Health Connect, Google Health, then vendor APIs |
| Notifications | Push scheduling with quiet hours and per-topic control |
| Evaluation | Golden-set tests for coach replies, safety refusals and photo estimates |
| Observability | Logging, tracing, error budgets, sync-failure dashboards |
| Compliance | Privacy review, data-protection impact assessment, clinical content review |
| Mobile | Package the web app, then add native health permissions |

## 6. What "done" means for the demo

- [x] Every catalog destination renders a real screen
- [x] Every visible control changes state or is disabled with a reason
- [x] Actions in one workspace appear in the others
- [x] State survives navigation and reload within the session
- [x] Reset restores a clean starting sample
- [x] Simulated features are labelled where the user would look
- [x] Safety copy reviewed: no restriction, no diagnosis, no false precision
- [x] Typecheck, lint and production build pass
- [x] Desktop, tablet and phone layouts reviewed
- [x] Keyboard navigation and visible focus

## 7. Known gaps (honest list)

- No automated tests yet. The next engineering task is a test setup: unit tests for the demo
  store and helpers, and end-to-end tests that walk every route.
- Charts are hand-rolled SVG/CSS. They are accurate but not yet accessible as data tables.
- Voice uses a text stand-in; no microphone is requested, deliberately.
- Photo review is simulated with fixed sample detections.
- Import accepts only JSON previously exported by this demo.
- No internationalisation yet; copy is written for a general audience in English.
- No dark theme. The palette is deliberately light and warm.

## 8. Next three tasks

1. **Test harness.** Vitest for `demo.tsx` helpers and a Playwright sweep over all 39 routes.
2. **Accessibility audit.** Run axe on every route; add data-table alternatives to every chart.
3. **Backend design spike.** Data model, auth, and the smallest possible API that lets a real
   account sync a day — before any AI is switched on.
