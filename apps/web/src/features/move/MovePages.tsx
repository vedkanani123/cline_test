import { useMemo, useState } from 'react';
import {
  Chip,
  EmptyState,
  Field,
  Meter,
  Muted,
  Note,
  PageHeader,
  Panel,
  Row,
  Stat,
  StatGrid,
} from '../../components/ui';
import { useToast } from '../../app/toast';
import { ACTIVITY_KINDS, activityTotals, awardPoints, formatKey, onDate, uid, useDemo } from '../../app/demo';
import type { ActivityEntry, ActivityKind } from '../../app/demo';
import { CARDIO_IDEAS, EXERCISE_LIBRARY, ROUTINES, YOGA_FLOWS } from '../../content';
import type { Routine } from '../../content';

export function MoveWorkouts() {
  const { state, update, today } = useDemo();
  const { toast } = useToast();
  const [routines, setRoutines] = useState<Routine[]>(() =>
    ROUTINES.map((routine) => ({ ...routine, exercises: routine.exercises.map((exercise) => ({ ...exercise })) })),
  );
  const [session, setSession] = useState<{ routineId: string; done: number[] } | null>(null);
  const [newName, setNewName] = useState('');
  const [newMinutes, setNewMinutes] = useState(15);
  const [picked, setPicked] = useState<string[]>([]);

  const active = session ? routines.find((routine) => routine.id === session.routineId) ?? null : null;
  const doneList = session ? session.done : [];
  const plannedTotal = active ? active.exercises.reduce((total, exercise) => total + exercise.sets, 0) : 0;
  const doneTotal = doneList.reduce((total, value) => total + value, 0);
  const percent = plannedTotal > 0 ? Math.round((doneTotal / plannedTotal) * 100) : 0;
  const todayTotals = activityTotals(onDate(state.activities, today));

  const start = (routine: Routine) => {
    setSession({ routineId: routine.id, done: routine.exercises.map(() => 0) });
    toast(`${routine.name} started. Complete sets as you go.`);
  };

  const completeSet = (index: number) => {
    setSession((prev) => {
      if (!prev) return prev;
      const routine = routines.find((entry) => entry.id === prev.routineId);
      if (!routine) return prev;
      return { ...prev, done: prev.done.map((value, i) => (i === index ? Math.min(value + 1, routine.exercises[i].sets) : value)) };
    });
  };

  const undoSet = (index: number) => {
    setSession((prev) => (prev ? { ...prev, done: prev.done.map((value, i) => (i === index ? Math.max(0, value - 1) : value)) } : prev));
  };

  const finish = () => {
    if (!active || !session) return;
    const entry: ActivityEntry = {
      id: uid('activity'), date: today, name: active.name, kind: 'strength',
      minutes: active.minutes, detail: `${doneTotal} of ${plannedTotal} planned sets`,
    };
    update((prev) => ({ activities: [entry, ...prev.activities], points: awardPoints(prev, 'rule-move', 'Moved your way', 2) }));
    setSession(null);
    toast(`${active.name} logged — ${doneTotal} of ${plannedTotal} sets.`);
  };

  const discard = () => {
    setSession(null);
    toast('Session discarded. Nothing was logged.', 'info');
  };

  const removeRoutine = (id: string) => {
    setRoutines((prev) => prev.filter((routine) => routine.id !== id));
    toast('Routine removed from this page.', 'info');
  };

  const createRoutine = () => {
    const name = newName.trim();
    if (!name || picked.length === 0) return;
    const routine: Routine = {
      id: uid('routine'), name, focus: 'Your own session',
      minutes: Math.max(1, newMinutes),
      exercises: picked.map((exerciseName) => ({ name: exerciseName, sets: 3, reps: 'choose comfortable reps' })),
    };
    setRoutines((prev) => [...prev, routine]);
    setNewName('');
    setPicked([]);
    setNewMinutes(15);
    toast(`${name} created on this page (demo only).`);
  };

  return (
    <div className="page">
      <PageHeader kicker="Move / Workouts" title="Workouts" blurb="Strength sessions you can start, pause and actually finish." />
      <Panel title="Today so far">
        <StatGrid>
          <Stat label="Sessions" value={todayTotals.sessions} hint="Logged today" />
          <Stat label="Minutes" value={todayTotals.minutes} unit="min" hint="Any movement counts" />
        </StatGrid>
      </Panel>

      {session && active ? (
        <Panel title={`In progress · ${active.name}`} subtitle={`${doneTotal} of ${plannedTotal} sets · ${percent}%`}>
          <Meter value={doneTotal} max={plannedTotal} label={`Session progress ${percent}%`} />
          <ul className="list">
            {active.exercises.map((exercise, index) => {
              const done = doneList[index];
              return (
                <li key={exercise.name} className="list__item">
                  <span className="list__main">
                    <span className="list__title">{exercise.name}</span>
                    <span className="list__meta">{done} of {exercise.sets} sets · {exercise.reps}</span>
                  </span>
                  <Row>
                    <button type="button" className="button button--small" onClick={() => completeSet(index)} disabled={done >= exercise.sets}>Complete a set</button>
                    <button type="button" className="button button--ghost button--small" onClick={() => undoSet(index)} disabled={done === 0}>Undo a set</button>
                  </Row>
                </li>
              );
            })}
          </ul>
          <Row>
            <button type="button" className="button" onClick={finish} disabled={doneTotal === 0}>Finish workout</button>
            <button type="button" className="button button--ghost" onClick={discard}>Discard</button>
          </Row>
        </Panel>
      ) : null}

      <Panel title="Your routines" subtitle="Start a session, or remove a routine when nothing is in progress.">
        <ul className="list">
          {routines.map((routine) => (
            <li key={routine.id} className="list__item">
              <span className="list__main">
                <span className="list__title">{routine.name}</span>
                <span className="list__meta">{routine.minutes} min · {routine.exercises.length} exercises · {routine.focus}</span>
              </span>
              <Row>
                <button type="button" className="button button--small" onClick={() => start(routine)} disabled={session !== null}>Start</button>
                <button type="button" className="button button--ghost button--small" onClick={() => removeRoutine(routine.id)} disabled={session !== null}>Remove</button>
              </Row>
            </li>
          ))}
        </ul>
        <Note tone="quiet">Routines you create or remove here live only on this page and reset on reload — the demo store has no routines field.</Note>
      </Panel>

      <Panel title="Create a routine" subtitle="Demo only. Tap exercises to include them.">
        <div className="grid-2">
          <Field label="Name">
            <input type="text" value={newName} placeholder="e.g. Morning five" onChange={(event) => setNewName(event.target.value)} />
          </Field>
          <Field label="Minutes">
            <input type="number" min={1} max={120} value={newMinutes} onChange={(event) => setNewMinutes(Math.max(1, Number(event.target.value) || 1))} />
          </Field>
        </div>
        <Row>
          {EXERCISE_LIBRARY.map((exercise) => {
            const on = picked.includes(exercise.name);
            return (
              <button
                key={exercise.id}
                type="button"
                className={`chip${on ? ' chip--good' : ''}`}
                aria-pressed={on}
                onClick={() => setPicked((prev) => (on ? prev.filter((name) => name !== exercise.name) : [...prev, exercise.name]))}
              >
                {exercise.name}
              </button>
            );
          })}
        </Row>
        <Row>
          <button type="button" className="button" onClick={createRoutine} disabled={!newName.trim() || picked.length === 0}>Create routine</button>
        </Row>
      </Panel>
    </div>
  );
}


