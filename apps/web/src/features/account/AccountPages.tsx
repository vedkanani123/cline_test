import { useEffect, useState } from 'react';
import { EmptyState, Field, Note, PageHeader, Panel, Row, Stat, StatGrid, Toggle } from '../../components/ui';
import { Link } from '../../router';
import { FOCUS_OPTIONS, uid, useDemo } from '../../app/demo';
import type { CoachTone, Preferences, Reminder } from '../../app/demo';
import { useToast } from '../../app/toast';

export function AccountProfile() {
  const { state, setName } = useDemo();
  const { toast } = useToast();
  const [draft, setDraft] = useState(state.name);
  const goal = state.goal;

  const saveName = () => {
    const next = draft.trim();
    if (!next) {
      toast('Add a name first.', 'warn');
      return;
    }
    setName(next);
    toast('Name updated.');
  };

  const focusText = goal ? FOCUS_OPTIONS.find((option) => option.id === goal.focus)?.label ?? goal.focus : 'None yet';

  return (
    <div className="page">
      <PageHeader
        kicker="Account / Profile"
        title="Your profile"
        blurb="The small set of details Nurture uses to shape your day."
        actions={
          <Link className="button button--ghost button--small" to="/app/account/settings">
            Settings
          </Link>
        }
      />

      <Panel title="Display name" subtitle="Shown across your space.">
        <Field label="First name" hint="This demo stores only the first name, in your browser session.">
          <input type="text" value={draft} maxLength={40} onChange={(event) => setDraft(event.target.value)} />
        </Field>
        <Row>
          <button type="button" className="button" onClick={saveName}>
            Save name
          </button>
        </Row>
      </Panel>

      <Panel title="Your goal" subtitle="What you are working toward.">
        {goal ? (
          <>
            <p className="kicker">
              {focusText} · {goal.days}-day window
            </p>
            <h3>{goal.text}</h3>
            <p className="muted">{goal.why || 'No reason written yet.'}</p>
            <Row>
              <Link className="button button--ghost button--small" to="/app/plan/goals">
                Edit goal
              </Link>
              <Link className="button button--ghost button--small" to="/app/plan/journey">
                Open journey
              </Link>
            </Row>
          </>
        ) : (
          <EmptyState
            title="No goal yet"
            body="Choose a focus and a reason that matters to you — it takes about a minute."
            action={
              <Link className="button button--small" to="/app/plan/goals">
                Set my goal
              </Link>
            }
          />
        )}
      </Panel>

      <Panel title="Profile summary" subtitle="Derived from your current demo state.">
        <StatGrid>
          <Stat label="Focus" value={focusText} />
          <Stat label="Timeframe" value={goal ? goal.days : 100} unit="days" hint="A planning window" />
          <Stat label="Units" value={state.preferences.units} />
          <Stat label="Coach tone" value={state.preferences.tone} />
        </StatGrid>
        <Note tone="quiet">
          This demo stores only the first name in the browser session. Nothing else is uploaded, and there is no account.
        </Note>
      </Panel>
    </div>
  );
}

const REMINDER_KINDS: Reminder['kind'][] = ['meal', 'water', 'move', 'sleep', 'checkin'];

const INTENSITY_OPTIONS: { id: Preferences['reminderIntensity']; label: string; blurb: string }[] = [
  { id: 'gentle', label: 'Gentle', blurb: 'A soft nudge now and then. Easy to ignore, easy to keep.' },
  { id: 'structured', label: 'Structured', blurb: 'A steadier rhythm, with reminders at the times you choose.' },
  { id: 'accountability', label: 'Accountability', blurb: 'A supportive check-in if something slips — never a telling-off.' },
];

