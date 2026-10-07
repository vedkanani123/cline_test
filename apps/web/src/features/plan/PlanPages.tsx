import { useMemo, useState } from 'react';
import { Chip, EmptyState, Field, Meter, Muted, Note, PageHeader, Panel, Row, Stat, StatGrid } from '../../components/ui';
import { Link } from '../../router';
import { FOCUS_OPTIONS, dayKey, formatKey, lastNDays, parseKey, todayKey, useDemo, weekdayName } from '../../app/demo';
import type { FocusId } from '../../app/demo';
import { useToast } from '../../app/toast';
import { MOMENTS } from '../../content';

/** Milestones are written as abilities and habits on purpose — never as a weight or a number. */
const MILESTONES: { day: number; ability: string }[] = [
  { day: 7, ability: 'I can repeat one meal that works on a busy day.' },
  { day: 30, ability: 'I can move for ten minutes without overthinking it.' },
  { day: 60, ability: 'I can wind down before bed on most nights.' },
  { day: 100, ability: 'I can restart after a hard week without starting over.' },
];

function focusLabel(focus: FocusId): string {
  return FOCUS_OPTIONS.find((option) => option.id === focus)?.label ?? focus;
}

export function PlanJourney() {
  const { state, today } = useDemo();
  const { toast } = useToast();
  const goal = state.goal;

  const days = useMemo(() => lastNDays(30), []);
  const loggedDays = useMemo(
    () =>
      days.filter(
        (day) =>
          state.meals.some((meal) => meal.date === day) ||
          state.activities.some((activity) => activity.date === day) ||
          state.sleep.some((entry) => entry.date === day) ||
          state.checkIns.some((entry) => entry.date === day) ||
          Object.values(state.habits).some((dates) => dates.includes(day)),
      ),
    [days, state],
  );

  if (!goal) {
    return (
      <div className="page">
        <PageHeader
          kicker="Your plan / 100-day journey"
          title="A long view that stays kind"
          blurb="See the whole stretch at once, and keep it gentle when life gets busy."
        />
        <EmptyState
          title="No journey yet"
          body="Choose a focus and a reason that matters to you. It takes about a minute, and you can change it any time."
          action={
            <Link className="button button--small" to="/app/plan/goals">
              Set my goal
            </Link>
          }
        />
      </div>
    );
  }

  const elapsed = Math.max(0, Math.round((parseKey(today).getTime() - parseKey(goal.createdAt).getTime()) / 86400000));
  const total = Math.max(1, goal.days);
  const remaining = Math.max(0, total - elapsed);
  const reached = MILESTONES.filter((milestone) => elapsed >= milestone.day).length;

  return (
    <div className="page">
      <PageHeader
        kicker="Your plan / 100-day journey"
        title={`${state.name}'s ${total}-day journey`}
        blurb="A long view that stays kind to a hard week."
        actions={
          <Link className="button button--ghost button--small" to="/app/plan/goals">
            Edit my goal
          </Link>
        }
      />

      <Panel title="Where you are" subtitle={`Focus: ${focusLabel(goal.focus)}`}>
        <StatGrid>
          <Stat label="Days in" value={Math.min(elapsed, total)} unit="days" hint="Since you set this goal" />
          <Stat label="Days ahead" value={remaining} unit="days" hint="A window, not a deadline" />
          <Stat label="Logged recently" value={loggedDays.length} unit="/ 30" hint="Days with any entry" />
          <Stat label="Abilities started" value={reached} unit={`/ ${MILESTONES.length}`} hint="Milestones, not scores" />
        </StatGrid>
        <Meter value={Math.min(elapsed, total)} max={total} label="Progress through the planning window" />
        <Muted>Your goal: {goal.text}</Muted>
      </Panel>

      <Panel title="The last 30 days" subtitle="A day is marked when anything was logged — meals, movement, sleep, habits or a check-in.">
        <div className="week-map" role="img" aria-label={`Last 30 days: ${loggedDays.length} days with something logged`}>
          {days.map((day) => {
            const marked = loggedDays.includes(day);
            return (
              <span
                key={day}
                className={`week-map__dot${marked ? ' is-marked' : ''}${day === today ? ' is-today' : ''}`}
                title={`${formatKey(day)} — ${marked ? 'something logged' : 'nothing logged'}`}
              >
                {parseKey(day).getDate()}
              </span>
            );
          })}
        </div>
        <Muted>{loggedDays.length} of 30 days have something recorded. Gaps are part of a real life, not a failure.</Muted>
      </Panel>

      <Panel title="Abilities you are building" subtitle="Written as things you can do — never as a weight or a number on a scale.">
        <ul className="list">
          {MILESTONES.map((milestone) => {
            const done = elapsed >= milestone.day;
            return (
              <li className="list__item" key={milestone.day}>
                <span className="list__main">
                  <span className="list__title">{milestone.ability}</span>
                  <span className="list__meta">Around day {milestone.day}</span>
                </span>
                <Chip tone={done ? 'good' : 'quiet'}>{done ? 'Started' : 'Ahead'}</Chip>
              </li>
            );
          })}
        </ul>
      </Panel>

      <Panel title="After a hard week" subtitle="A rough stretch does not undo what you built." className="panel--sage">
        <Muted>Restarting is not starting over. Keep one small thing and let the rest wait.</Muted>
        <Row>
          <button
            type="button"
            className="button"
            onClick={() => toast('A hard week does not undo your progress. Pick one small thing for today and let the rest wait.', 'info')}
          >
            Restart gently
          </button>
          <Link className="button button--ghost" to="/app/plan/week">
            See this week
          </Link>
        </Row>
        <Note tone="quiet">This demo keeps everything in your browser session. Nothing is judged, scored or sent anywhere.</Note>
      </Panel>
    </div>
  );
}

