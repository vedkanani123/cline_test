import { useState } from 'react';
import { PageHeader, Panel, Stat, StatGrid, Note, EmptyState, BarChart, Sparkline, Row, Muted } from '../../components/ui';
import { Link } from '../../router';
import { useDemo, lastNDays, weekdayLetter, parseKey, formatKey, round, FOCUS_OPTIONS } from '../../app/demo';
import type { DemoState } from '../../app/demo';
import { useToast } from '../../app/toast';

/**
 * Progress screens: insights, trends and reports.
 *
 * Everything is derived from the demo state — counts of your own entries.
 * There is no score, no ranking and no clinical claim anywhere.
 */

type Summary = {
  daysLogged: number;
  meals: number;
  activities: number;
  minutes: number;
  sleepEntries: number;
  sleepHours: number;
  habits: number;
  checkIns: number;
};

/** A day counts as "logged" if anything at all was recorded on it. */
function hasAny(state: DemoState, day: string): boolean {
  return (
    state.meals.some((meal) => meal.date === day) ||
    state.activities.some((activity) => activity.date === day) ||
    state.sleep.some((entry) => entry.date === day) ||
    state.checkIns.some((entry) => entry.date === day) ||
    state.mood[day] !== undefined ||
    Object.values(state.habits).some((dates) => dates.includes(day))
  );
}

function minutesOn(state: DemoState, day: string): number {
  return state.activities
    .filter((activity) => activity.date === day)
    .reduce((total, activity) => total + activity.minutes, 0);
}

function summarize(state: DemoState, days: string[]): Summary {
  const meals = state.meals.filter((meal) => days.includes(meal.date));
  const activities = state.activities.filter((activity) => days.includes(activity.date));
  const sleep = state.sleep.filter((entry) => days.includes(entry.date));
  const checkIns = state.checkIns.filter((entry) => days.includes(entry.date));
  const habits = Object.values(state.habits).reduce(
    (total, dates) => total + dates.filter((day) => days.includes(day)).length,
    0,
  );
  return {
    daysLogged: days.filter((day) => hasAny(state, day)).length,
    meals: meals.length,
    activities: activities.length,
    minutes: activities.reduce((total, activity) => total + activity.minutes, 0),
    sleepEntries: sleep.length,
    sleepHours: sleep.reduce((total, entry) => total + entry.hours, 0),
    habits,
    checkIns: checkIns.length,
  };
}

function sum(days: string[], pick: (day: string) => number): number {
  return days.reduce((total, day) => total + pick(day), 0);
}

function plural(count: number, one: string, many: string): string {
  return count === 1 ? one : many;
}

function describeChange(what: string, before: number, after: number): string {
  if (before === after) return `${what}: steady across the period (${before} then ${after}).`;
  if (after > before) return `${what}: higher in the second half (${before} then ${after}).`;
  return `${what}: lower in the second half (${before} then ${after}).`;
}

function barLabel(day: string, range: number): string {
  return range <= 7 ? weekdayLetter(day) : String(parseKey(day).getDate());
}

function dayNumber(createdAt: string): number {
  const start = /^\d{4}-\d{2}-\d{2}$/.test(createdAt) ? parseKey(createdAt) : new Date(createdAt);
  if (Number.isNaN(start.getTime())) return 1;
  const elapsed = Math.floor((Date.now() - start.getTime()) / 86_400_000);
  return Math.max(1, elapsed + 1);
}

/** Seven-plus-day dot strip, reusing the shared `week-map` classes. */
function DayMap({ days, isMarked, today }: { days: string[]; isMarked: (day: string) => boolean; today: string }) {
  return (
    <div className="week-map" role="group" aria-label="Consistency for the selected range">
      {days.map((day) => (
        <div key={day} className="week-map__day">
          <span className={`week-map__dot${isMarked(day) ? ' is-marked' : ''}${day === today ? ' is-today' : ''}`}>
            {weekdayLetter(day)}
          </span>
          <span className="week-map__label">{parseKey(day).getDate()}</span>
        </div>
      ))}
    </div>
  );
}

