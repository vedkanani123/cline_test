# Nurture frontend contract

Everything in this file already exists and is verified by `npm run typecheck`.
Build screens against it instead of inventing new plumbing.

## Ground rules

1. **Frontend only.** No backend, no API calls, no API keys, no `fetch` to a server.
   All state comes from `useDemo()`. Nothing leaves the browser.
2. **Every control must actually work.** If a button cannot do something real yet, it must
   either do the closest real thing in local state, or be clearly disabled with a reason.
   No dead buttons, no "coming soon" placeholders.
3. **Honest labelling.** Sample/illustrative numbers get a visible note. Simulated features
   (photo AI, device sync, coach replies) say they are simulated. Never imply a diagnosis,
   and never present an estimate as a measurement.
4. **TypeScript is strict** with `verbatimModuleSyntax`, `noUnusedLocals`, `noUnusedParameters`.
   Use `import type { X } from '...'` for type-only imports. Do not add dependencies.
5. **No `any`.** No `@ts-ignore`.

## File layout and required exports

| File | Required exports |
|---|---|
| `src/features/marketing/Landing.tsx` | `Landing` |
| `src/features/auth/Auth.tsx` | `Auth({ mode }: { mode: 'login' \| 'register' })` |
| `src/features/today/Today.tsx` | `TodayOverview`, `TodaySchedule`, `TodayCheckIn` |
| `src/features/plan/PlanPages.tsx` | `PlanJourney`, `PlanWeek`, `PlanGoals` |
| `src/features/food/FoodPages.tsx` | `FoodDiary`, `FoodScan`, `FoodRecipes`, `FoodMealPlanner`, `FoodGroceries`, `FoodWater` |
| `src/features/move/MovePages.tsx` | `MoveWorkouts`, `MoveExercises`, `MoveYoga`, `MoveCardio`, `MoveHistory` |
| `src/features/wellbeing/WellbeingPages.tsx` | `WellbeingSleep`, `WellbeingRecovery`, `WellbeingBody`, `WellbeingHabits` |
| `src/features/progress/ProgressPages.tsx` | `ProgressInsights`, `ProgressTrends`, `ProgressReports` |
| `src/features/coach/CoachPages.tsx` | `CoachChat`, `CoachVoice`, `CoachReviews` |
| `src/features/community/CommunityPages.tsx` | `CommunityCircle`, `CommunityChallenges`, `CommunityCreators` |
| `src/features/rewards/RewardsPages.tsx` | `RewardsOverview`, `RewardsHistory` |
| `src/features/connections/ConnectionPages.tsx` | `ConnectionDevices`, `ConnectionApps`, `ConnectionImportExport` |
| `src/features/account/AccountPages.tsx` | `AccountProfile`, `AccountReminders`, `AccountPrivacy`, `AccountSettings` |

Each exported component takes **no props** and returns JSX.

## Page skeleton (use this shape)

```tsx
import { PageHeader, Panel, StatGrid, Stat, Note } from '../../components/ui';
import { Link } from '../../router';
import { useDemo } from '../../app/demo';
import { useToast } from '../../app/toast';

export function FoodDiary() {
  const { state, update, today } = useDemo();
  const { toast } = useToast();

  return (
    <div className="page">
      <PageHeader
        kicker="Food / Daily record"
        title="Food diary"
        blurb="What you ate today, in as much detail as you want."
        actions={<Link className="button button--ghost button--small" to="/app/food/scan">Review a photo</Link>}
      />
      <Panel title="Recorded today">
        <StatGrid>
          <Stat label="Energy" value={0} unit="kcal" hint="From your own entries" />
        </StatGrid>
      </Panel>
      <Note tone="quiet">Nutrition figures are illustrative examples, not a dietary assessment.</Note>
    </div>
  );
}
```

## `useDemo()` — the shared store

```ts
const { state, update, reset, setName, today } = useDemo();
```

- `state: DemoState` — read everything from here.
- `update(patch)` — accepts a partial object **or** a function `(prev) => partial`.
  It shallow-merges, so replace whole arrays: `update({ meals: [...] })`.
- `today: string` — today's key, `'YYYY-MM-DD'`.

`DemoState` fields (full types in `src/app/demo.tsx`):