export function PlanWeek() {
  const { state, update, today } = useDemo();
  const { toast } = useToast();
  const days = useMemo(() => Array.from({ length: 7 }, (_, index) => dayKey(index)), []);
  const [momentTimes, setMomentTimes] = useState<Record<string, string>>(() =>
    Object.fromEntries(MOMENTS.map((moment) => [moment.id, moment.time])),
  );

  const momentKey = (date: string, momentId: string) => `${date}:${momentId}`;

  const toggleMomentToday = (momentId: string) => {
    const key = momentKey(today, momentId);
    const done = state.momentsDone.includes(key);
    update((prev) => ({
      momentsDone: done ? prev.momentsDone.filter((item) => item !== key) : [...prev.momentsDone, key],
    }));
    toast(done ? 'Moment unmarked for today.' : 'Moment marked done for today.', 'info');
  };

  return (
    <div className="page">
      <PageHeader
        kicker="Your plan / This week"
        title="The week, rearrangeable"
        blurb="A seven-day view built from your own entries. Nothing here is locked in."
        actions={
          <Link className="button button--ghost button--small" to="/app/plan/journey">
            Open journey
          </Link>
        }
      />

      <Panel title="Seven days" subtitle="Planned meals, logged movement and your daily moments.">
        <div className="stack">
          {days.map((day) => {
            const planned = state.mealPlan[day] ?? [];
            const activities = state.activities.filter((activity) => activity.date === day);
            const isToday = day === today;
            return (
              <div className="stack stack--tight" key={day}>
                <div className="row row--between">
                  <span className="kicker">
                    {isToday ? 'Today' : weekdayName(day)} · {formatKey(day)}
                  </span>
                  <span className="muted">
                    {activities.length} logged · {planned.length} planned
                  </span>
                </div>
                {planned.length === 0 ? (
                  <Muted>No meals planned. Add some from the meal planner.</Muted>
                ) : (
                  <Row>
                    {planned.map((name, index) => (
                      <Chip key={`${day}-${index}`} tone="quiet">
                        {name}
                      </Chip>
                    ))}
                  </Row>
                )}
                {activities.length > 0 ? (
                  <ul className="list">
                    {activities.map((activity) => (
                      <li className="list__item" key={activity.id}>
                        <span className="list__main">
                          <span className="list__title">{activity.name}</span>
                          <span className="list__meta">
                            {activity.minutes} min · {activity.kind} · {activity.detail}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Muted>No movement logged for this day.</Muted>
                )}
                <Row>
                  {MOMENTS.map((moment) => {
                    const done = state.momentsDone.includes(momentKey(day, moment.id));
                    return isToday ? (
                      <button
                        key={moment.id}
                        type="button"
                        className={done ? 'button button--small' : 'button button--ghost button--small'}
                        aria-pressed={done}
                        onClick={() => toggleMomentToday(moment.id)}
                      >
                        {moment.title}
                      </button>
                    ) : (
                      <Chip key={moment.id} tone={done ? 'good' : 'quiet'}>
                        {moment.title}
                      </Chip>
                    );
                  })}
                </Row>
              </div>
            );
          })}
        </div>
      </Panel>


      <Panel title="Reschedule a moment" subtitle="A demo preview: change a time to see how rescheduling would feel.">
        <ul className="list">
          {MOMENTS.map((moment) => (
            <li className="list__item" key={moment.id}>
              <span className="list__main">
                <span className="list__title">{moment.title}</span>
                <span className="list__meta">{moment.detail}</span>
              </span>
              <Field label="Time" hint="Not saved to a server">
                <input
                  type="time"
                  value={momentTimes[moment.id] ?? moment.time}
                  onChange={(event) => setMomentTimes((prev) => ({ ...prev, [moment.id]: event.target.value }))}
                  aria-label={`Reschedule ${moment.title}`}
                />
              </Field>
            </li>
          ))}
        </ul>
        <Note tone="quiet">
          This is a preview of rescheduling only. The plan moves with life, and no change here is saved to a server.
        </Note>
      </Panel>

      <Panel title="Reminders" subtitle="Gentle nudges you control.">
        {state.reminders.length === 0 ? (
          <EmptyState title="No reminders yet" body="Add reminders from your account." />
        ) : (
          <ul className="list">
            {state.reminders.map((reminder) => (
              <li className="list__item" key={reminder.id}>
                <span className="list__main">
                  <span className="list__title">{reminder.label}</span>
                  <span className="list__meta">
                    {reminder.kind} · {reminder.time} · {reminder.enabled ? 'On' : 'Off'}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
        <Note tone="quiet">Reminders are not actually scheduled in this demo.</Note>
        <Link className="link-button" to="/app/account/reminders">
          Manage reminders
        </Link>
      </Panel>
    </div>
  );
}


export function PlanGoals() {
  const { state, update } = useDemo();
  const { toast } = useToast();
  const goal = state.goal;
  const [editing, setEditing] = useState(goal === null);
  const [focus, setFocus] = useState<FocusId>(goal?.focus ?? FOCUS_OPTIONS[0].id);
  const [text, setText] = useState(goal?.text ?? '');
  const [why, setWhy] = useState(goal?.why ?? '');
  const [days, setDays] = useState(goal?.days ?? 100);

  const clampDays = (value: number) => Math.min(365, Math.max(7, Math.round(value)));

  const startEdit = () => {
    setFocus(goal?.focus ?? FOCUS_OPTIONS[0].id);
    setText(goal?.text ?? '');
    setWhy(goal?.why ?? '');
    setDays(goal?.days ?? 100);
    setEditing(true);
  };

  const save = () => {
    if (!text.trim()) {
      toast('Add a short goal first — one sentence is plenty.', 'warn');
      return;
    }
    update({
      goal: {
        focus,
        text: text.trim(),
        why: why.trim(),
        days,
        createdAt: goal?.createdAt ?? todayKey(),
      },
    });
    setEditing(false);
    toast(goal ? 'Goal updated.' : 'Goal saved. You can change it any time.');
  };

  return (
    <div className="page">
      <PageHeader
        kicker="Your plan / Goals"
        title={goal ? 'Update your goal' : 'Set your goal'}
        blurb="What you are working toward, and why it matters to you."
        actions={
          <Link className="button button--ghost button--small" to="/app/plan/week">
            Weekly plan
          </Link>
        }
      />

      {goal && !editing ? (
        <Panel title="Your current goal" className="panel--sage">
          <p className="kicker">
            {focusLabel(goal.focus)} · {goal.days}-day window
          </p>
          <h3>{goal.text}</h3>
          <Muted>{goal.why ? `Why it matters: ${goal.why}` : 'No reason written yet. You can add one any time.'}</Muted>
          <Row>
            <button type="button" className="button" onClick={startEdit}>
              Edit goal
            </button>
            <Link className="button button--ghost" to="/app/plan/journey">
              Open journey
            </Link>
          </Row>
        </Panel>
      ) : (
        <Panel
          title={goal ? 'Update your goal' : 'A goal that fits your life'}
          subtitle="One sentence is enough. You can change it whenever life changes."
        >
          <div className="stack stack--tight">
            <span className="kicker">Focus</span>
            <div className="segmented" role="group" aria-label="Choose a focus">
              {FOCUS_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={option.id === focus ? 'is-active' : ''}
                  aria-pressed={option.id === focus}
                  onClick={() => setFocus(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <Muted>{FOCUS_OPTIONS.find((option) => option.id === focus)?.blurb}</Muted>
          </div>


          <Field label="Your goal" hint="Phrase it as something you can do, not a number to hit.">
            <input
              type="text"
              value={text}
              maxLength={140}
              placeholder="Build a steady weekday routine I can actually keep"
              onChange={(event) => setText(event.target.value)}
            />
          </Field>

          <Field label="Why this matters" hint="Optional, but it helps on the days you do not feel like it.">
            <textarea
              value={why}
              maxLength={280}
              placeholder="I want more energy in the evenings with my family."
              onChange={(event) => setWhy(event.target.value)}
            />
          </Field>

          <div className="stack stack--tight">
            <span className="kicker">Timeframe (days)</span>
            <Row>
              <button type="button" className="icon-button" aria-label="Seven fewer days" onClick={() => setDays((value) => clampDays(value - 7))}>
                −
              </button>
              <input
                type="number"
                min={7}
                max={365}
                value={days}
                aria-label="Timeframe in days"
                onChange={(event) => {
                  const next = Number(event.target.value);
                  if (!Number.isNaN(next)) setDays(clampDays(next));
                }}
              />
              <button type="button" className="icon-button" aria-label="Seven more days" onClick={() => setDays((value) => clampDays(value + 7))}>
                +
              </button>
            </Row>
          </div>

          <Row>
            <button type="button" className="button" onClick={save}>
              {goal ? 'Save changes' : 'Save goal'}
            </button>
            {goal ? (
              <button type="button" className="button button--ghost" onClick={() => setEditing(false)}>
                Cancel
              </button>
            ) : null}
            <Link className="button button--ghost" to="/app/plan/journey">
              Open journey
            </Link>
          </Row>
        </Panel>
      )}

      <Note tone="quiet">
        A timeframe is a planning window, not a deadline for body changes. This demo does not infer medical needs — for
        anything medical, talk to a qualified clinician.
      </Note>
      <Note tone="quiet">
        See the <Link className="link-button" to="/app/plan/week">week</Link> or the {' '}
        <Link className="link-button" to="/app/plan/journey">journey</Link> for the day-by-day view.
      </Note>
    </div>
  );
}

