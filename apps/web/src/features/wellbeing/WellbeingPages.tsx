import { useState } from 'react';
import { PageHeader, Panel, Stat, StatGrid, Field, Note, EmptyState, BarChart, Sparkline, Row, Muted, Chip } from '../../components/ui';
import { Link } from '../../router';
import { useDemo, awardPoints, lastNDays, onDate, uid, round, weekdayLetter, parseKey, formatKey } from '../../app/demo';
import type { SleepEntry, BodyEntry, ActivityEntry, CheckIn } from '../../app/demo';
import { HABIT_DEFS, SAFETY_NOTES } from '../../content';
import { useToast } from '../../app/toast';

/**
 * Wellbeing screens: sleep, recovery, body metrics and habits & mood.
 *
 * Everything here is self-reported. Nothing diagnoses, nothing is a target,
 * and every measurement is optional.
 */

const QUALITY_LABELS = ['Poor', 'Fair', 'Okay', 'Good', 'Great'];
const SORENESS_LABELS = ['None', 'Mild', 'Some', 'A lot', 'A great deal'];
const ENERGY_LABELS = ['Empty', 'Low', 'Steady', 'Good', 'Full'];
const MOOD_LABELS = ['Rough', 'Low', 'Okay', 'Good', 'Bright'];

/** A small 1–5 picker that reads as the shared `segmented` control. */
function ScaleButtons({
  value,
  onChange,
  labels,
  name,
}: {
  value: number;
  onChange: (next: number) => void;
  labels: string[];
  name: string;
}) {
  return (
    <div className="segmented" role="group" aria-label={name}>
      {labels.map((label, index) => {
        const optionValue = index + 1;
        const active = value === optionValue;
        return (
          <button
            key={label}
            type="button"
            className={active ? 'is-active' : undefined}
            aria-pressed={active}
            onClick={() => onChange(optionValue)}
          >
            {optionValue} · {label}
          </button>
        );
      })}
    </div>
  );
}

