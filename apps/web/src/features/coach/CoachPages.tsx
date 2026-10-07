import { useState } from 'react';
import { Chip, EmptyState, Field, Muted, Note, PageHeader, Panel, Row } from '../../components/ui';
import { Link } from '../../router';
import { awardPoints, round, uid, useDemo } from '../../app/demo';
import type { CoachMessage, CoachTone, MealEntry, PlanChange, Reminder } from '../../app/demo';
import { FOOD_CATALOG, SAFETY_NOTES } from '../../content';
import { useToast } from '../../app/toast';

/**
 * Coach screens: a scripted chat, a simulated voice capture and plan reviews.
 *
 * There is no model here. Chat replies come from a fixed table chosen by keyword
 * and tone; voice is a text stand-in; every proposed change waits for the user to
 * confirm before any state is written. Anything that looks medical is escalated.
 */

const TONE_LABELS: Record<CoachTone, string> = { warm: 'Warm', direct: 'Direct', practical: 'Practical' };

type TopicKey = 'meal' | 'water' | 'sleep' | 'workout' | 'motivation' | 'weight' | 'default' | 'safety';
type ReplyKey = Exclude<TopicKey, 'safety'>;

/** Words that mean the demo coach must decline and escalate instead of guessing. */
const SAFETY_WORDS = ['pain', 'hurt', 'injur', 'chest', 'dizz', 'pregnan', 'medicat', 'eating disorder', 'eating-disorder', 'disorder', 'faint', 'pass out', 'numb', 'bleed', 'blood', 'surgery', 'diagnos', 'depress', 'suicid', 'starve', 'purge', 'binge', 'prescribed'];

const TOPICS: { key: ReplyKey; words: string[] }[] = [
  { key: 'meal', words: ['meal', 'food', 'eat', 'ate', 'breakfast', 'lunch', 'dinner', 'snack', 'hungry', 'recipe', 'cook'] },
  { key: 'water', words: ['water', 'hydrat', 'drink', 'thirsty', 'fluid'] },
  { key: 'sleep', words: ['sleep', 'tired', 'rest', 'insomnia', 'exhaust', 'nap', 'wake', 'bed'] },
  { key: 'workout', words: ['workout', 'gym', 'exercise', 'move', 'run', 'walk', 'train', 'strength', 'lift', 'yoga', 'cardio'] },
  { key: 'motivation', words: ['motivat', 'consisten', 'habit', 'stuck', 'give up', 'quit', 'lazy', 'discipline', 'streak'] },
  { key: 'weight', words: ['weight', 'scale', 'kg', 'pound', 'body', 'lose', 'gain', 'fat'] },
];

const REPLIES: Record<ReplyKey, Record<CoachTone, string>> = {
  meal: { warm: 'That sounds worth noting down. Log it in your diary if you would like — there is no perfect way to eat, only what fits today.', direct: 'Log it in your diary. One honest entry tells you more than a guess about the whole day.', practical: 'Add it to your diary with the serving that matches. Rough numbers are fine and editable later.' },
  water: { warm: 'Thanks for telling me. Water alongside meals tends to be easier to remember than drinking it separately.', direct: 'Log the glasses you actually had. There is no universal target — your own goal is the one that counts.', practical: 'Open Water and tap the glasses you had. Once you reach your own goal, that is enough for the day.' },
  sleep: { warm: 'A rough night is hard. A slightly earlier wind-down tonight is a kinder move than forcing anything.', direct: 'Look for the pattern rather than chasing a number. A calmer last hour is the lever that usually helps.', practical: 'Log last night in Sleep, then aim for a 20-minute earlier wind-down. Small, repeatable, easy to review.' },
  workout: { warm: 'Moving in any amount counts. Even a short walk is a real session, not a lesser one.', direct: 'Pick the smallest version you will actually do today, then log it. Consistency beats intensity here.', practical: 'Start a routine or quick-log a walk, and it shows up in your history and the weekly map.' },
  motivation: { warm: 'You have not failed — you are between sessions, which happens to everyone. The next small step is enough.', direct: 'Drop the all-or-nothing rule. One small action today keeps the thread going.', practical: 'Shrink the action until it is almost too easy, do that, then log it. Momentum comes from repetition.' },
  weight: { warm: 'Weight is one noisy number, not a verdict on your week. I will not set a target for it.', direct: 'I will not treat weight as a score. Trends matter only if tracking it is genuinely useful to you.', practical: 'If you track it, keep it optional and read the direction over weeks, never a single reading.' },
  default: { warm: 'I can help with food, water, movement, sleep or getting started again. What is on your mind today?', direct: 'Ask me about food, water, movement, sleep or consistency, and I will point to the next concrete step.', practical: 'Try a question about meals, water, movement, sleep or habits, and I will suggest a specific next action.' },
};

