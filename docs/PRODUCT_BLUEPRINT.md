# Nurture — product blueprint

**Purpose:** the full specification for Nurture, a personal AI health coach for adults, so design,
engineering and clinical review work from one shared description.

**Scope and limitations:** this document describes the intended product, not the current build. The
shipped artefact today is a **frontend concept demo**: no backend, no AI model and no device access.
Where behaviour depends on a future service, it is described as a target. Nothing here is medical
advice, and no clinical claim should be inferred from it.

## Vision and promise

Nurture is a coach for real life, not a clinic and not a scoreboard. Its one-line promise is:

> **"Help me make the next healthy choice that fits my real life."**

The product answers one question better than anything else: *what is the single next good step for
me, right now, given how my day is actually going?* It builds a 100-day routine around food,
movement, rest and the messy constraints of a real schedule, and it adapts when life interrupts.

## Who it is for, and who it is not for

**For:** healthy adults who want to feel better, build sustainable habits, and would value a calm
coach that explains itself. **Not for:** anyone seeking diagnosis, treatment or clinical dietetics;
under-18s without a guardian's involvement; and anyone being treated for an eating disorder. In
those cases Nurture should direct people to a qualified clinician or registered dietitian rather
than attempt to help.

## The onboarding interview

The sign-up interview is the foundation of personalisation. Each group changes the plan.

| Group | Example questions | How the answers change the plan |
|---|---|---|
| Goal and motivation | What do you want to change? Why now? What would make this worth it? | Sets the goal text, the 100-day framing and the "why I started" card. |
| Schedule and constraints | What does a normal week look like? Shift work? Travel? When can you move? | Places moments in the day and selects life modes (travel, shift work). |
| Food and cooking reality | Who cooks? How much time? Budget? What do you already eat? | Chooses recipes, batch-cooking and budget guidance, pantry mode. |
| Movement and equipment | What equipment do you have? Any activity you enjoy or avoid? | Picks routines, equipment filters and accessible movement goals. |
| Sleep and energy | When do you sleep and wake? How rested do you feel? | Sets wind-down timing and the daily rhythm. |
| Health and limitations | Any conditions, injuries, medication, allergies? (safety branch) | Triggers escalation or a clinician prompt; blocks unsafe suggestions. |
| Consistency and what goes wrong | What has failed before? What tends to derail you? | Configures the restart, "rough week" mode and commitment dial. |
| Preferences and consent | Tone? Units? What may we collect and share? | Sets coach tone, units, notification intensity and consent scopes. |

Any health answer that could indicate a medical issue moves the interview to a **safety branch**
that pauses coaching and surfaces an escalation message.

## The daily loop

- **Morning briefing** — one short message: today's shape, the single next step, anything to watch.
- **Next good step** — a single, concrete action, always with a reason and an alternative.
- **Logging** — the minimum-effort record: a photo, a barcode, a saved meal, a tap for water.
- **Evening check-in** — mood, energy, a note; small habit toggles. A missed day is information.
- **Weekly review** — the pattern, explained plainly, with one proposed change that waits for approval.

## The 100-day operating model

| Phase | Days | Focus | How the plan adapts |
|---|---|---|---|
| Establish | 1–7 | One or two habits; learn the routine | Small, forgiving steps; heavy check-ins; no targets. |
| Build | 8–28 | Add movement and food structure | More variety; progressive overload begins; life modes start. |
| Deepen | 29–56 | Consistency and recovery | Deloading, sleep emphasis, tougher options offered. |
| Consolidate | 57–100 | Make it self-sustaining | Fewer prompts; user-led choices; a review of what to keep. |

Every phase change is proposed, explained and approved — never applied silently.

## Workspaces and screens

The product surface is **39 destinations across 11 workspaces**, matching the frontend contract.

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

## The coaching engine

A suggestion is produced in five steps: **gather** the relevant signals (goal, today's logs,
schedule, recent sleep, recovery, life mode); **rank** candidate next steps against the goal and the
user's constraints; **select** the single best step; **explain** it in one plain sentence with its
reason; and **offer** an alternative so the user always has a choice.

What it uses: goals and the "why", the food/water/movement record, sleep and recovery check-ins,
optional body metrics, declared limitations, and the current life mode. What it may **never** do:
diagnose or treat, tell someone to eat less or "burn off" food, present an estimate as a
measurement, comment on weight or calories as a score, or change the plan without consent. The
**human-in-the-loop rule** is absolute: any plan change is proposed, shown with its reasoning, and
saved only after the user approves it.

## Photo food logging

Photo logging is a speed shortcut, never a verdict. From an image it may estimate a dish's likely
composition, portion range, energy and macros. It **cannot** reliably know hidden ingredients,
recipe details, cooking fats, exact portion weight or brand. Every result carries a **mandatory
confidence label** and **requires user confirmation** before it is saved; the figures stay editable.
Failure modes to design for: a wrong dish, a plausible-looking but wrong portion, several foods in
one frame, and a confident output for a poor photo. The fix is always the same — label it an
estimate, make it editable, and ask.

## Movement programming

- **Strength:** routines built from the exercise library with form cues and easier/harder options;
  sets logged one at a time; progression is gradual and reversible.
