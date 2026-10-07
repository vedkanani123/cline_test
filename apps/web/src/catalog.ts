/**
 * The complete map of Nurture destinations.
 *
 * Every entry here must resolve to a real screen. Nothing in this catalog is a
 * dead link — that is the whole point of the demo milestone.
 */

export type GroupId =
  | 'today'
  | 'plan'
  | 'food'
  | 'move'
  | 'wellbeing'
  | 'progress'
  | 'coach'
  | 'community'
  | 'rewards'
  | 'connections'
  | 'account';

export type PageDef = {
  /** Stable id, also used as the route key: `food/diary`. */
  id: string;
  /** Absolute URL path. */
  path: string;
  /** Sidebar + breadcrumb label. */
  label: string;
  group: GroupId;
  /** One line shown in search results and page headers. */
  blurb: string;
  /** Extra search terms so people find pages in their own words. */
  keywords?: string[];
};

/** A page as authored inside a group — the group id is injected when flattening. */
export type PageInput = Omit<PageDef, 'group'>;

export type GroupDef = {
  id: GroupId;
  label: string;
  /** Short glyph used in the shell. */
  glyph: string;
  pages: PageInput[];
};

export const GROUPS: GroupDef[] = [
  {
    id: 'today',
    label: 'Today',
    glyph: '✦',
    pages: [
      { id: 'today/overview', path: '/app', label: 'Overview', blurb: 'One clear next step, plus the shape of your whole day.', keywords: ['home', 'dashboard', 'today'] },
      { id: 'today/schedule', path: '/app/today/schedule', label: 'Daily schedule', blurb: 'Your rhythm for today — move anything, keep what fits.', keywords: ['routine', 'plan', 'calendar'] },
      { id: 'today/check-in', path: '/app/today/check-in', label: 'Check-in', blurb: 'A thirty-second note on how today actually feels.', keywords: ['mood', 'energy', 'journal'] },
    ],
  },
  {
    id: 'plan',
    label: 'Your plan',
    glyph: '◈',
    pages: [
      { id: 'plan/journey', path: '/app/plan/journey', label: '100-day journey', blurb: 'A long view that stays kind to a hard week.', keywords: ['goal', '100 days', 'progress'] },
      { id: 'plan/week', path: '/app/plan/week', label: 'Weekly plan', blurb: 'The week at a glance, with room to rearrange.', keywords: ['week', 'schedule'] },
      { id: 'plan/goals', path: '/app/plan/goals', label: 'Goals', blurb: 'What you are working toward, and why it matters to you.', keywords: ['goal', 'direction', 'focus'] },
    ],
  },
  {
    id: 'food',
    label: 'Food',
    glyph: '❋',
    pages: [
      { id: 'food/diary', path: '/app/food/diary', label: 'Food diary', blurb: 'What you ate today, in as much detail as you want.', keywords: ['calories', 'protein', 'log', 'meals'] },
      { id: 'food/scan', path: '/app/food/scan', label: 'Review a meal photo', blurb: 'An editable estimate from a photo — never a verdict.', keywords: ['photo', 'ai', 'scan', 'camera'] },
      { id: 'food/recipes', path: '/app/food/recipes', label: 'Recipes', blurb: 'Everyday cooking that fits your time, taste and budget.', keywords: ['cooking', 'meals', 'ideas'] },
      { id: 'food/meal-planner', path: '/app/food/meal-planner', label: 'Meal planner', blurb: 'Plan a few days without planning your whole life.', keywords: ['plan', 'menu', 'week'] },
      { id: 'food/groceries', path: '/app/food/groceries', label: 'Groceries', blurb: 'A list that builds itself from what you plan to cook.', keywords: ['shopping', 'list'] },
      { id: 'food/water', path: '/app/food/water', label: 'Water', blurb: 'Gentle hydration reminders, with no rigid universal target.', keywords: ['hydration', 'drink', 'reminder'] },
    ],
  },
  {
    id: 'move',
    label: 'Movement',
    glyph: '◆',
    pages: [
      { id: 'move/workouts', path: '/app/move/workouts', label: 'Workouts', blurb: 'Strength sessions you can start, pause and actually finish.', keywords: ['gym', 'strength', 'sets', 'reps'] },
      { id: 'move/exercises', path: '/app/move/exercises', label: 'Exercise library', blurb: 'Browse movements with form cues and easier options.', keywords: ['library', 'form', 'demo'] },
      { id: 'move/yoga', path: '/app/move/yoga', label: 'Yoga & mobility', blurb: 'Short flows and mobility work for stiff, busy days.', keywords: ['yoga', 'stretch', 'mobility'] },
      { id: 'move/cardio', path: '/app/move/cardio', label: 'Cardio & walks', blurb: 'Walks, runs and rides — recorded your way.', keywords: ['walk', 'run', 'steps', 'cardio'] },
      { id: 'move/history', path: '/app/move/history', label: 'Activity history', blurb: 'Everything you have moved, and the option to remove it.', keywords: ['history', 'log', 'sessions'] },
    ],
  },
  {
    id: 'wellbeing',
    label: 'Wellbeing',
    glyph: '☾',
    pages: [
      { id: 'wellbeing/sleep', path: '/app/wellbeing/sleep', label: 'Sleep', blurb: 'Last night, and the pattern behind it.', keywords: ['rest', 'bedtime', 'hours'] },
      { id: 'wellbeing/recovery', path: '/app/wellbeing/recovery', label: 'Recovery', blurb: 'Rest days that count as progress, not absence.', keywords: ['rest', 'soreness', 'readiness'] },
      { id: 'wellbeing/body', path: '/app/wellbeing/body', label: 'Body metrics', blurb: 'Measurements you choose to keep — or ignore entirely.', keywords: ['weight', 'measurements', 'waist'] },
      { id: 'wellbeing/habits', path: '/app/wellbeing/habits', label: 'Habits & mood', blurb: 'Small repeatable actions and how the days felt.', keywords: ['habits', 'streak', 'mood', 'energy'] },
    ],
  },
  {
    id: 'progress',
    label: 'Progress',
    glyph: '◎',
    pages: [
      { id: 'progress/insights', path: '/app/progress/insights', label: 'Insights', blurb: 'What your logged days add up to, without a score.', keywords: ['summary', 'overview', 'insights'] },
      { id: 'progress/trends', path: '/app/progress/trends', label: 'Trends', blurb: 'Compare against your own baseline first.', keywords: ['chart', 'trend', 'graph'] },
      { id: 'progress/reports', path: '/app/progress/reports', label: 'Reports', blurb: 'A plain-language summary you could share with a clinician.', keywords: ['report', 'export', 'summary'] },
    ],
  },
  {
    id: 'coach',
    label: 'Coach',
    glyph: '✳',
    pages: [
      { id: 'coach/chat', path: '/app/coach/chat', label: 'Ask Coach', blurb: 'Scripted in this demo, honest about what it cannot do.', keywords: ['ai', 'chat', 'help', 'assistant'] },
      { id: 'coach/voice', path: '/app/coach/voice', label: 'Voice assistant', blurb: 'Speak a meal or a change; confirm before it saves.', keywords: ['voice', 'speak', 'assistant'] },
      { id: 'coach/reviews', path: '/app/coach/reviews', label: 'Plan reviews', blurb: 'Proposed changes that wait for your approval.', keywords: ['review', 'adapt', 'change'] },
    ],
  },
  {
    id: 'community',
    label: 'Community',
    glyph: '❖',
    pages: [
      { id: 'community/circle', path: '/app/community/circle', label: 'Circle of care', blurb: 'One to five people you trust, sharing only what you pick.', keywords: ['friends', 'support', 'share'] },
      { id: 'community/challenges', path: '/app/community/challenges', label: 'Small challenges', blurb: 'Shared goals with no public leaderboard.', keywords: ['challenge', 'group', 'goal'] },
      { id: 'community/creators', path: '/app/community/creators', label: 'Creator programs', blurb: 'Programs from people who are named and paid fairly.', keywords: ['creator', 'trainer', 'program'] },
    ],
  },
  {
    id: 'rewards',
    label: 'Rewards',
    glyph: '✧',
    pages: [
      { id: 'rewards/overview', path: '/app/rewards/overview', label: 'Kind points', blurb: 'Transparent rules that never reward restriction.', keywords: ['points', 'badges', 'rewards'] },
      { id: 'rewards/history', path: '/app/rewards/history', label: 'Badge history', blurb: 'What you collected, and exactly how you earned it.', keywords: ['badges', 'history'] },
    ],
  },
  {
    id: 'connections',
    label: 'Connections',
    glyph: '⇄',
    pages: [
      { id: 'connections/devices', path: '/app/connections/devices', label: 'Devices', blurb: 'Watches and rings, simulated until real permissions exist.', keywords: ['watch', 'ring', 'wearable', 'device'] },
      { id: 'connections/apps', path: '/app/connections/apps', label: 'Connected apps', blurb: 'Health apps and platforms you choose to exchange with.', keywords: ['healthkit', 'health connect', 'apps'] },
      { id: 'connections/import-export', path: '/app/connections/import-export', label: 'Import & export', blurb: 'Your data, portable and deletable.', keywords: ['export', 'import', 'data'] },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    glyph: '◍',
    pages: [
      { id: 'account/profile', path: '/app/account/profile', label: 'Profile', blurb: 'The basics Nurture uses to shape your day.', keywords: ['profile', 'details'] },
      { id: 'account/reminders', path: '/app/account/reminders', label: 'Reminders', blurb: 'Nudges you control by topic, time and intensity.', keywords: ['notifications', 'alerts', 'reminders'] },
      { id: 'account/privacy', path: '/app/account/privacy', label: 'Privacy & data', blurb: 'What is stored, what is shared, and how to leave.', keywords: ['privacy', 'consent', 'delete'] },
      { id: 'account/settings', path: '/app/account/settings', label: 'Settings', blurb: 'Tone, units, motion and accessibility preferences.', keywords: ['settings', 'preferences', 'accessibility'] },
    ],
  },
];

export const PAGES: PageDef[] = GROUPS.flatMap((group) =>
  group.pages.map((page) => ({ ...page, group: group.id })),
);

const BY_PATH = new Map(PAGES.map((page) => [page.path, page]));
const BY_ID = new Map(PAGES.map((page) => [page.id, page]));

export function pageForPath(pathname: string): PageDef | undefined {
  const clean = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return BY_PATH.get(clean);
}

export function pageForId(id: string): PageDef | undefined {
  return BY_ID.get(id);
}

export function groupForId(id: GroupId): GroupDef {
  const group = GROUPS.find((candidate) => candidate.id === id);
  if (!group) throw new Error(`Unknown group: ${id}`);
  return group;
}

export function searchPages(query: string): PageDef[] {
  const term = query.trim().toLowerCase();
  if (!term) return PAGES;
  return PAGES.filter((page) => {
    const haystack = [page.label, page.group, page.blurb, ...(page.keywords ?? [])].join(' ').toLowerCase();
    return haystack.includes(term);
  });
}

export const PAGE_COUNT = PAGES.length;