export function MoveExercises() {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('all');
  const [equipment, setEquipment] = useState('all');

  const groups = Array.from(new Set(EXERCISE_LIBRARY.map((exercise) => exercise.group)));
  const equipmentOptions = Array.from(new Set(EXERCISE_LIBRARY.map((exercise) => exercise.equipment)));
  const needle = query.trim().toLowerCase();
  const filtered = EXERCISE_LIBRARY.filter(
    (exercise) =>
      (group === 'all' || exercise.group === group) &&
      (equipment === 'all' || exercise.equipment === equipment) &&
      (needle === '' || exercise.name.toLowerCase().includes(needle) || exercise.cues.some((cue) => cue.toLowerCase().includes(needle))),
  );

  return (
    <div className="page">
      <PageHeader kicker="Move / Library" title="Exercise library" blurb="Browse movements with form cues and easier or harder options. General guidance, not personal instruction." />
      <Panel title="Filter">
        <Field label="Search" hint="Search a name or a cue.">
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
        </Field>
        <div className="stack stack--tight">
          <span className="kicker">Group</span>
          <div className="segmented">
            <button type="button" className={group === 'all' ? 'is-active' : ''} onClick={() => setGroup('all')}>all</button>
            {groups.map((option) => (
              <button key={option} type="button" className={group === option ? 'is-active' : ''} onClick={() => setGroup(option)}>{option}</button>
            ))}
          </div>
        </div>
        <div className="stack stack--tight">
          <span className="kicker">Equipment</span>
          <div className="segmented">
            <button type="button" className={equipment === 'all' ? 'is-active' : ''} onClick={() => setEquipment('all')}>all</button>
            {equipmentOptions.map((option) => (
              <button key={option} type="button" className={equipment === option ? 'is-active' : ''} onClick={() => setEquipment(option)}>{option}</button>
            ))}
          </div>
        </div>
      </Panel>

      {filtered.length === 0 ? (
        <EmptyState title="No exercises match" body="Try another group, equipment or search term." />
      ) : (
        <div className="grid-2">
          {filtered.map((exercise) => (
            <article key={exercise.id} className="recipe">
              <h3 className="recipe__title">{exercise.name}</h3>
              <div className="recipe__meta">
                <Chip tone="quiet">{exercise.group}</Chip>
                <Chip tone="quiet">{exercise.equipment === 'none' ? 'no equipment' : exercise.equipment}</Chip>
              </div>
              <ul className="recipe__steps">{exercise.cues.map((cue) => <li key={cue}>{cue}</li>)}</ul>
              <Muted>Easier: {exercise.easier}</Muted>
              <Muted>Harder: {exercise.harder}</Muted>
              <button type="button" className="button button--ghost button--small" onClick={() => toast(`${exercise.name} saved to your plan (demo only).`, 'info')}>Save to my plan</button>
            </article>
          ))}
        </div>
      )}
      <Note tone="quiet">Cues are general guidance, not a treatment plan. Stop if something hurts.</Note>
    </div>
  );
}