const SAFETY_INTRO: Record<CoachTone, string> = {
  warm: 'I want to be careful here, because this could be medical and I am not able to advise on it.',
  direct: 'I cannot advise on this. It may be medical, and that is outside what I can help with.',
  practical: 'I am not able to help with this one, because it may need a clinician rather than an app.',
};

const SUGGESTIONS = ['What could I have for lunch?', 'How do I build a movement habit?', 'I slept badly last night — what helps?', 'How much water is enough?'];

function matchTopic(text: string): TopicKey {
  const lower = text.toLowerCase();
  if (SAFETY_WORDS.some((word) => lower.includes(word))) return 'safety';
  for (const topic of TOPICS) {
    if (topic.words.some((word) => lower.includes(word))) return topic.key;
  }
  return 'default';
}

function replyFor(topic: TopicKey, tone: CoachTone): string {
  if (topic === 'safety') return `${SAFETY_INTRO[tone]} ${SAFETY_NOTES.escalation}`;
  return REPLIES[topic][tone];
}

export function CoachChat() {
  const { state, update } = useDemo();
  const { toast } = useToast();
  const [draft, setDraft] = useState('');
  const tone = state.preferences.tone;

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const now = new Date().toISOString();
    const topic = matchTopic(trimmed);
    const userMessage: CoachMessage = { id: uid('msg'), role: 'user', text: trimmed, at: now };
    const coachMessage: CoachMessage = { id: uid('msg'), role: 'coach', text: replyFor(topic, tone), at: now };
    update((prev) => ({ coach: [...prev.coach, userMessage, coachMessage] }));
    setDraft('');
    if (topic === 'safety') toast('That reply points you to a clinician rather than guessing.', 'warn');
  };

  const clearConversation = () => {
    update({ coach: [] });
    toast('Conversation cleared. Your other demo data is unchanged.', 'info');
  };

  return (
    <div className="page">
      <PageHeader
        kicker="Coach / Ask Coach"
        title="Ask Coach"
        blurb="A scripted coach for this demo. It matches your words to a fixed reply — there is no live AI."
        actions={
          <Row>
            <Chip tone="quiet">Tone: {TONE_LABELS[tone]}</Chip>
            <Link className="link-button" to="/app/account/settings">
              Change tone
            </Link>
          </Row>
        }
      />
      <Panel
        title="Conversation"
        subtitle="Replies are scripted, not generated. Nothing is sent anywhere."
        actions={
          <button type="button" className="button button--ghost button--small" onClick={clearConversation} disabled={state.coach.length === 0}>
            Clear conversation
          </button>
        }
      >
        <div className="chat" aria-live="polite">
          <div className="bubble bubble--coach">
            <span className="bubble__who">Coach · scripted</span>
            Hi {state.name}. I can talk through food, water, movement, sleep or getting back into a rhythm. For anything
            that looks medical, I will point you to a clinician instead.
          </div>
          {state.coach.map((message) => (
            <div key={message.id} className={message.role === 'user' ? 'bubble bubble--user' : 'bubble bubble--coach'}>
              <span className="bubble__who">{message.role === 'user' ? state.name : 'Coach · scripted'}</span>
              {message.text}
            </div>
          ))}
        </div>
        <form
          className="row"
          onSubmit={(event) => {
            event.preventDefault();
            send(draft);
          }}
        >
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask about meals, water, movement or sleep…"
            aria-label="Message to the coach"
            style={{ flex: '1 1 240px' }}
          />
          <button type="submit" className="button" disabled={draft.trim().length === 0}>
            Send
          </button>
        </form>
        <div className="row">
          {SUGGESTIONS.map((suggestion) => (
            <button key={suggestion} type="button" className="button button--ghost button--small" onClick={() => send(suggestion)}>
              {suggestion}
            </button>
          ))}
        </div>
      </Panel>
      <Note tone="warn">
        These replies are scripted for the demo and are not live AI or medical advice. For anything that may be medical
        — pain, injury, chest pain, dizziness, pregnancy, medication or an eating-disorder history — the coach declines
        to advise and points you to a qualified clinician or registered dietitian. You can change the reply tone in
        Settings.
      </Note>
    </div>
  );
}