- **Cardio:** walks, runs and rides logged the user's way, tracked against their own baseline.
- **Yoga and mobility:** short flows for stiff, busy days; a session counts when it is done.

Progression and deloading rules are deliberately non-clinical: increase one variable at a time,
never force a progression the user declined, and treat soreness or low energy as a signal to offer a
lighter option or a rest day. Rest is framed as progress, not absence.

## Reminders and notifications

Topics are granular — meals, water, movement, wind-down, check-ins, weekly review — and each can be
switched off. **Quiet hours** are respected by default. Three intensity levels exist:

| Level | What it does |
|---|---|
| Gentle | Occasional, soft nudges; easy to ignore. |
| Structured | Timed prompts tied to the daily rhythm. |
| Accountability | Checks in on a chosen commitment the user set for themselves. |

The boundary of accountability mode: it holds the user to a **process they chose**, never to a body
outcome; it never shames, never comments on weight or calories, and can be paused or lowered at any
time.

## Community and creator model

The **Circle of Care** is a private group of one to five supporters the user chooses, with
message ideas and granular sharing. **Small challenges** are personal-progress challenges with
join/leave and no public leaderboard. **Creator programs** let creators publish programmes with a
transparent, published revenue-share explanation. There is deliberately **no public leaderboard**:
ranking people by health metrics rewards the wrong behaviour and can harm the very people the
product is for.

## Rewards

Kind points are awarded through a single, visible rule set, **once per rule per day, with caps**
(for example, logging a meal, moving, checking in, hydrating). Crucially, **restriction, extra
exercise and weight change never earn points**, because rewarding them would encourage harm. Badges
are collected with points and disabled until affordable. All points, badges and revenue shares are
**illustrative and carry no cash value**; demo rewards are fictional.

## Data and integrations

The health-data hub is the neutral layer under the product. It reads and writes through **Apple
HealthKit** on iOS and **Android Health Connect / Google Health** on Android — designed around
Health Connect and Google Health rather than the superseded Google Fit — with vendor APIs added
later. Device categories include phones, watches, rings and bands. Permissions are granted
**per field**, and every connection states whether Nurture reads, writes or both. Duplicate records
from one-way or delayed sync are detected and merged rather than double-counted, and sync failure
has explicit UX: a clear status, the last successful sync time, and a retry that never silently
drops data.

## Architecture

| Layer | Responsibility | Why this boundary |
|---|---|---|
| Client | UI, local state, optimistic updates | Fast, offline-tolerant, and safe to build before any server exists. |
| API | Versioned, idempotent writes and reads | Idempotency makes retries safe and sync reliable. |
| Database | Health data model, row-level access control | Keeps each person's data isolated and auditable. |
| AI service | Server-side model calls, prompt versioning, output validation | Keeps keys server-side and outputs checkable and versioned. |
| Content service | Recipes, exercises, lessons, safety copy | Separates editorial content from code and lets it be reviewed. |
| Evaluation harness | Golden-set tests for replies, refusals and photo estimates | Makes quality and safety measurable before launch. |

## Safety and clinical governance

Anything that looks medical is **escalated** to a qualified clinician or registered dietitian rather
than answered. Content is reviewed before publication. The product **refuses** to diagnose, to
prescribe, to advise restriction or "burning off" food, and to comment on weight as a score. The
red-flag list that forces escalation includes: disordered-eating signs; very low or rapidly changing
intake or weight; chest pain, fainting or breathlessness on exertion; pregnancy and breastfeeding
questions; diabetes, kidney or heart conditions and their medication; severe allergies; and any
self-harm or mental-health crisis. In these cases Nurture stops coaching and points to real care.

## Privacy and compliance

Data is classified (account, health, sensitive) and consent is **granular per purpose**. **Export**
and **deletion** are first-class launch features. Retention is minimal and configurable, and the
founding principle is that **data is never sold**. A data-protection impact assessment and clinical
content review precede launch.

## Evaluation and quality gates

Before launch, the harness must pass: a **golden set of coach replies** (correct, non-shaming,
properly hedged); **safety refusals** (every red-flag prompt escalates and no diagnosis is given);
and **photo estimation accuracy bands** (estimates fall within declared tolerances and are always
labelled). Regression in any of these blocks release.

## Metrics that matter, and anti-metrics

Metrics that matter: whether users report making the next good choice more easily; whether plans
survive a bad week; approval quality on plan reviews; sync success; and safety-escalation
correctness. **Anti-metrics** — not success on their own: time-in-app, streak length and
notification volume. Long streaks and heavy usage can indicate compulsion rather than health.

## Phased roadmap

1. **Frontend demo (done):** every screen real in local state.
2. **Backend and accounts:** auth, data model, minimal sync for one day.
3. **AI, guarded:** server-side coach with validation, refusals and evaluation harness.
4. **Devices:** HealthKit and Health Connect/Google Health, one field at a time.
5. **Food data and vision:** licensed nutrition database plus photo estimation with confirmation.
6. **Community, rewards and creators:** with published terms and funded pools.
7. **Mobile packaging and launch:** native health permissions and store release.

## Open questions

Which signals actually change behaviour, and which are noise? How much logging is enough before it
becomes a burden? What wording keeps accountability supportive without pressure? How should the
product behave around weight for people at risk of disordered eating? These need **user research and
clinical input**, not assumptions.