export function ProgressInsights() {
  const { state } = useDemo();
  const summary7 = summarize(state, lastNDays(7));
  const summary30 = summarize(state, lastNDays(30));
  const goal = state.goal;
  const journeyDay = goal ? dayNumber(goal.createdAt) : 1;
  const focusLabel = goal ? FOCUS_OPTIONS.find((option) => option.id === goal.focus)?.label ?? goal.focus : '';

  const domains = [
    { id: 'food', label: 'Food', count: summary30.meals, unit: 'meals recorded', path: '/app/food/diary' },
    { id: 'movement', label: 'Movement', count: summary30.activities, unit: 'sessions logged', path: '/app/move/history' },
    { id: 'sleep', label: 'Sleep', count: summary30.sleepEntries, unit: 'nights recorded', path: '/app/wellbeing/sleep' },
    { id: 'habits', label: 'Habits', count: summary30.habits, unit: 'completions', path: '/app/wellbeing/habits' },
  ];

  const nextSteps = [
    { id: 'food', label: 'Food', count: summary7.meals, path: '/app/food/diary', suggestion: 'Log one meal today — detail is optional, and one is enough.' },
    { id: 'movement', label: 'Movement', count: summary7.activities, path: '/app/move/history', suggestion: 'A short walk or a stretch counts as movement today.' },
    { id: 'sleep', label: 'Sleep', count: summary7.sleepEntries, path: '/app/wellbeing/sleep', suggestion: 'Record last night’s rest — there is no target to hit.' },
    { id: 'habits', label: 'Habits', count: summary7.habits, path: '/app/wellbeing/habits', suggestion: 'Pick one habit to check off today, just one.' },
  ];
  const nextStep = [...nextSteps].sort((a, b) => a.count - b.count)[0];

  return (
    <div className="page">
      <PageHeader kicker="Progress / Insights" title="Insights" blurb="What your logged days add up to — no score, no ranking." />
      {goal ? (
        <Panel title="Your journey">
          <StatGrid>
            <Stat label="Journey day" value={journeyDay} unit={`of ${goal.days}`} hint={goal.text} />
            <Stat label="Focus" value={focusLabel} />
          </StatGrid>
        </Panel>
      ) : null}
      <Panel title="Your last 7 days" subtitle="Counts from your own entries.">
        <StatGrid>
          <Stat label="Days logged" value={`${summary7.daysLogged}/7`} />
          <Stat label="Meals" value={summary7.meals} />
          <Stat label="Activities" value={summary7.activities} />
          <Stat label="Minutes moved" value={summary7.minutes} unit="min" />
          <Stat label="Sleep entries" value={summary7.sleepEntries} />
          <Stat label="Habits done" value={summary7.habits} />
          <Stat label="Check-ins" value={summary7.checkIns} />
        </StatGrid>
      </Panel>
      <Panel title="Your last 30 days" subtitle="Counts from your own entries.">
        <StatGrid>
          <Stat label="Days logged" value={`${summary30.daysLogged}/30`} />
          <Stat label="Meals" value={summary30.meals} />
          <Stat label="Activities" value={summary30.activities} />
          <Stat label="Minutes moved" value={summary30.minutes} unit="min" />
          <Stat label="Sleep entries" value={summary30.sleepEntries} />
          <Stat label="Habits done" value={summary30.habits} />
          <Stat label="Check-ins" value={summary30.checkIns} />
        </StatGrid>
      </Panel>
      <Panel title="What you are tending" subtitle="A plain count of what you have logged in the last 30 days.">
        <div className="list">
          {domains.map((domain) => (
            <div key={domain.id} className="list__item">
              <div className="list__main">
                <span className="list__title">{domain.label}</span>
                <span className="list__meta">{domain.count} {domain.unit}</span>
              </div>
              <Link className="button button--ghost button--small" to={domain.path}>Open</Link>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="A suggestion" subtitle="One next step, clearly a suggestion — yours to ignore.">
        <p>{nextStep.suggestion}</p>
        <Row>
          <Link className="button button--small" to={nextStep.path}>Go to {nextStep.label}</Link>
        </Row>
      </Panel>
      <Note tone="quiet">
        These are counts of your own entries in this demo. They are not a health assessment and they do not diagnose anything.
      </Note>
    </div>
  );
}


const RANGES = [7, 14, 30] as const;
type Range = (typeof RANGES)[number];

export function ProgressTrends() {
  const { state, today } = useDemo();
  const [range, setRange] = useState<Range>(7);
  const days = lastNDays(range);

  const meals = days.map((day) => ({ label: barLabel(day, range), value: state.meals.filter((meal) => meal.date === day).length }));
  const minutes = days.map((day) => ({ label: barLabel(day, range), value: minutesOn(state, day) }));
  const sleepValues = days.map((day) => state.sleep.find((entry) => entry.date === day)?.hours ?? 0);
  const hasMeals = meals.some((point) => point.value > 0);
  const hasMinutes = minutes.some((point) => point.value > 0);
  const hasSleep = sleepValues.some((value) => value > 0);
  const loggedCount = days.filter((day) => hasAny(state, day)).length;

  return (
    <div className="page">
      <PageHeader
        kicker="Progress / Trends"
        title="Trends"
        blurb="Compare against your own baseline first — there is no target line here."
      />
      <div className="segmented" role="group" aria-label="Choose a time range">
        {RANGES.map((option) => (
          <button
            key={option}
            type="button"
            className={range === option ? 'is-active' : undefined}
            aria-pressed={range === option}
            onClick={() => setRange(option)}
          >
            {option} days
          </button>
        ))}
      </div>
      <Panel title="Meals per day" subtitle={`Last ${range} days`}>
        {hasMeals ? (
          <BarChart data={meals} />
        ) : (
          <EmptyState title="No meals logged" body="Log a meal and it will appear here. One meal is enough to start a pattern." />
        )}
      </Panel>
      <Panel title="Movement minutes per day" subtitle={`Last ${range} days`}>
        {hasMinutes ? (
          <BarChart data={minutes} unit="m" />
        ) : (
          <EmptyState title="No movement logged" body="A walk or a stretch of any length will show up here." />
        )}
      </Panel>
      <Panel title="Sleep hours" subtitle={`Last ${range} days`}>
        {hasSleep ? (
          <Sparkline values={sleepValues} label={`Sleep hours over the last ${range} days`} />
        ) : (
          <EmptyState title="No sleep logged" body="Record a night’s rest and it will appear here as a trend." />
        )}
      </Panel>
      <Panel title="Consistency" subtitle="Days where you logged anything at all.">
        <DayMap days={days} isMarked={(day) => hasAny(state, day)} today={today} />
        <Muted>{loggedCount} of {days.length} days have something logged.</Muted>
      </Panel>
    </div>
  );
}


function reportLines(state: DemoState, days: string[]): string[] {
  const s = summarize(state, days);
  const lines = [
    `You logged something on ${s.daysLogged} of ${days.length} days.`,
    `Food: ${s.meals} ${plural(s.meals, 'meal', 'meals')} recorded.`,
    `Movement: ${s.activities} ${plural(s.activities, 'session', 'sessions')} totalling ${s.minutes} minutes.`,
    `Sleep: ${s.sleepEntries} ${plural(s.sleepEntries, 'night', 'nights')} recorded${s.sleepEntries > 0 ? `, averaging ${round(s.sleepHours / s.sleepEntries)} hours` : ''}.`,
    `Habits: ${s.habits} ${plural(s.habits, 'completion', 'completions')} across your tracked habits.`,
    `Check-ins: ${s.checkIns} ${plural(s.checkIns, 'entry', 'entries')}.`,
  ];
  const mid = Math.floor(days.length / 2);
  const first = days.slice(0, mid);
  const second = days.slice(mid);
  lines.push(describeChange('Movement minutes', sum(first, (day) => minutesOn(state, day)), sum(second, (day) => minutesOn(state, day))));
  lines.push(describeChange('Days logged', first.filter((day) => hasAny(state, day)).length, second.filter((day) => hasAny(state, day)).length));
  return lines;
}

function buildReportText(state: DemoState, today: string, lines7: string[], lines30: string[]): string {
  return [
    `Nurture — self-reported summary for ${state.name}`,
    `Generated ${formatKey(today)}`,
    'This is a demo summary of your own entries. It is not a clinical record.',
    '',
    'Last 7 days',
    ...lines7.map((line) => `• ${line}`),
    '',
    'Last 30 days',
    ...lines30.map((line) => `• ${line}`),
  ].join('\n');
}

function ReportList({ lines }: { lines: string[] }) {
  return (
    <div className="stack stack--tight">
      {lines.map((line) => (
        <p key={line} className="list__meta">{line}</p>
      ))}
    </div>
  );
}


export function ProgressReports() {
  const { state, today } = useDemo();
  const { toast } = useToast();
  const lines7 = reportLines(state, lastNDays(7));
  const lines30 = reportLines(state, lastNDays(30));
  const reportText = buildReportText(state, today, lines7, lines30);

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(reportText);
      toast('Summary copied to your clipboard.');
    } catch {
      toast('Copying was blocked by your browser. Use “Download as text” instead.', 'warn');
    }
  }

  function downloadSummary() {
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'nurture-summary.txt';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    toast('Summary downloaded as a text file.');
  }

  return (
    <div className="page">
      <PageHeader
        kicker="Progress / Reports"
        title="Reports"
        blurb="A plain-language summary of your own entries, written to be easy to share."
        actions={
          <>
            <button type="button" className="button button--ghost button--small" onClick={() => { void copySummary(); }}>
              Copy summary
            </button>
            <button type="button" className="button button--small" onClick={downloadSummary}>
              Download as text
            </button>
          </>
        }
      />
      <Panel title="Last 7 days">
        <ReportList lines={lines7} />
      </Panel>
      <Panel title="Last 30 days">
        <ReportList lines={lines30} />
      </Panel>
      <Note tone="quiet">
        This is a self-reported summary of demo data you entered. It is not a clinical record and it does not diagnose
        anything. Share it with a clinician if it is useful to you.
      </Note>
    </div>
  );
}

