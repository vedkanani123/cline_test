import { Chip, EmptyState, Note, PageHeader, Panel, Row, Stat, StatGrid } from '../../components/ui';
import { Link } from '../../router';
import { formatKey, useDemo } from '../../app/demo';
import type { DemoState } from '../../app/demo';
import { BADGES, POINT_RULES, SAFETY_NOTES } from '../../content';
import { useToast } from '../../app/toast';

/**
 * Rewards screens: Kind points and badge history.
 *
 * Points are earned once per rule per day and only for everyday actions.
 * Nothing here rewards eating less, extra exercise or weight change, and points
 * and badges are fictional with no cash value. Badge spends are recorded in the
 * same ledger so history shows a real date and a consistent running balance.
 */

export function RewardsOverview() {
  const { state, update, today } = useDemo();
  const { toast } = useToast();
  const balance = state.points.earned - state.points.spent;

  const collect = (badgeId: string, badgeName: string, cost: number) => {
    if (state.badges.includes(badgeId)) return;
    if (balance < cost) {
      const short = cost - balance;
      toast(`You need ${short} more point${short === 1 ? '' : 's'} for “${badgeName}”.`, 'warn');
      return;
    }
    update((prev) => ({
      badges: [...prev.badges, badgeId],
      points: {
        earned: prev.points.earned,
        spent: prev.points.spent + cost,
        log: [{ id: `badge:${badgeId}:${today}`, label: `Collected badge: ${badgeName}`, value: -cost, at: today }, ...prev.points.log],
      },
    }));
    toast(`“${badgeName}” collected. ${cost} points spent.`);
  };

  return (
    <div className="page">
      <PageHeader
        kicker="Rewards / Kind points"
        title="Kind points"
        blurb="Points you earn for showing up, in your own way. They are fictional and carry no cash value."
        actions={<Link className="button button--ghost button--small" to="/app/rewards/history">Badge history</Link>}
      />
      <Panel title="Your balance">
        <StatGrid>
          <Stat label="Earned" value={state.points.earned} hint="Once per rule per day" />
          <Stat label="Spent" value={state.points.spent} hint="On collected badges" />
          <Stat label="Balance" value={balance} hint="Earned minus spent" />
        </StatGrid>
      </Panel>
      <Panel title="How you earn points" subtitle="Capped once a day per rule. No rule rewards eating less or moving more.">
        <ul className="list">
          {POINT_RULES.map((rule) => {
            const awarded = state.points.log.some((entry) => entry.id.startsWith(`${rule.id}:`));
            return (
              <li key={rule.id} className="list__item">
                <div className="list__main">
                  <span className="list__title">{rule.label}</span>
                  <span className="list__meta">
                    {rule.detail} · {rule.cap} · worth {rule.value} point{rule.value === 1 ? '' : 's'}
                  </span>
                </div>
                <Chip tone={awarded ? 'good' : 'quiet'}>{awarded ? 'Awarded today' : 'Not yet today'}</Chip>
              </li>
            );
          })}
        </ul>
      </Panel>
      <Panel title="Badges" subtitle="Collect with points. Each one is disabled until you can afford it.">
        <div className="grid-2">
          {BADGES.map((badge) => {
            const collected = state.badges.includes(badge.id);
            const short = badge.cost - balance;
            const affordable = short <= 0;
            return (
              <div key={badge.id} className="badge-card">
                <span className="badge-card__mark" aria-hidden="true">★</span>
                <div className="list__main">
                  <span className="list__title">{badge.name}</span>
                  <span className="list__meta">{badge.description}</span>
                  <span className="list__meta">
                    {collected ? 'Collected' : affordable ? `Costs ${badge.cost} points` : `Need ${short} more point${short === 1 ? '' : 's'}`}
                  </span>
                  <Row>
                    <button
                      type="button"
                      className="button button--small"
                      onClick={() => collect(badge.id, badge.name, badge.cost)}
                      disabled={collected || !affordable}
                    >
                      {collected ? 'Collected' : `Collect for ${badge.cost} points`}
                    </button>
                  </Row>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
      <Note tone="warn">
        {SAFETY_NOTES.finance} Kind points and badges are fictional: they have no cash value, cannot be purchased, and
        never earn extra for extra exercise, calorie restriction or weight change. They only mark everyday actions such
        as logging a meal, moving your way, resting or checking in.
      </Note>
    </div>
  );
}

/** A badge's collection date comes from its spend line in the points ledger. */
function badgeCollectedDate(state: DemoState, badgeId: string): string | null {
  const line = state.points.log.find((entry) => entry.id.startsWith(`badge:${badgeId}:`));
  return line ? line.at : null;
}

export function RewardsHistory() {
  const { state } = useDemo();

  // The log is stored newest-first; walk it oldest-first for a running balance, then flip back.
  let running = 0;
  const rows = [...state.points.log]
    .reverse()
    .map((entry) => {
      running += entry.value;
      return { entry, balance: running };
    })
    .reverse();

  return (
    <div className="page">
      <PageHeader
        kicker="Rewards / Badge history"
        title="Badge history"
        blurb="Every point and badge, with the date and a running balance."
        actions={<Link className="button button--ghost button--small" to="/app/rewards/overview">Kind points</Link>}
      />
      <Panel title="Points ledger" subtitle="Newest first. Positive lines are earned; negative lines are badge spends.">
        {rows.length === 0 ? (
          <EmptyState title="Nothing logged yet" body="Points you earn will appear here, newest first, with a running balance." />
        ) : (
          <ul className="list">
            {rows.map(({ entry, balance }) => (
              <li key={entry.id} className="list__item">
                <div className="list__main">
                  <span className="list__title">{entry.label}</span>
                  <span className="list__meta">{formatKey(entry.at)}</span>
                </div>
                <div className="list__main">
                  <span className="list__title">{entry.value > 0 ? `+${entry.value}` : entry.value}</span>
                  <span className="list__meta">Balance {balance}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <Panel title="Collected badges">
        {state.badges.length === 0 ? (
          <EmptyState title="No badges yet" body="Collect a badge from Kind points and it will appear here with its date." />
        ) : (
          <ul className="list">
            {state.badges.map((badgeId) => {
              const badge = BADGES.find((item) => item.id === badgeId);
              const collectedAt = badgeCollectedDate(state, badgeId);
              return (
                <li key={badgeId} className="list__item">
                  <span className="list__main">
                    <span className="list__title">{badge ? badge.name : badgeId}</span>
                    <span className="list__meta">{badge ? badge.description : 'Collected in this demo.'}</span>
                  </span>
                  <span className="list__meta">{collectedAt ? `Collected ${formatKey(collectedAt)}` : 'Collected this session'}</span>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
      <Note tone="quiet">
        Points and badges are illustrative and carry no cash value. This ledger reflects your demo actions in this
        browser session only.
      </Note>
    </div>
  );
}