/* -------------------------------------------------------------------------- */
/* Voice assistant — a text stand-in, no microphone                            */
/* -------------------------------------------------------------------------- */

type VoiceProposal =
  | { kind: 'meal'; foodId: string; servings: number }
  | { kind: 'water'; glasses: number }
  | { kind: 'plan'; title: string; detail: string }
  | { kind: 'unknown' };

const VOICE_SAMPLES = ['I ate two eggs and toast', 'Move my workout to tomorrow', 'I drank three glasses of water'];
const WORD_NUMBERS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };

function parseCount(text: string): number {
  const digits = text.match(/\d+/);
  if (digits) return Number(digits[0]);
  const lower = text.toLowerCase();
  const word = Object.keys(WORD_NUMBERS).find((entry) => lower.includes(entry));
  return word ? WORD_NUMBERS[word] : 1;
}

function parseUtterance(text: string): VoiceProposal {
  const lower = text.toLowerCase();
  if (/water|glass|hydrat|drank|drink/.test(lower)) return { kind: 'water', glasses: Math.max(1, parseCount(lower)) };
  if (/move|workout|reschedul|postpone|tomorrow|session/.test(lower)) {
    return {
      kind: 'plan',
      title: 'Move today’s workout to tomorrow',
      detail: 'You asked to shift today’s movement to tomorrow. It is queued in Plan reviews, where it still waits for your approval.',
    };
  }
  if (/ate|eat|had|breakfast|lunch|dinner|snack|meal/.test(lower)) {
    const foodId = /egg|toast/.test(lower) ? 'eggs-toast' : /oat|cereal|porridge/.test(lower) ? 'oats-milk' : /yog|berry|berries/.test(lower) ? 'greek-yogurt' : /dal|rice/.test(lower) ? 'dal-rice' : /chicken/.test(lower) ? 'chicken-bowl' : FOOD_CATALOG[0].id;
    return { kind: 'meal', foodId, servings: 1 };
  }
  return { kind: 'unknown' };
}

function describeProposal(proposal: VoiceProposal): { title: string; meta: string; tag: string } {
  if (proposal.kind === 'meal') {
    const food = FOOD_CATALOG.find((item) => item.id === proposal.foodId) ?? FOOD_CATALOG[0];
    return { title: 'Proposed: log a meal', meta: `${food.name} · ${proposal.servings} serving · about ${food.kcal} kcal (editable estimate). Nothing is saved until you confirm.`, tag: 'Meal' };
  }
  if (proposal.kind === 'water') {
    return { title: 'Proposed: update today’s water', meta: `Set today’s count to ${proposal.glasses} glass${proposal.glasses === 1 ? '' : 'es'} (replaces the current number). Nothing is saved until you confirm.`, tag: 'Water' };
  }
  if (proposal.kind === 'plan') {
    return { title: `Proposed: ${proposal.title}`, meta: proposal.detail, tag: 'Plan' };
  }
  return { title: 'Could not match that to an action', meta: 'Try “I ate two eggs and toast”, “Move my workout to tomorrow” or “I drank three glasses of water”.', tag: 'No match' };
}