export function MoveYoga() {
  const { update, today } = useDemo();
  const { toast } = useToast();
  const [active, setActive] = useState<{ flowId: string; index: number } | null>(null);
  const flow = active ? YOGA_FLOWS.find((entry) => entry.id === active.flowId) ?? null : null;

  const start = (id: string) => {
    setActive({ flowId: id, index: 0 });
    toast('Flow started. Move at your own pace.');
  };

  const next = () => {
    if (!active || !flow) return;
    if (active.index < flow.poses.length - 1) {
      setActive({ flowId: active.flowId, index: active.index + 1 });
      return;
    }
    const entry: ActivityEntry = {
      id: uid('activity'), date: today, name: flow.name, kind: 'yoga',
      minutes: flow.minutes, detail: `${flow.poses.length} poses`,
    };
    update((prev) => ({ activities: [entry, ...prev.activities], points: awardPoints(prev, 'rule-move', 'Moved your way', 2) }));
    setActive(null);
    toast(`${flow.name} logged — ${flow.minutes} minutes.`);
  };

  const stop = () => {
    setActive(null);
    toast('Flow stopped. Nothing was logged.', 'info');
  };

  return (
    <div className="page">
      <PageHeader kicker="Move / Yoga & mobility" title="Yoga & mobility" blurb="Short flows and mobility work for stiff, busy days." />
      {active && flow ? (
        <Panel title={flow.name} subtitle={`${flow.focus} · pose ${active.index + 1} of ${flow.poses.length}`}>
          <Meter value={active.index + 1} max={flow.poses.length} label={`Pose ${active.index + 1} of ${flow.poses.length}`} />
          <p className="stat__value">{flow.poses[active.index]}</p>
          <Row>
            <button type="button" className="button" onClick={next}>
              {active.index < flow.poses.length - 1 ? 'Next pose' : 'Finish flow'}
            </button>
            <button type="button" className="button button--ghost" onClick={stop}>Stop</button>
          </Row>
        </Panel>
      ) : (
        <div className="grid-2">
          {YOGA_FLOWS.map((entry) => (
            <Panel key={entry.id} title={entry.name} subtitle={`${entry.minutes} min · ${entry.focus}`}>
              <ul className="recipe__steps">{entry.poses.map((pose) => <li key={pose}>{pose}</li>)}</ul>
              <Row>
                <button type="button" className="button button--small" onClick={() => start(entry.id)}>Start flow</button>
              </Row>
            </Panel>
          ))}
        </div>
      )}
      <Note tone="quiet">Flows are general mobility sequences, not medical or therapeutic advice.</Note>
    </div>
  );
}

