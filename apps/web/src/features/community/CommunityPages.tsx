import { useState } from 'react';
import { Chip, EmptyState, Field, Meter, Note, PageHeader, Panel, Row, Stat, StatGrid, Toggle } from '../../components/ui';
import { Link } from '../../router';
import { lastNDays, useDemo } from '../../app/demo';
import type { DemoState } from '../../app/demo';
import { CHALLENGES, CREATORS, SAFETY_NOTES } from '../../content';
import { useToast } from '../../app/toast';

/**
 * Community screens: the circle of care, small challenges and creator programs.
 *
 * Everything is local to this browser session. Nothing is invited, sent or
 * published, and challenges never rank weight, calories or bodies.
 */

type MessageIdea = { id: string; label: string; build: (name: string) => string };

const MESSAGE_IDEAS: MessageIdea[] = [
  { id: 'check-in', label: 'Check in', build: (name) => `Hi ${name}, just checking in — how are you feeling today?` },
  { id: 'encourage', label: 'Encourage', build: (name) => `Hi ${name}, no pressure today — even a small step counts. I am cheering you on.` },
  { id: 'celebrate', label: 'Celebrate', build: (name) => `Hi ${name}, I wanted to celebrate a small win with you. Nice going!` },
];

export function CommunityCircle() {
  const { state, update } = useDemo();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [ideaId, setIdeaId] = useState(MESSAGE_IDEAS[0].id);
  const [copied, setCopied] = useState(false);

  const supporters = state.supporters;
  const idea = MESSAGE_IDEAS.find((item) => item.id === ideaId) ?? MESSAGE_IDEAS[0];
  const message = idea.build(supporters[0] ?? 'there');

  const addSupporter = () => {
    const first = name.trim().split(/\s+/)[0];
    if (!first) {
      toast('Add a first name first.', 'warn');
      return;
    }
    if (supporters.length >= 5) {
      toast('Your circle is full at five people.', 'warn');
      return;
    }
    if (supporters.some((person) => person.toLowerCase() === first.toLowerCase())) {
      toast(`${first} is already in your circle.`, 'warn');
      return;
    }
    update((prev) => ({ supporters: [...prev.supporters, first] }));
    setName('');
    toast(`${first} added to your circle (demo only).`);
  };

  const removeSupporter = (person: string) => {
    update((prev) => ({ supporters: prev.supporters.filter((entry) => entry !== person) }));
    toast(`${person} removed from your circle.`, 'info');
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast('Message idea copied to your clipboard.');
    } catch {
      setCopied(false);
      toast('Copying was blocked by your browser. Select the sentence and copy it manually.', 'warn');
    }
  };

  return (
    <div className="page">
      <PageHeader
        kicker="Community / Circle of care"
        title="Circle of care"
        blurb="One to five people you trust. You choose exactly what, if anything, they can see."
        actions={<Chip tone="quiet">{supporters.length}/5</Chip>}
      />
      <Panel title="Your circle" subtitle="Add a first name only. Names stay in this browser session.">
        <StatGrid>
          <Stat label="People in your circle" value={supporters.length} unit="/ 5" hint="Up to five supporters" />
          <Stat label="Sharing" value={state.preferences.shareWithCircle ? 'On' : 'Off'} hint="You control this below" />
        </StatGrid>
        <Field label="Add a supporter" hint="A first name is enough — no invite or email is sent.">
          <Row>
            <input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Priya" aria-label="Supporter first name" style={{ flex: '1 1 200px' }} />
            <button type="button" className="button button--small" onClick={addSupporter} disabled={supporters.length >= 5}>
              Add
            </button>
          </Row>
        </Field>
        {supporters.length === 0 ? (
          <EmptyState title="No one added yet" body="Add up to five people by first name. Nothing is sent to them in this demo." />
        ) : (
          <ul className="list">
            {supporters.map((person) => (
              <li key={person} className="list__item">
                <span className="list__main">
                  <span className="list__title">{person}</span>
                  <span className="list__meta">Supporter · demo only</span>
                </span>
                <button type="button" className="icon-button" aria-label={`Remove ${person}`} onClick={() => removeSupporter(person)}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <Panel title="Message ideas" subtitle="A starting sentence you can copy. Nothing is ever sent." actions={copied ? <Chip tone="good">Copied</Chip> : undefined}>
        <div className="segmented" role="group" aria-label="Message idea">
          {MESSAGE_IDEAS.map((option) => (
            <button key={option.id} type="button" className={option.id === ideaId ? 'is-active' : ''} aria-pressed={option.id === ideaId} onClick={() => setIdeaId(option.id)}>
              {option.label}
            </button>
          ))}
        </div>
        <div className="list__item">
          <span className="list__main">
            <span className="list__title">Suggested message</span>
            <span className="list__meta">{message}</span>
          </span>
        </div>
        <Row>
          <button type="button" className="button button--small" onClick={() => { void copyMessage(); }}>
            Copy message
          </button>
        </Row>
      </Panel>
      <Panel title="What your circle can see" subtitle="Sharing is granular and off by default.">
        <Toggle
          label="Share with my circle"
          hint="When on, only the categories you pick are visible to supporters. Off by default."
          checked={state.preferences.shareWithCircle}
          onChange={(next) => update((prev) => ({ preferences: { ...prev.preferences, shareWithCircle: next } }))}
        />
        <ul className="list">
          <li className="list__item">
            <span className="list__main">
              <span className="list__title">You can share</span>
              <span className="list__meta">A chosen goal, a joined challenge, or a simple “I moved today” flag — each one opt-in.</span>
            </span>
          </li>
          <li className="list__item">
            <span className="list__main">
              <span className="list__title">Never shared</span>
              <span className="list__meta">Weight, calories, meals, sleep scores and mood stay private unless you deliberately change that.</span>
            </span>
          </li>
        </ul>
      </Panel>
      <Note tone="quiet">
        No invite, message or data is ever sent in this demo. Supporter names live only in this browser session and are
        cleared when it ends.
      </Note>
    </div>
  );
}


/* -------------------------------------------------------------------------- */
/* Small challenges                                                            */
/* -------------------------------------------------------------------------- */

/** A fixed, illustrative group number — not a live count of real people. */
const GROUP_TALLY: Record<string, number> = { 'ch-walk': 128, 'ch-veg': 74, 'ch-sleep': 41, 'ch-water': 96 };

function vegetableMeal(mealName: string): boolean {
  return /vegetab|salad|greens|veg|fruit|apple|berry|berries|spinach|broccoli|carrot|tomato|dal|soup|khichdi/.test(mealName.toLowerCase());
}

/** Personal progress is derived from the same demo state the rest of the app writes. */
function personalProgress(state: DemoState, challengeId: string, days: string[]): number {
  const inRange = (date: string) => days.includes(date);
  switch (challengeId) {
    case 'ch-walk':
      return new Set(state.activities.filter((activity) => inRange(activity.date)).map((activity) => activity.date)).size;
    case 'ch-veg':
      return new Set(state.meals.filter((meal) => inRange(meal.date) && vegetableMeal(meal.name)).map((meal) => meal.date)).size;
    case 'ch-sleep':
      return state.sleep.filter((entry) => inRange(entry.date)).length;
    case 'ch-water':
      return days.filter((day) => (state.water[day] ?? 0) > 0).length;
    default:
      return 0;
  }
}

export function CommunityChallenges() {
  const { state, update } = useDemo();
  const { toast } = useToast();
  const joined = state.joinedChallenges;

  const toggleJoin = (id: string, challengeName: string) => {
    const isJoined = joined.includes(id);
    update((prev) => ({
      joinedChallenges: isJoined ? prev.joinedChallenges.filter((entry) => entry !== id) : [...prev.joinedChallenges, id],
    }));
    toast(isJoined ? `Left “${challengeName}”.` : `Joined “${challengeName}” (demo only).`);
  };

  return (
    <div className="page">
      <PageHeader
        kicker="Community / Small challenges"
        title="Small challenges"
        blurb="Shared commitments with no public leaderboard and no weight or calorie ranking."
        actions={<Link className="button button--ghost button--small" to="/app/community/circle">Your circle</Link>}
      />
      <Panel title="Available challenges" subtitle="Join or leave any time. Progress is counted from your own entries.">
        <ul className="list">
          {CHALLENGES.map((challenge) => {
            const isJoined = joined.includes(challenge.id);
            const days = lastNDays(Number.parseInt(challenge.length, 10));
            const progress = isJoined ? personalProgress(state, challenge.id, days) : 0;
            return (
              <li key={challenge.id} className="list__item">
                <div className="list__main">
                  <span className="list__title">{challenge.name}</span>
                  <span className="list__meta">{challenge.description} · {challenge.length} · {challenge.shape}</span>
                  {isJoined ? (
                    <>
                      <Meter value={progress} max={days.length} label={`${challenge.name} progress`} />
                      <span className="list__meta">
                        Your progress: {progress} of {days.length} days logged. Group tally (illustrative): {GROUP_TALLY[challenge.id] ?? 0}.
                      </span>
                    </>
                  ) : null}
                </div>
                <button type="button" className={isJoined ? 'button button--ghost button--small' : 'button button--small'} onClick={() => toggleJoin(challenge.id, challenge.name)}>
                  {isJoined ? 'Leave' : 'Join'}
                </button>
              </li>
            );
          })}
        </ul>
      </Panel>
      <Panel title="How this works" subtitle="Honest by design.">
        <StatGrid>
          <Stat label="Challenges joined" value={joined.length} unit={`/ ${CHALLENGES.length}`} />
        </StatGrid>
        <ul className="list">
          <li className="list__item">
            <span className="list__main">
              <span className="list__title">No public leaderboard</span>
              <span className="list__meta">You never appear in a ranked list, and no one sees your individual entries.</span>
            </span>
          </li>
          <li className="list__item">
            <span className="list__main">
              <span className="list__title">No weight or calorie ranking</span>
              <span className="list__meta">Challenges count days you showed up, never a body measurement or a restriction target.</span>
            </span>
          </li>
          <li className="list__item">
            <span className="list__main">
              <span className="list__title">Group tally is illustrative</span>
              <span className="list__meta">The group number is a fixed sample, not a live count of real people.</span>
            </span>
          </li>
        </ul>
      </Panel>
      <Note tone="quiet">
        Progress comes from your own demo entries. There is no public leaderboard, and nothing about weight or calories
        is ever ranked.
      </Note>
    </div>
  );
}


/* -------------------------------------------------------------------------- */
/* Creator programs                                                            */
/* -------------------------------------------------------------------------- */

export function CommunityCreators() {
  const { toast } = useToast();
  const [followed, setFollowed] = useState<string[]>([]);

  const toggleFollow = (id: string, creatorName: string) => {
    const isFollowing = followed.includes(id);
    setFollowed((prev) => (isFollowing ? prev.filter((entry) => entry !== id) : [...prev, id]));
    toast(
      isFollowing ? `Unfollowed ${creatorName} (demo only).` : `Following ${creatorName} (demo only — this contacts no one).`,
      'info',
    );
  };

  return (
    <div className="page">
      <PageHeader
        kicker="Community / Creator programs"
        title="Creator programs"
        blurb="Programs from people who are named and paid fairly. Every figure here is an illustrative example."
      />
      <div className="grid-2">
        {CREATORS.map((creator) => {
          const isFollowing = followed.includes(creator.id);
          return (
            <Panel key={creator.id} as="article" title={creator.name} subtitle={creator.discipline} actions={<Chip tone="quiet">{creator.share}</Chip>}>
              <p className="list__title">{creator.program}</p>
              <p className="list__meta">{creator.sessions} · {creator.price}</p>
              <p className="list__meta">{creator.note}</p>
              <Row>
                <button type="button" className={isFollowing ? 'button button--ghost button--small' : 'button button--small'} onClick={() => toggleFollow(creator.id, creator.name)}>
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </Row>
            </Panel>
          );
        })}
      </div>
      <Panel title="How creator revenue share works" subtitle="A transparent split, not a black box.">
        <ul className="list">
          <li className="list__item">
            <span className="list__main">
              <span className="list__title">Creators are named and paid</span>
              <span className="list__meta">Each program shows the share the creator receives — for example 60% of program revenue.</span>
            </span>
          </li>
          <li className="list__item">
            <span className="list__main">
              <span className="list__title">You pay for access, not attention</span>
              <span className="list__meta">Programs are included with membership; following a creator does not change what you pay.</span>
            </span>
          </li>
          <li className="list__item">
            <span className="list__main">
              <span className="list__title">Illustrative figures</span>
              <span className="list__meta">Prices, session shapes and shares are sample values for this demo, not real offers.</span>
            </span>
          </li>
        </ul>
      </Panel>
      <Note tone="quiet">
        {SAFETY_NOTES.finance} Following a creator here is demo-only and contacts no one.
      </Note>
    </div>
  );
}

