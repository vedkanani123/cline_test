import { useMemo, useState } from 'react';
import { Link } from '../../router';
import {
  PageHeader,
  Panel,
  StatGrid,
  Stat,
  Note,
  EmptyState,
  Meter,
  DayStrip,
  Row,
} from '../../components/ui';
import { WaterDrops } from '../../components/WaterDrops';
import {
  activityTotals,
  awardPoints,
  dayKey,
  formatKey,
  lastNDays,
  mealTotals,
  onDate,
  todayKey,
  uid,
  useDemo,
  weekdayLetter,
  weekdayName,
  type MealEntry,
} from '../../app/demo';
import { useToast } from '../../app/toast';
import { FOOD_CATALOG, HABIT_DEFS, MOMENTS, type Moment } from '../../content';

const WATER_DISPLAY_CAP = 8;

function momentKey(date: string, momentId: string) {
  return `${date}:${momentId}`;
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function nextMoment(momentsDone: string[], today: string): Moment {
  const remaining = MOMENTS.filter((moment) => !momentsDone.includes(momentKey(today, moment.id)));
  return remaining[0] ?? MOMENTS[0];
}

export function TodayOverview() {
  const { state, update, today } = useDemo();
  const { toast } = useToast();

  const todaysMeals = onDate(state.meals, today);
  const totals = mealTotals(todaysMeals);
  const todaysActivities = onDate(state.activities, today);
  const moveTotals = activityTotals(todaysActivities);
  const water = state.water[today] ?? 0;
  const doneCount = MOMENTS.filter((moment) => state.momentsDone.includes(momentKey(today, moment.id))).length;
  const step = nextMoment(state.momentsDone, today);
  const stepDone = state.momentsDone.includes(momentKey(today, step.id));

  const week = useMemo(
    () =>
      lastNDays(7).map((day) => ({
        day,
        marked:
          state.meals.some((meal) => meal.date === day) ||
          state.activities.some((activity) => activity.date === day) ||
          state.sleep.some((entry) => entry.date === day) ||
          state.checkIns.some((entry) => entry.date === day) ||
          Object.values(state.habits).some((dates) => dates.includes(day)),
      })),
    [state],
  );

  const completeStep = () => {
    if (stepDone) return;
    update((prev) => ({
      momentsDone: [...prev.momentsDone, momentKey(today, step.id)],
      points: awardPoints(prev, 'rule-moment', 'Completed a chosen moment', 1),
    }));
    toast(`${step.title} — marked done for today.`);
  };

  const addWater = () => {
    update((prev) => ({
      water: { ...prev.water, [today]: Math.min(WATER_DISPLAY_CAP, (prev.water[today] ?? 0) + 1) },
      points: awardPoints(prev, 'rule-water', 'Reached your own water goal', 2),
    }));
  };

  const addSampleMeal = () => {
    const item = FOOD_CATALOG[0];
    if (!item) return;
    const entry: MealEntry = {
      id: uid('meal'),
      date: today,
      slot: 'breakfast',
      name: item.name,
      servings: 1,
      kcal: item.kcal,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      fiber: item.fiber,
      source: 'catalog',
    };
    update((prev) => ({
      meals: [...prev.meals, entry],
      points: awardPoints(prev, 'rule-meal', 'Logged a meal', 2),
    }));
    toast(`${item.name} added as a sample breakfast.`);
  };

  return (
    <div className="page">
      <PageHeader
        kicker={`${weekdayName(today)} · your daily space`}
        title={`${greeting()}, ${state.name}.`}
        blurb={
          state.goal
            ? `You are working toward: ${state.goal.text}`
            : 'One thoughtful step is enough to begin. Choose a goal and a reason that matters to you — it takes about a minute.'
        }
        actions={
          state.goal ? undefined : (
            <Link className="button button--small" to="/app/plan/goals">
              Set my goal
            </Link>
          )
        }
      />

      <section className="hero-step" aria-labelledby="next-step">
        <p className="kicker">Your next good step · {step.time}</p>
        <h2 id="next-step">{step.title}</h2>
        <p className="muted" style={{ maxWidth: '48ch' }}>{step.detail}</p>
        <Row>
          <button type="button" className="button" onClick={completeStep} disabled={stepDone}>
            {stepDone ? 'Already done today' : 'Mark this done'}
          </button>
          <Link className="button button--ghost" to="/app/today/schedule">
            Edit my day
          </Link>
        </Row>
        <p className="muted">
          {doneCount} of {MOMENTS.length} moments complete · rest counts as a moment too
        </p>
      </section>

      <Panel
        title="Today, at a glance"
        subtitle="Your rhythm, always rearrangeable."
        actions={
          <Link className="button button--ghost button--small" to="/app/today/schedule">
            View daily schedule
          </Link>
        }
      >
        <div className="timeline">
          {MOMENTS.map((moment) => {
            const done = state.momentsDone.includes(momentKey(today, moment.id));
            return (
              <div key={moment.id} className={`timeline__row${done ? ' is-done' : ''}`}>
                <span className="timeline__time">{moment.time}</span>
                <div className="timeline__body">
                  <span className="timeline__title">{moment.title}</span>
                  <span className="timeline__detail">Flexible · {moment.detail}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <div className="grid-2">
        <Panel
          title="Food, made simple"
          actions={
            <Link className="button button--ghost button--small" to="/app/food/diary">
              Open food diary
            </Link>
          }
        >
          {totals.count === 0 ? (
            <EmptyState
              title="Your first meal"
              body="No meals logged today. Start with what you actually ate — detail is optional."
              action={
                <button type="button" className="button button--small" onClick={addSampleMeal}>
                  Add a sample breakfast
                </button>
              }
            />
          ) : (
            <>
              <StatGrid>
                <Stat label="Energy" value={totals.kcal} unit="kcal" hint="Sample entries" />
                <Stat label="Protein" value={`${totals.protein}g`} hint="Sample entries" />
                <Stat label="Fiber" value={`${totals.fiber}g`} hint="Sample entries" />
              </StatGrid>
              <ul className="list">
                {todaysMeals.map((meal) => (
                  <li className="list__item" key={meal.id}>
                    <div className="list__main">
                      <span className="list__title">{meal.name}</span>
                      <span className="list__meta">
                        {meal.slot} · {meal.servings} serving{meal.servings === 1 ? '' : 's'} · {meal.kcal} kcal
                      </span>
                    </div>
                    <button
                      type="button"
                      className="icon-button"
                      aria-label={`Remove ${meal.name}`}
                      onClick={() =>
                        update((prev) => ({ meals: prev.meals.filter((item) => item.id !== meal.id) }))
                      }
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Panel>

        <Panel
          title="Keep water close"
          actions={
            <Link className="button button--ghost button--small" to="/app/food/water">
              View water log
            </Link>
          }
        >
          <StatGrid>
            <Stat label="Today" value={water} unit={`of ${WATER_DISPLAY_CAP} glasses`} hint="Display cap, not a target" />
          </StatGrid>
          <WaterDrops value={water} max={WATER_DISPLAY_CAP} label={`${water} of ${WATER_DISPLAY_CAP} demo glasses`} />
          <Row>
            <button type="button" className="button button--small" onClick={addWater} disabled={water >= WATER_DISPLAY_CAP}>
              Add a glass
            </button>
            <button
              type="button"
              className="button button--ghost button--small"
              onClick={() => update({ water: { ...state.water, [today]: Math.max(0, water - 1) } })}
              disabled={water === 0}
            >
              Remove a glass
            </button>
          </Row>
          <Note tone="quiet">
            Hydration needs vary with body size, climate and activity. There is no single universal target, so this is a
            display cap rather than a goal to beat.
          </Note>
        </Panel>
      </div>

      <div className="grid-2">
        <Panel
          title="Movement your way"
          actions={
            <Link className="button button--ghost button--small" to="/app/move/workouts">
              Explore movement
            </Link>
          }
        >
          {moveTotals.sessions === 0 ? (
            <EmptyState
              title="Nothing logged yet"
              body="No movement logged today. Short sessions and rest both have a place in the plan."
              action={
                <Link className="button button--small" to="/app/move/cardio">
                  Log a 20-minute walk
                </Link>
              }
            />
          ) : (
            <>
              <StatGrid>
                <Stat label="Sessions" value={moveTotals.sessions} />
                <Stat label="Minutes" value={moveTotals.minutes} unit="min" />
              </StatGrid>
              <ul className="list">
                {todaysActivities.map((activity) => (
                  <li className="list__item" key={activity.id}>
                    <div className="list__main">
                      <span className="list__title">{activity.name}</span>
                      <span className="list__meta">{activity.detail}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Panel>

        <Panel title="The bigger picture" subtitle="Last seven days of logged actions.">
          <div className="week-map">
            {week.map((entry) => (
              <div className="week-map__day" key={entry.day}>
                <span
                  className={`week-map__dot${entry.marked ? ' is-marked' : ''}${
                    entry.day === today ? ' is-today' : ''
                  }`}
                >
                  {weekdayLetter(entry.day)}
                </span>
                <span className="week-map__label">{formatKey(entry.day).split(' ')[1]}</span>
              </div>
            ))}
          </div>
          <Meter value={week.filter((entry) => entry.marked).length} max={7} label="Days with a logged action" />
          <p className="muted">
            {week.filter((entry) => entry.marked).length} of 7 days have something recorded. Nothing here is a score.
          </p>
          <Link className="link-button" to="/app/progress/insights">
            View insights
          </Link>
        </Panel>
      </div>

      <Panel title="A question for today" className="panel--sage">
        <h3>What would help this day feel lighter?</h3>
        <p className="muted">
          The demo coach can help you choose a next step. Its replies are scripted, not live AI.
        </p>
        <Row>
          <Link className="button button--small" to="/app/coach/chat">
            Talk it through
          </Link>
          <Link className="button button--ghost button--small" to="/app/today/check-in">
            Quick check-in
          </Link>
        </Row>
      </Panel>
    </div>
  );
}

const MOOD_LABELS = ['Very hard', 'Hard', 'Steady', 'Good', 'Great'];
const ENERGY_LABELS = ['Running on empty', 'Low', 'Okay', 'Good', 'Full of energy'];

export function TodaySchedule() {
  const { state, update, today } = useDemo();
  const { toast } = useToast();
  const [selected, setSelected] = useState(today);
  const [times, setTimes] = useState<Record<string, string>>(() =>
    Object.fromEntries(MOMENTS.map((moment) => [moment.id, moment.time])),
  );

  const toggleMoment = (momentId: string) => {
    const key = momentKey(selected, momentId);
    const isDone = state.momentsDone.includes(key);
    update((prev) => ({
      momentsDone: isDone ? prev.momentsDone.filter((item) => item !== key) : [...prev.momentsDone, key],
    }));
  };

  const moveToTomorrow = (momentId: string) => {
    const tomorrow = dayKey(1);
    const key = momentKey(today, momentId);
    update((prev) => ({
      momentsDone: prev.momentsDone.filter((item) => item !== key),
      reminders: [
        ...prev.reminders,
        {
          id: uid('rem'),
          label: `${MOMENTS.find((moment) => moment.id === momentId)?.title ?? 'Moment'} moved from ${formatKey(today)}`,
          time: times[momentId] ?? '09:00',
          kind: 'move',
          enabled: true,
        },
      ],
    }));
    toast(`Moved to ${formatKey(tomorrow)}. Rescheduling is a demo preview — nothing is synced.`, 'info');
  };

  const doneForDay = MOMENTS.filter((moment) => state.momentsDone.includes(momentKey(selected, moment.id))).length;

  return (
    <div className="page">
      <PageHeader
        kicker="Today / Daily schedule"
        title="Your day, your shape."
        blurb="Move anything, keep what fits. Times here are a starting point, not a timetable you have to obey."
        actions={
          <Link className="button button--ghost button--small" to="/app">
            Back to Today
          </Link>
        }
      />

      <Panel title="Choose a day" subtitle="Completion is tracked per day, so you can look back honestly.">
        <DayStrip
          days={lastNDays(7)}
          active={selected}
          onSelect={setSelected}
          renderLabel={(day) => formatKey(day)}
        />
        <StatGrid>
          <Stat label="Moments complete" value={`${doneForDay} / ${MOMENTS.length}`} hint={formatKey(selected)} />
        </StatGrid>
      </Panel>

      <Panel title="The rhythm" subtitle="Toggle what happened. Change a time to see how the day reorganises.">
        <div className="timeline">
          {MOMENTS.map((moment) => {
            const done = state.momentsDone.includes(momentKey(selected, moment.id));
            return (
              <div key={moment.id} className={`timeline__row${done ? ' is-done' : ''}`}>
                <label className="field">
                  <span className="sr-only">Time for {moment.title}</span>
                  <input
                    type="time"
                    value={times[moment.id] ?? moment.time}
                    onChange={(event) => setTimes((prev) => ({ ...prev, [moment.id]: event.target.value }))}
                  />
                </label>
                <div className="timeline__body">
                  <span className="timeline__title">{moment.title}</span>
                  <span className="timeline__detail">{moment.detail}</span>
                  <Row>
                    <button type="button" className="button button--ghost button--small" onClick={() => toggleMoment(moment.id)}>
                      {done ? 'Mark as not done' : 'Mark done'}
                    </button>
                    {selected === today ? (
                      <button type="button" className="link-button" onClick={() => moveToTomorrow(moment.id)}>
                        Move to tomorrow
                      </button>
                    ) : null}
                  </Row>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel title="Add your own moment" subtitle="A reminder is the honest way to add something to a day you have not lived yet.">
        <Row>
          <Link className="button button--small" to="/app/account/reminders">
            Open reminders
          </Link>
          <Link className="button button--ghost button--small" to="/app/plan/week">
            See the week
          </Link>
        </Row>
      </Panel>

      <Note tone="quiet">
        Times and completions live in this browser session only. Nothing is sent to a server and no notification is
        actually scheduled in this demo.
      </Note>
    </div>
  );
}

export function TodayCheckIn() {
  const { state, update, today } = useDemo();
  const { toast } = useToast();

  const existing = state.checkIns.find((entry) => entry.date === today);
  const [mood, setMood] = useState(existing?.mood ?? 3);
  const [energy, setEnergy] = useState(existing?.energy ?? 3);
  const [note, setNote] = useState(existing?.note ?? '');

  const save = () => {
    update((prev) => ({
      checkIns: [...prev.checkIns.filter((entry) => entry.date !== today), { date: today, mood, energy, note }],
      mood: { ...prev.mood, [today]: mood },
      points: awardPoints(prev, 'rule-checkin', 'Checked in with yourself', 2),
    }));
    toast('Check-in saved for today. There is no wrong answer here.');
  };

  const toggleHabit = (habitId: string) => {
    const dates = state.habits[habitId] ?? [];
    const has = dates.includes(today);
    update({
      habits: { ...state.habits, [habitId]: has ? dates.filter((day) => day !== today) : [...dates, today] },
    });
  };

  const recent = [...state.checkIns].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 7);

  return (
    <div className="page">
      <PageHeader
        kicker="Today / Check-in"
        title="How did today actually feel?"
        blurb="Thirty seconds, no scoring. Honest answers are more useful than good ones — and a hard day is information, not failure."
      />

      <div className="grid-2">
        <Panel title="Mood" subtitle={MOOD_LABELS[mood - 1]}>
          <div className="segmented" role="group" aria-label="Mood from 1 to 5">
            {MOOD_LABELS.map((label, index) => (
              <button
                key={label}
                type="button"
                className={mood === index + 1 ? 'is-active' : ''}
                aria-pressed={mood === index + 1}
                onClick={() => setMood(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <p className="muted">1 = very hard day, 5 = a great day.</p>
        </Panel>

        <Panel title="Energy" subtitle={ENERGY_LABELS[energy - 1]}>
          <div className="segmented" role="group" aria-label="Energy from 1 to 5">
            {ENERGY_LABELS.map((label, index) => (
              <button
                key={label}
                type="button"
                className={energy === index + 1 ? 'is-active' : ''}
                aria-pressed={energy === index + 1}
                onClick={() => setEnergy(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <p className="muted">1 = running on empty, 5 = full of energy.</p>
        </Panel>
      </div>

      <Panel title="Anything worth remembering?" subtitle="Optional. One sentence is plenty.">
        <label className="field">
          <span className="field__label">Note for today</span>
          <textarea
            value={note}
            maxLength={280}
            placeholder="Slept badly but the walk helped. Work was intense."
            onChange={(event) => setNote(event.target.value)}
          />
        </label>
        <Row>
          <button type="button" className="button" onClick={save}>
            {existing ? 'Update today’s check-in' : 'Save check-in'}
          </button>
          <span className="muted">{note.length}/280 characters</span>
        </Row>
      </Panel>

      <Panel title="Small habits" subtitle="Tap anything that happened. Rest counts as a habit too.">
        <ul className="list">
          {HABIT_DEFS.map((habit) => {
            const dates = state.habits[habit.id] ?? [];
            const done = dates.includes(today);
            return (
              <li className="list__item" key={habit.id}>
                <div className="list__main">
                  <span className="list__title">{habit.label}</span>
                  <span className="list__meta">
                    {habit.hint} · {dates.length} day{dates.length === 1 ? '' : 's'} recorded
                  </span>
                </div>
                <button
                  type="button"
                  className={done ? 'button button--small' : 'button button--ghost button--small'}
                  aria-pressed={done}
                  onClick={() => toggleHabit(habit.id)}
                >
                  {done ? 'Done' : 'Mark done'}
                </button>
              </li>
            );
          })}
        </ul>
      </Panel>

      <Panel title="Recent check-ins">
        {recent.length === 0 ? (
          <EmptyState title="Nothing yet" body="Your first check-in will appear here." />
        ) : (
          <ul className="list">
            {recent.map((entry) => (
              <li className="list__item" key={entry.date}>
                <div className="list__main">
                  <span className="list__title">{formatKey(entry.date)}</span>
                  <span className="list__meta">
                    Mood {entry.mood}/5 · Energy {entry.energy}/5
                    {entry.note ? ` · ${entry.note}` : ''}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Note tone="quiet">
        Check-ins are stored in this browser session only. In the real product this is your data: exportable,
        correctable and deletable.
      </Note>
    </div>
  );
}