export function AccountReminders() {
  const { state, update } = useDemo();
  const { toast } = useToast();
  const [label, setLabel] = useState('');
  const [time, setTime] = useState('12:00');
  const [kind, setKind] = useState<Reminder['kind']>('meal');

  const setIntensity = (value: Preferences['reminderIntensity']) => {
    update((prev) => ({ preferences: { ...prev.preferences, reminderIntensity: value } }));
    toast('Reminder intensity updated.', 'info');
  };

  const toggleReminder = (id: string, next: boolean) => {
    update((prev) => ({
      reminders: prev.reminders.map((reminder) => (reminder.id === id ? { ...reminder, enabled: next } : reminder)),
    }));
  };

  const changeTime = (id: string, next: string) => {
    update((prev) => ({
      reminders: prev.reminders.map((reminder) => (reminder.id === id ? { ...reminder, time: next } : reminder)),
    }));
  };

  const removeReminder = (id: string) => {
    update((prev) => ({ reminders: prev.reminders.filter((reminder) => reminder.id !== id) }));
    toast('Reminder removed.', 'info');
  };

  const addReminder = () => {
    if (!label.trim()) {
      toast('Give the reminder a short label.', 'warn');
      return;
    }
    const reminder: Reminder = { id: uid('rem'), label: label.trim(), time, kind, enabled: true };
    update((prev) => ({ reminders: [...prev.reminders, reminder] }));
    setLabel('');
    toast('Reminder added. Notifications are not scheduled in this demo.', 'info');
  };

  return (
    <div className="page">
      <PageHeader
        kicker="Account / Reminders"
        title="Reminders"
        blurb="Nudges you control by topic, time and intensity."
        actions={
          <Link className="button button--ghost button--small" to="/app/account/settings">
            Settings
          </Link>
        }
      />

      <Panel title="Your reminders" subtitle="Turn any reminder on or off, change its time, or remove it.">
        {state.reminders.length === 0 ? (
          <EmptyState title="No reminders yet" body="Add your first reminder below." />
        ) : (
          <ul className="list">
            {state.reminders.map((reminder) => (
              <li className="list__item" key={reminder.id}>
                <span className="list__main">
                  <span className="list__title">{reminder.label}</span>
                  <span className="list__meta">{reminder.kind}</span>
                </span>
                <Row>
                  <Field label="Time">
                    <input
                      type="time"
                      value={reminder.time}
                      onChange={(event) => changeTime(reminder.id, event.target.value)}
                      aria-label={`Time for ${reminder.label}`}
                    />
                  </Field>
                  <Toggle
                    label={reminder.enabled ? 'On' : 'Off'}
                    checked={reminder.enabled}
                    onChange={(next) => toggleReminder(reminder.id, next)}
                  />
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={`Remove ${reminder.label}`}
                    onClick={() => removeReminder(reminder.id)}
                  >
                    ×
                  </button>
                </Row>
              </li>
            ))}
          </ul>
        )}
        <Note tone="quiet">Notifications are not actually scheduled in this demo. Reminders are saved in your browser session only.</Note>
      </Panel>


      <Panel title="Add a reminder">
        <Field label="Label" hint="A short, kind phrase.">
          <input
            type="text"
            value={label}
            maxLength={60}
            placeholder="Water with lunch"
            onChange={(event) => setLabel(event.target.value)}
          />
        </Field>
        <Row>
          <Field label="Time">
            <input type="time" value={time} onChange={(event) => setTime(event.target.value)} aria-label="New reminder time" />
          </Field>
          <Field label="Kind">
            <select value={kind} onChange={(event) => setKind(event.target.value as Reminder['kind'])}>
              {REMINDER_KINDS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        </Row>
        <Row>
          <button type="button" className="button" onClick={addReminder}>
            Add reminder
          </button>
        </Row>
      </Panel>

      <Panel title="Reminder intensity" subtitle="How firmly Nurture nudges you.">
        <div className="segmented" role="group" aria-label="Reminder intensity">
          {INTENSITY_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={option.id === state.preferences.reminderIntensity ? 'is-active' : ''}
              aria-pressed={option.id === state.preferences.reminderIntensity}
              onClick={() => setIntensity(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <ul className="list">
          {INTENSITY_OPTIONS.map((option) => (
            <li className="list__item list__item--plain" key={option.id}>
              <span className="list__main">
                <span className="list__title">{option.label}</span>
                <span className="list__meta">{option.blurb}</span>
              </span>
              {option.id === state.preferences.reminderIntensity ? <span className="chip chip--good">Current</span> : null}
            </li>
          ))}
        </ul>
        <Note tone="quiet">
          Accountability mode never shames, never comments on weight or calories, and can be paused at any time.
        </Note>
      </Panel>
    </div>
  );
}


export function AccountPrivacy() {
  const { state, update, reset } = useDemo();
  const { toast } = useToast();
  const [confirming, setConfirming] = useState(false);
  const prefs = state.preferences;

  const setFlag = (key: 'personalizedInsights' | 'productAnalytics' | 'shareWithCircle', value: boolean) => {
    update((prev) => ({ preferences: { ...prev.preferences, [key]: value } }));
  };

  const clearAll = () => {
    reset();
    setConfirming(false);
    toast('Demo data cleared. You are back to the starting sample.', 'info');
  };

  return (
    <div className="page">
      <PageHeader
        kicker="Account / Privacy & data"
        title="Privacy and your data"
        blurb="What is stored, what is shared, and how to leave."
        actions={
          <Link className="button button--ghost button--small" to="/app/connections/import-export">
            Import &amp; export
          </Link>
        }
      />

      <Panel title="Your choices" subtitle="Each switch does exactly one thing.">
        <Toggle
          label="Personalized insights"
          hint="Use my own entries to tailor tips and summaries inside the app."
          checked={prefs.personalizedInsights}
          onChange={(next) => setFlag('personalizedInsights', next)}
        />
        <Toggle
          label="Product analytics"
          hint="Share anonymous usage counts so the team can improve the app. Never your health entries."
          checked={prefs.productAnalytics}
          onChange={(next) => setFlag('productAnalytics', next)}
        />
        <Toggle
          label="Share with my circle"
          hint="Let the people in your circle see your shared progress. Individual detail stays private."
          checked={prefs.shareWithCircle}
          onChange={(next) => setFlag('shareWithCircle', next)}
        />
      </Panel>

      <Panel title="What this demo stores">
        <ul className="list">
          <li className="list__item list__item--plain"><span className="list__main"><span className="list__title">First name</span><span className="list__meta">Kept in sessionStorage so the app can greet you.</span></span></li>
          <li className="list__item list__item--plain"><span className="list__main"><span className="list__title">Demo entries</span><span className="list__meta">Meals, movement, sleep, habits, check-ins, reminders and connections you add.</span></span></li>
          <li className="list__item list__item--plain"><span className="list__main"><span className="list__title">Preferences</span><span className="list__meta">Tone, units, motion, reminder intensity and the switches above.</span></span></li>
        </ul>
        <Note tone="quiet">
          Nothing is uploaded. There is no account, no server and no analytics in this demo — it all lives in this
          browser session.
        </Note>
      </Panel>

      <Panel title="Clear demo data" className="panel--clay">
        {confirming ? (
          <>
            <Note tone="warn">This clears every demo entry and preference in this browser session. This cannot be undone.</Note>
            <Row>
              <button type="button" className="button" onClick={clearAll}>
                Yes, clear everything
              </button>
              <button type="button" className="button button--ghost" onClick={() => setConfirming(false)}>
                Cancel
              </button>
            </Row>
          </>
        ) : (
          <Row>
            <button type="button" className="button" onClick={() => setConfirming(true)}>
              Clear demo data
            </button>
            <Link className="button button--ghost" to="/app/connections/import-export">
              Export first
            </Link>
          </Row>
        )}
      </Panel>
    </div>
  );
}


const TONE_OPTIONS: { id: CoachTone; label: string; example: string }[] = [
  { id: 'warm', label: 'Warm', example: 'You got through a hard week — that counts. Want to start with something small today?' },
  { id: 'direct', label: 'Direct', example: 'Pick one thing and do it: a ten-minute walk before lunch.' },
  { id: 'practical', label: 'Practical', example: 'Here is a ten-minute plan you can fit in before your next meeting.' },
];

const UNIT_OPTIONS: { id: Preferences['units']; label: string; example: string }[] = [
  { id: 'metric', label: 'Metric', example: 'Kilograms and centimetres.' },
  { id: 'imperial', label: 'Imperial', example: 'Pounds and inches.' },
];

export function AccountSettings() {
  const { state, update } = useDemo();
  const prefs = state.preferences;

  useEffect(() => {
    document.body.dataset.reducedMotion = prefs.reducedMotion ? 'true' : 'false';
  }, [prefs.reducedMotion]);

  const setTone = (value: CoachTone) => update((prev) => ({ preferences: { ...prev.preferences, tone: value } }));
  const setUnits = (value: Preferences['units']) => update((prev) => ({ preferences: { ...prev.preferences, units: value } }));

  return (
    <div className="page">
      <PageHeader
        kicker="Account / Settings"
        title="Settings"
        blurb="Tone, units, motion and accessibility preferences."
        actions={
          <Link className="button button--ghost button--small" to="/app/account/privacy">
            Privacy &amp; data
          </Link>
        }
      />

      <Panel title="Coach tone" subtitle="How the coach speaks to you.">
        <div className="segmented" role="group" aria-label="Coach tone">
          {TONE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={option.id === prefs.tone ? 'is-active' : ''}
              aria-pressed={option.id === prefs.tone}
              onClick={() => setTone(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <ul className="list">
          {TONE_OPTIONS.map((option) => (
            <li className="list__item list__item--plain" key={option.id}>
              <span className="list__main">
                <span className="list__title">{option.label}</span>
                <span className="list__meta">“{option.example}”</span>
              </span>
              {option.id === prefs.tone ? <span className="chip chip--good">Current</span> : null}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Units" subtitle="Used wherever a measurement is shown.">
        <div className="segmented" role="group" aria-label="Units">
          {UNIT_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={option.id === prefs.units ? 'is-active' : ''}
              aria-pressed={option.id === prefs.units}
              onClick={() => setUnits(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="muted">{UNIT_OPTIONS.find((option) => option.id === prefs.units)?.example}</p>
      </Panel>

      <Panel title="Motion">
        <Toggle
          label="Reduce motion"
          hint="Calms animations across the app. Also sets a reduced-motion flag on the page."
          checked={prefs.reducedMotion}
          onChange={(next) => update((prev) => ({ preferences: { ...prev.preferences, reducedMotion: next } }))}
        />
      </Panel>

      <Panel title="Accessibility">
        <ul className="list">
          <li className="list__item list__item--plain"><span className="list__main"><span className="list__title">Keyboard navigation</span><span className="list__meta">Every control is reachable and usable without a mouse.</span></span></li>
          <li className="list__item list__item--plain"><span className="list__main"><span className="list__title">Visible focus</span><span className="list__meta">Focus is always shown clearly so you can see where you are.</span></span></li>
          <li className="list__item list__item--plain"><span className="list__main"><span className="list__title">Screen-reader labels</span><span className="list__meta">Controls and charts carry descriptive labels.</span></span></li>
          <li className="list__item list__item--plain"><span className="list__main"><span className="list__title">Language and food culture</span><span className="list__meta">Language coverage and food-culture coverage are launch requirements, not extras.</span></span></li>
        </ul>
        <Note tone="quiet">These accessibility commitments are launch requirements for the real product.</Note>
      </Panel>
    </div>
  );
}