export function CoachVoice() {
  const { update, today } = useDemo();
  const { toast } = useToast();
  const [utterance, setUtterance] = useState('');
  const proposal: VoiceProposal | null = utterance.trim() ? parseUtterance(utterance) : null;
  const described = proposal ? describeProposal(proposal) : null;

  const simulate = () => {
    setUtterance(VOICE_SAMPLES[Math.floor(Math.random() * VOICE_SAMPLES.length)]);
    toast('Simulated listening filled a sample phrase. No microphone was used.', 'info');
  };

  const confirm = () => {
    if (!proposal || proposal.kind === 'unknown') return;
    if (proposal.kind === 'meal') {
      const food = FOOD_CATALOG.find((item) => item.id === proposal.foodId) ?? FOOD_CATALOG[0];
      const entry: MealEntry = {
        id: uid('meal'), date: today, slot: 'breakfast', name: food.name, servings: proposal.servings,
        kcal: Math.round(food.kcal * proposal.servings), protein: round(food.protein * proposal.servings),
        carbs: round(food.carbs * proposal.servings), fat: round(food.fat * proposal.servings),
        fiber: round(food.fiber * proposal.servings), source: 'manual',
      };
      update((prev) => ({ meals: [entry, ...prev.meals], points: awardPoints(prev, 'rule-meal', 'Logged a meal', 2) }));
      toast(`${food.name} added to today’s diary.`);
    } else if (proposal.kind === 'water') {
      const glasses = proposal.glasses;
      update((prev) => ({ water: { ...prev.water, [today]: glasses }, points: awardPoints(prev, 'rule-water', 'Reached your own water goal', 2) }));
      toast(`Today’s water set to ${glasses} glass${glasses === 1 ? '' : 'es'}.`);
    } else {
      const change: PlanChange = { id: uid('change'), title: proposal.title, detail: proposal.detail, status: 'proposed' };
      update((prev) => ({ planChanges: [change, ...prev.planChanges] }));
      toast('Proposed plan change queued in Plan reviews for your approval.', 'info');
    }
    setUtterance('');
  };

  const discard = () => {
    if (!utterance.trim()) return;
    setUtterance('');
    toast('Discarded. Nothing was saved.', 'info');
  };

  return (
    <div className="page">
      <PageHeader
        kicker="Coach / Voice assistant"
        title="Voice assistant"
        blurb="Speak a meal or a change, review the proposal, then confirm before anything saves."
      />
      <Panel
        title="What the coach heard"
        subtitle="A text box stands in for speech in this demo — no microphone is used and no audio leaves the browser."
      >
        <Field label="Speech stand-in" hint="Type what you would say, or press Simulate listening.">
          <input type="text" value={utterance} onChange={(event) => setUtterance(event.target.value)} placeholder="e.g. I ate two eggs and toast" aria-label="Speech stand-in" />
        </Field>
        <div className="row">
          {VOICE_SAMPLES.map((sample) => (
            <button key={sample} type="button" className="button button--ghost button--small" onClick={() => setUtterance(sample)}>
              {sample}
            </button>
          ))}
        </div>
        <Row>
          <button type="button" className="button button--ghost button--small" onClick={simulate}>
            Simulate listening
          </button>
          <button type="button" className="button button--small" onClick={confirm} disabled={!proposal || proposal.kind === 'unknown'}>
            Confirm and save
          </button>
          <button type="button" className="button button--ghost button--small" onClick={discard} disabled={!utterance.trim()}>
            Discard
          </button>
        </Row>
        {described ? (
          <div className="list__item">
            <div className="list__main">
              <span className="list__title">{described.title}</span>
              <span className="list__meta">{described.meta}</span>
            </div>
            <Chip tone={proposal?.kind === 'unknown' ? 'quiet' : 'info'}>{described.tag}</Chip>
          </div>
        ) : (
          <Muted>Nothing proposed yet. Type a phrase or pick a sample above.</Muted>
        )}
      </Panel>
      <Note tone="quiet">
        Voice here is simulated with typed text. No microphone is requested, no audio is captured, and nothing leaves
        this browser. A proposal is only ever written to the demo state after you confirm it.
      </Note>
    </div>
  );
}


/* -------------------------------------------------------------------------- */
/* Plan reviews                                                                */
/* -------------------------------------------------------------------------- */

function reminderKindFor(title: string): Reminder['kind'] {
  const lower = title.toLowerCase();
  if (/strength|workout|move|walk|run|exercise|gym|cardio/.test(lower)) return 'move';
  if (/breakfast|lunch|dinner|meal|eat|food|recipe/.test(lower)) return 'meal';
  if (/sleep|rest|wind|bed/.test(lower)) return 'sleep';
  if (/water|hydrat|drink/.test(lower)) return 'water';
  return 'checkin';
}