```
name, goal, meals[], water{date:count}, activities[], sleep[], body[], habits{id:dates[]},
mood{date:1-5}, checkIns[], momentsDone[] ('date:momentId'), planChanges[], photoReviews[],
savedRecipes[], groceries[], mealPlan{date:recipeIds[]}, supporters[], joinedChallenges[],
points{earned,spent,log[]}, badges[], coach[], reminders[], connections{id:'connected'|'available'},
preferences{tone,units,personalizedInsights,shareWithCircle,productAnalytics,reducedMotion,reminderIntensity}
```

### Helper functions (import from `../../app/demo`)

```ts
uid(prefix?)                 // unique id
todayKey()                   // 'YYYY-MM-DD'
dayKey(offset)               // today + offset days
formatKey(key)               // 'Thu, 8 Oct'
weekdayLetter(key)           // 'T'
weekdayName(key)             // 'Thursday'
lastNDays(n)                 // array of date keys, oldest first
onDate(entries, date)        // filter anything with a .date field
mealTotals(meals)            // { kcal, protein, carbs, fat, fiber, count }
activityTotals(activities)   // { sessions, minutes, kinds }
awardPoints(state, ruleId, label, value)  // new points object, once per day per rule
round(n)
MEAL_SLOTS, ACTIVITY_KINDS, FOCUS_OPTIONS
```

Always award points through `awardPoints` so daily caps hold:

```ts
update((prev) => ({ meals: next, points: awardPoints(prev, 'rule-meal', 'Logged a meal', 2) }));
```

### Toasts

```ts
const { toast } = useToast();
toast('Oats with milk added to today’s diary.');
toast('Nothing was saved — this is a preview.', 'info');   // 'good' | 'info' | 'warn'
```

## Content library (`../../content`)

`FOOD_CATALOG` (12), `RECIPE_LIBRARY` (6), `EXERCISE_LIBRARY` (10), `ROUTINES` (2),
`YOGA_FLOWS` (4), `CARDIO_IDEAS` (4), `HABIT_DEFS` (5), `MOMENTS` (4), `CHALLENGES` (4),
`CREATORS` (4), `BADGES` (4), `POINT_RULES` (6), `DEVICES` (5), `APPS` (8),
`SAFETY_NOTES` (`scope`, `escalation`, `photo`, `device`, `finance`).

Read the file before using an item so field names match.

## UI kit (`../../components/ui`)

`PageHeader({ kicker, title, blurb, actions, children })`,
`Panel({ title, subtitle, actions, children, className, as })` — `className` may include
`panel--sage`, `panel--clay`, `panel--ink`, `panel--flush`,
`Stat({ label, value, unit, hint })`, `StatGrid`, `Chip({ tone })`,
`Toggle({ label, hint, checked, onChange })`, `Field({ label, hint, children })`,
`EmptyState({ title, body, action })`, `Note({ tone })`, `Meter({ value, max, label })`,
`DayStrip({ days, active, onSelect, renderLabel })`,
`BarChart({ data: {label,value}[], unit })`, `Sparkline({ values, label })`,
`Ring({ value, max, caption })`, `Row`, `Muted`.

Useful raw class names: `page`, `stack`, `stack--tight`, `grid-2`, `grid-3`, `row`,
`row--between`, `list`, `list__item`, `list__main`, `list__title`, `list__meta`,
`segmented` (+ `is-active`), `timeline`/`timeline__row`/`is-done`, `chat`/`bubble`,
`recipe-grid`/`recipe`, `check`, `badge-card`, `week-map`, `hero-step`, `meter`,
`divider`, `icon-button`, `muted`, `kicker`, `button` (+ `--ghost`, `--small`, `--block`),
`link-button`, `note` (+ `--warn`, `--quiet`, `--good`), `chip` (+ `--good/--warn/--info/--quiet`).

Prefer the kit over new CSS. If a screen genuinely needs a new primitive, add it to
`src/styles/dashboard.css` with a comment.

## Navigation

```tsx
import { Link, navigate } from '../../router';
<Link to="/app/food/scan" className="button button--small">Review a photo</Link>
navigate('/app');   // programmatic
```

## Safety copy rules (non-negotiable)

- Never tell someone to eat less, restrict, or "burn off" food.
- Never present an estimate as a fact. Photo estimates: "editable estimate".
- Never diagnose. For medical questions, surface `SAFETY_NOTES.escalation`.
- Points/badges/revenue share: state they are illustrative and carry no cash value.
- Weight/measurements: never framed as a target or a score.