export function MoveCardio() {
  const { update, today } = useDemo();
  const { toast } = useToast();
  const [kind, setKind] = useState<'walk' | 'cardio'>('walk');
  const [minutes, setMinutes] = useState(20);
  const [note, setNote] = useState('');

  const log = (entryKind: 'walk' | 'cardio', entryMinutes: number, entryNote: string, label: string) => {
    const entry: ActivityEntry = {
      id: uid('activity'), date: today, name: label, kind: entryKind,
      minutes: Math.max(1, Math.round(entryMinutes)), detail: entryNote.trim() || 'Logged from the cardio page',
    };
    update((prev) => ({ activities: [entry, ...prev.activities], points: awardPoints(prev, 'rule-move', 'Moved your way', 2) }));
    toast(`${label} logged — ${entry.minutes} minutes.`);
  };

  const ideaKind = (value: 'walk' | 'run' | 'ride' | 'swim'): 'walk' | 'cardio' => (value === 'walk' ? 'walk' : 'cardio');

  return (
    <div className="page">
      <PageHeader kicker="Move / Cardio & walks" title="Cardio & walks" blurb="Walks, runs and rides — recorded your way." />
      <Panel title="Quick log">
        <div className="stack stack--tight">
          <span className="kicker">Type</span>
          <div className="segmented">
            <button type="button" className={kind === 'walk' ? 'is-active' : ''} onClick={() => setKind('walk')}>walk</button>
            <button type="button" className={kind === 'cardio' ? 'is-active' : ''} onClick={() => setKind('cardio')}>cardio</button>
          </div>
        </div>
        <Field label="Minutes">
          <input type="number" min={1} max={600} value={minutes} onChange={(event) => setMinutes(Math.max(1, Number(event.target.value) || 1))} />
        </Field>
        <Field label="Note" hint="Optional. How did it feel?">
          <input type="text" value={note} onChange={(event) => setNote(event.target.value)} />
        </Field>
        <Row>
          <button type="button" className="button" onClick={() => log(kind, minutes, note, kind === 'walk' ? 'Walk' : 'Cardio')}>Log activity</button>
          <button type="button" className="button button--ghost" onClick={() => log('walk', 20, 'One-tap walk', 'Walk')}>Log a walk (20 min)</button>
        </Row>
      </Panel>
      <Panel title="Ideas" subtitle="Tap to log an idea at its suggested length.">
        <ul className="list">
          {CARDIO_IDEAS.map((idea) => (
            <li key={idea.id} className="list__item">
              <span className="list__main">
                <span className="list__title">{idea.name}</span>
                <span className="list__meta">{idea.minutes} min · {idea.kind} · {idea.note}</span>
              </span>
              <button type="button" className="button button--small" onClick={() => log(ideaKind(idea.kind), idea.minutes, idea.note, idea.name)}>Log</button>
            </li>
          ))}
        </ul>
      </Panel>
      <Note tone="quiet">Duration is whatever you choose. A short walk counts the same as a long run here.</Note>
    </div>
  );
}

export function MoveHistory() {
  const { state, update } = useDemo();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | ActivityKind>('all');

  const filtered = useMemo(() => {
    const list = filter === 'all' ? state.activities : state.activities.filter((activity) => activity.kind === filter);
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  }, [state.activities, filter]);

  const totals = activityTotals(filtered);

  const remove = (id: string) => {
    update((prev) => ({ activities: prev.activities.filter((activity) => activity.id !== id) }));
    toast('Activity removed.', 'info');
  };

  return (
    <div className="page">
      <PageHeader kicker="Move / History" title="Activity history" blurb="Everything you have moved, and the option to remove it." />
      <Panel title="Filter by kind">
        <div className="segmented">
          <button type="button" className={filter === 'all' ? 'is-active' : ''} onClick={() => setFilter('all')}>all</button>
          {ACTIVITY_KINDS.map((option) => (
            <button key={option} type="button" className={filter === option ? 'is-active' : ''} onClick={() => setFilter(option)}>{option}</button>
          ))}
        </div>
      </Panel>
      <Panel title="Totals" subtitle="For the current filter.">
        <StatGrid>
          <Stat label="Sessions" value={totals.sessions} />
          <Stat label="Minutes" value={totals.minutes} unit="min" />
          <Stat label="Kinds" value={totals.kinds} />
        </StatGrid>
      </Panel>
      <Panel title="Recorded activity">
        {filtered.length === 0 ? (
          <EmptyState title="Nothing recorded yet" body="Log a workout, flow or walk and it will appear here, newest first." />
        ) : (
          <ul className="list">
            {filtered.map((activity) => (
              <li key={activity.id} className="list__item">
                <span className="list__main">
                  <span className="list__title">{activity.name}</span>
                  <span className="list__meta">{formatKey(activity.date)} · {activity.minutes} min · {activity.detail}</span>
                </span>
                <Row>
                  <Chip tone="quiet">{activity.kind}</Chip>
                  <button type="button" className="icon-button" aria-label={`Remove ${activity.name}`} onClick={() => remove(activity.id)}>×</button>
                </Row>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <Note tone="quiet">Minutes are your own estimates. Duration is a record, not a score.</Note>
    </div>
  );
}