/** Accepting a change leaves one honest, visible trace: a follow-up reminder. */
function followUpReminder(change: PlanChange, reminders: Reminder[]): Reminder[] | null {
  const id = `rem-${change.id}`;
  if (reminders.some((reminder) => reminder.id === id)) return null;
  return [...reminders, { id, label: change.title, time: '09:00', kind: reminderKindFor(change.title), enabled: true }];
}

export function CoachReviews() {
  const { state, update } = useDemo();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');

  const proposed = state.planChanges.filter((change) => change.status === 'proposed');
  const history = state.planChanges.filter((change) => change.status !== 'proposed');

  const accept = (change: PlanChange) => {
    update((prev) => {
      const reminders = followUpReminder(change, prev.reminders);
      return {
        planChanges: prev.planChanges.map((item) => (item.id === change.id ? { ...item, status: 'accepted' as const } : item)),
        ...(reminders ? { reminders } : {}),
      };
    });
    toast(`Accepted “${change.title}”. A follow-up reminder was added in Reminders.`);
  };

  const decline = (change: PlanChange) => {
    update((prev) => ({
      planChanges: prev.planChanges.map((item) => (item.id === change.id ? { ...item, status: 'declined' as const } : item)),
    }));
    toast(`Declined “${change.title}”. Nothing changed.`, 'info');
  };

  const suggest = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      toast('Give the change a short title first.', 'warn');
      return;
    }
    const change: PlanChange = { id: uid('change'), title: trimmed, detail: detail.trim() || 'Suggested from the demo review form.', status: 'proposed' };
    update((prev) => ({ planChanges: [change, ...prev.planChanges] }));
    setTitle('');
    setDetail('');
    toast('Proposed change added. It waits for your approval.');
  };


  return (
    <div className="page">
      <PageHeader
        kicker="Coach / Plan reviews"
        title="Plan reviews"
        blurb="Changes the coach suggests, each with its reasoning. Nothing changes until you approve it."
      />
      <Panel title="Waiting for your decision" subtitle="Accept applies a change; decline leaves your plan as it is.">
        {proposed.length === 0 ? (
          <EmptyState title="No open proposals" body="When the coach notices a pattern worth changing, it will suggest one here for you to accept or decline." />
        ) : (
          <ul className="list">
            {proposed.map((change) => (
              <li key={change.id} className="list__item">
                <div className="list__main">
                  <span className="list__title">{change.title}</span>
                  <span className="list__meta">Why this was suggested: {change.detail}</span>
                </div>
                <Row>
                  <button type="button" className="button button--small" onClick={() => accept(change)}>
                    Accept
                  </button>
                  <button type="button" className="button button--ghost button--small" onClick={() => decline(change)}>
                    Decline
                  </button>
                </Row>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <Panel title="Suggest a change" subtitle="Propose your own change and review it here like any other.">
        <Field label="Short title" hint="What would change, in a few words.">
          <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Add a short walk after lunch" aria-label="Change title" />
        </Field>
        <Field label="Why" hint="The reasoning the coach would show for this suggestion.">
          <textarea value={detail} onChange={(event) => setDetail(event.target.value)} placeholder="Afternoon walks were the sessions you actually kept." />
        </Field>
        <Row>
          <button type="button" className="button button--small" onClick={suggest}>
            Add proposal
          </button>
        </Row>
      </Panel>
      <Panel title="History" subtitle="Everything you have accepted or declined.">
        {history.length === 0 ? (
          <EmptyState title="Nothing decided yet" body="Accepted and declined proposals will be listed here." />
        ) : (
          <ul className="list">
            {history.map((change) => (
              <li key={change.id} className="list__item">
                <div className="list__main">
                  <span className="list__title">{change.title}</span>
                  <span className="list__meta">{change.detail}</span>
                </div>
                <Chip tone={change.status === 'accepted' ? 'good' : 'quiet'}>{change.status === 'accepted' ? 'Accepted' : 'Declined'}</Chip>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <Note tone="quiet">
        In the real product the coach never edits your plan on its own — it proposes and waits for your approval. Here,
        accepting a change only adds a follow-up reminder you can edit or remove in Reminders.
      </Note>
    </div>
  );
}