/** Seven-day dot strip, reusing the shared `week-map` classes. */
function DayDots({ days, isMarked, today }: { days: string[]; isMarked: (day: string) => boolean; today: string }) {
  return (
    <div className="week-map" role="group" aria-label="Last seven days">
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

/** Plain, non-medical guidance based on two self-reported answers. */
function recoverySuggestion(soreness: number, energy: number): string {
  if (soreness >= 4 || energy <= 2) {
    return 'Today looks like a good day to keep it gentle — a short walk, some easy mobility or a rest day all count.';
  }
  if (soreness >= 3 || energy === 3) {
    return 'A short mobility session could feel good today. Keep it easy and stop if anything feels off.';
  }
  return 'Your usual session is reasonable today, and you can always dial it back if you need to.';
}

function bodyMeta(entry: BodyEntry, weightUnit: string, waistUnit: string): string {
  const parts: string[] = [];
  if (entry.weight !== null) parts.push(`Weight ${entry.weight} ${weightUnit}`);
  if (entry.waist !== null) parts.push(`Waist ${entry.waist} ${waistUnit}`);
  if (entry.note) parts.push(entry.note);
  return parts.join(' · ');
}

export function WellbeingSleep() {
  const { state, update, today } = useDemo();
  const { toast } = useToast();
  const week = lastNDays(7);
  const recorded = week
    .map((day) => state.sleep.find((entry) => entry.date === day))
    .filter((entry): entry is SleepEntry => entry !== undefined);
  const lastNight = state.sleep.find((entry) => entry.date === today);
  const average = recorded.length ? round(recorded.reduce((total, entry) => total + entry.hours, 0) / recorded.length) : 0;
  const bars = week.map((day) => ({
    label: weekdayLetter(day),
    value: state.sleep.find((entry) => entry.date === day)?.hours ?? 0,
  }));
  const qualityValues = recorded.map((entry) => entry.quality);

  const [hours, setHours] = useState(() => (lastNight ? String(lastNight.hours) : ''));
  const [quality, setQuality] = useState(() => lastNight?.quality ?? 4);

  function saveSleep() {
    const parsed = Number(hours);
    if (!hours.trim() || Number.isNaN(parsed) || parsed < 0 || parsed > 24) {
      toast('Enter hours between 0 and 24.', 'warn');
      return;
    }
    const entry: SleepEntry = { date: today, hours: round(parsed), quality };
    update((prev) => {
      const others = prev.sleep.filter((item) => item.date !== today);
      return { sleep: [entry, ...others], points: awardPoints(prev, 'rule-rest', 'Noticed your rest', 2) };
    });
    toast('Last night’s rest is saved.');
  }

  return (
    <div className="page">
      <PageHeader
        kicker="Wellbeing / Sleep"
        title="Sleep"
        blurb="Last night, and the pattern behind it. There is no target to hit."
        actions={<Link className="button button--ghost button--small" to="/app/wellbeing/recovery">Recovery check</Link>}
      />
      <Panel title="Last night" subtitle="A rough number is completely fine.">
        <Field label="Hours slept" hint="Half-hours are welcome — 7.5 is a valid answer.">
          <input
            type="number"
            min={0}
            max={24}
            step={0.5}
            value={hours}
            onChange={(event) => setHours(event.target.value)}
            placeholder="e.g. 7.5"
          />
        </Field>
        <Field label="How did it feel" hint="Your own sense of it, not a score.">
          <ScaleButtons value={quality} onChange={setQuality} labels={QUALITY_LABELS} name="Sleep quality" />
        </Field>
        <Row>
          <button type="button" className="button button--small" onClick={saveSleep}>Save last night</button>
        </Row>
      </Panel>
      <Panel title="Last 7 days" subtitle="Hours recorded each night.">
        <StatGrid>
          <Stat
            label="Last night"
            value={lastNight ? lastNight.hours : '—'}
            unit={lastNight ? 'hours' : undefined}
            hint={lastNight ? `Quality ${lastNight.quality}/5` : 'Not recorded yet'}
          />
          <Stat
            label="7-day average"
            value={recorded.length ? average : '—'}
            unit={recorded.length ? 'hours' : undefined}
            hint={recorded.length ? `Across ${recorded.length} ${recorded.length === 1 ? 'night' : 'nights'}` : 'Record a night to see this'}
          />
          <Stat label="Nights logged" value={recorded.length} unit="/ 7" />
        </StatGrid>
        <BarChart data={bars} unit="h" />
        {qualityValues.length > 0 ? (
          <div className="stack stack--tight">
            <span className="field__label">Quality, night to night</span>
            <Sparkline values={qualityValues} label="Sleep quality over the last seven days" />
          </div>
        ) : (
          <Muted>Quality shows here once you have logged a night or two.</Muted>
        )}
      </Panel>
      <Note tone="quiet">
        Sleep stages, readiness and any device-derived numbers are trends, not measurements. Devices differ by sensor and
        algorithm, so treat them as a rough guide rather than a fact.
      </Note>
    </div>
  );
}


export function WellbeingRecovery() {
  const { state, update, today } = useDemo();
  const { toast } = useToast();
  const [soreness, setSoreness] = useState(2);
  const [energy, setEnergy] = useState(3);
  const todays = onDate(state.activities, today);

  function logRecovery() {
    const entry: ActivityEntry = {
      id: uid('activity'),
      date: today,
      name: 'Recovery mobility',
      kind: 'mobility',
      minutes: 10,
      detail: 'Gentle mobility from the recovery check',
    };
    update((prev) => ({ activities: [entry, ...prev.activities] }));
    toast('A 10-minute recovery session is saved.');
  }

  return (
    <div className="page">
      <PageHeader
        kicker="Wellbeing / Recovery"
        title="Recovery"
        blurb="A quick read on how your body feels today. Rest days are progress, not absence."
        actions={<Link className="button button--ghost button--small" to="/app/move/history">Activity history</Link>}
      />
      <Panel title="How are you feeling?" subtitle="Nothing here is a diagnosis, and there are no wrong answers.">
        <Field label="Soreness" hint="1 is none, 5 is a lot.">
          <ScaleButtons value={soreness} onChange={setSoreness} labels={SORENESS_LABELS} name="Soreness" />
        </Field>
        <Field label="Energy" hint="1 is empty, 5 is full.">
          <ScaleButtons value={energy} onChange={setEnergy} labels={ENERGY_LABELS} name="Energy" />
        </Field>
        <Note tone="info">{recoverySuggestion(soreness, energy)}</Note>
        <Row>
          <button type="button" className="button button--small" onClick={logRecovery}>Log a 10-minute recovery session</button>
        </Row>
      </Panel>
      <Panel title="Moved today" subtitle="Everything you have logged for today.">
        {todays.length > 0 ? (
          <div className="list">
            {todays.map((activity) => (
              <div key={activity.id} className="list__item">
                <div className="list__main">
                  <span className="list__title">{activity.name}</span>
                  <span className="list__meta">{activity.kind} · {activity.minutes} min · {activity.detail}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Nothing logged yet today" body="Any movement counts — a short walk, a stretch or a recovery session." />
        )}
      </Panel>
      <Note tone="warn">{SAFETY_NOTES.escalation}</Note>
    </div>
  );
}


export function WellbeingBody() {
  const { state, update, today } = useDemo();
  const { toast } = useToast();
  const metric = state.preferences.units === 'metric';
  const weightUnit = metric ? 'kg' : 'lb';
  const waistUnit = metric ? 'cm' : 'in';
  const recent = [...state.body].sort((a, b) => (a.date < b.date ? 1 : -1));
  const chronological = [...state.body].sort((a, b) => (a.date < b.date ? -1 : 1));
  const weightSeries = chronological.map((entry) => entry.weight).filter((value): value is number => value !== null);
  const waistSeries = chronological.map((entry) => entry.waist).filter((value): value is number => value !== null);

  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [note, setNote] = useState('');

  function saveBody() {
    const weightValue = weight.trim() ? Number(weight) : null;
    const waistValue = waist.trim() ? Number(waist) : null;
    if (weightValue === null && waistValue === null && !note.trim()) {
      toast('Add a weight, a waist measurement or a note before saving.', 'warn');
      return;
    }
    if (weightValue !== null && (Number.isNaN(weightValue) || weightValue <= 0)) {
      toast('Enter a weight above zero, or leave it blank.', 'warn');
      return;
    }
    if (waistValue !== null && (Number.isNaN(waistValue) || waistValue <= 0)) {
      toast('Enter a waist measurement above zero, or leave it blank.', 'warn');
      return;
    }
    const entry: BodyEntry = { date: today, weight: weightValue, waist: waistValue, note: note.trim() };
    update((prev) => {
      const others = prev.body.filter((item) => item.date !== today);
      return { body: [entry, ...others] };
    });
    setNote('');
    toast('Saved for today. Measurements are optional, and you can remove them any time.');
  }

  function removeEntry(date: string) {
    update((prev) => ({ body: prev.body.filter((entry) => entry.date !== date) }));
    toast('Measurement removed.');
  }

  return (
    <div className="page">
      <PageHeader
        kicker="Wellbeing / Body metrics"
        title="Body metrics"
        blurb="Measurements you choose to keep — or ignore entirely. Nurture works the same either way."
      />
      <Panel title="Add today’s measurements" subtitle="Every field is optional. Save only what you want to keep.">
        <div className="grid-2">
          <Field label={`Weight (${weightUnit}, optional)`} hint="Leave blank if you would rather not record it.">
            <input type="number" min={0} step={0.1} value={weight} onChange={(event) => setWeight(event.target.value)} placeholder="—" />
          </Field>
          <Field label={`Waist (${waistUnit}, optional)`} hint="Leave blank if you would rather not record it.">
            <input type="number" min={0} step={0.1} value={waist} onChange={(event) => setWaist(event.target.value)} placeholder="—" />
          </Field>
        </div>
        <Field label="A note (optional)" hint="Anything you want to remember about today.">
          <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="e.g. measured in the morning after a late night" />
        </Field>
        <Row>
          <button type="button" className="button button--small" onClick={saveBody}>Save today’s entry</button>
        </Row>
      </Panel>
      <Panel title="Recent entries" subtitle="Newest first. Delete anything you no longer want to keep.">
        {recent.length > 0 ? (
          <div className="list">
            {recent.map((entry) => (
              <div key={entry.date} className="list__item">
                <div className="list__main">
                  <span className="list__title">{formatKey(entry.date)}</span>
                  <span className="list__meta">{bodyMeta(entry, weightUnit, waistUnit)}</span>
                </div>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => removeEntry(entry.date)}
                  aria-label={`Delete entry for ${formatKey(entry.date)}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No measurements yet"
            body="That is completely fine. Add one whenever it feels useful, or never — the rest of Nurture works without it."
          />
        )}
      </Panel>
      <Panel title="Pattern so far" subtitle="Shown only when a measurement has at least two entries.">
        {weightSeries.length >= 2 ? (
          <div className="stack stack--tight">
            <span className="field__label">Weight ({weightUnit})</span>
            <Sparkline values={weightSeries} label="Weight entries over time" />
          </div>
        ) : null}
        {waistSeries.length >= 2 ? (
          <div className="stack stack--tight">
            <span className="field__label">Waist ({waistUnit})</span>
            <Sparkline values={waistSeries} label="Waist entries over time" />
          </div>
        ) : null}
        {weightSeries.length < 2 && waistSeries.length < 2 ? (
          <Muted>Add the same measurement on two or more days to see a trend line here.</Muted>
        ) : null}
      </Panel>
      <Note tone="quiet">
        Weight moves around day to day with water, food and the time of day — that is normal, and it is not a score. These
        numbers are never a target. Recording them is entirely optional, and the app works fine without them.
      </Note>
    </div>
  );
}


export function WellbeingHabits() {
  const { state, update, today } = useDemo();
  const { toast } = useToast();
  const week = lastNDays(7);
  const existing = state.checkIns.find((entry) => entry.date === today);
  const currentMood = state.mood[today] ?? 0;
  const [noteText, setNoteText] = useState(() => existing?.note ?? '');

  const weekTotal = HABIT_DEFS.reduce(
    (total, habit) => total + (state.habits[habit.id] ?? []).filter((day) => week.includes(day)).length,
    0,
  );
  const doneToday = HABIT_DEFS.filter((habit) => (state.habits[habit.id] ?? []).includes(today)).length;

  function toggleHabit(habitId: string) {
    update((prev) => {
      const dates = prev.habits[habitId] ?? [];
      const next = dates.includes(today) ? dates.filter((day) => day !== today) : [...dates, today];
      return { habits: { ...prev.habits, [habitId]: next } };
    });
  }

  function setMood(value: number) {
    update((prev) => ({
      mood: { ...prev.mood, [today]: value },
      points: awardPoints(prev, 'rule-checkin', 'Checked in with yourself', 2),
    }));
    toast(`Noted for today: ${MOOD_LABELS[value - 1]}.`);
  }

  function saveNote() {
    const text = noteText.trim();
    if (!text) {
      toast('Write a few words before saving.', 'warn');
      return;
    }
    update((prev) => {
      const previous = prev.checkIns.find((entry) => entry.date === today);
      const entry: CheckIn = {
        date: today,
        mood: prev.mood[today] ?? previous?.mood ?? 0,
        energy: previous?.energy ?? 0,
        note: text,
      };
      const others = prev.checkIns.filter((item) => item.date !== today);
      return { checkIns: [entry, ...others], points: awardPoints(prev, 'rule-checkin', 'Checked in with yourself', 2) };
    });
    toast('Your note for today is saved.');
  }

  return (
    <div className="page">
      <PageHeader
        kicker="Wellbeing / Habits & mood"
        title="Habits & mood"
        blurb="Small repeatable actions, and a quick note on how the day felt."
        actions={currentMood ? <Chip tone="info">Today: {MOOD_LABELS[currentMood - 1]}</Chip> : undefined}
      />
      <Panel title="Today’s habits" subtitle="Tick what you did today. Nothing is required.">
        <StatGrid>
          <Stat label="Done today" value={doneToday} unit={`/ ${HABIT_DEFS.length}`} />
          <Stat label="Completed this week" value={weekTotal} unit={`of ${HABIT_DEFS.length * 7}`} hint="Across all habits" />
        </StatGrid>
        <div className="list">
          {HABIT_DEFS.map((habit) => {
            const dates = state.habits[habit.id] ?? [];
            const count = week.filter((day) => dates.includes(day)).length;
            return (
              <div key={habit.id} className="list__item">
                <div className="list__main">
                  <label className="check">
                    <input type="checkbox" checked={dates.includes(today)} onChange={() => toggleHabit(habit.id)} />
                    <span>
                      <span className="list__title">{habit.label}</span>
                      <span className="list__meta"> {habit.hint}</span>
                    </span>
                  </label>
                  <DayDots days={week} isMarked={(day) => dates.includes(day)} today={today} />
                </div>
                <span className="list__meta">{count}/7</span>
              </div>
            );
          })}
        </div>
      </Panel>
      <Panel title="How today felt" subtitle="A short label is enough — there is no right answer.">
        <Field label="Mood" hint="Tap the one that fits best.">
          <ScaleButtons value={currentMood} onChange={setMood} labels={MOOD_LABELS} name="Mood" />
        </Field>
        <Field label="A note for today" hint="Saved to your check-ins. Saving again replaces today’s note.">
          <textarea
            value={noteText}
            onChange={(event) => setNoteText(event.target.value)}
            placeholder="One or two sentences about today is plenty."
          />
        </Field>
        <Row>
          <button type="button" className="button button--small" onClick={saveNote}>Save note</button>
        </Row>
        {existing ? <Muted>Saved for today: {existing.note}</Muted> : null}
      </Panel>
      <Note tone="quiet">Checking in earns a couple of Kind points, once a day. Points are illustrative and carry no cash value.</Note>
    </div>
  );
}

