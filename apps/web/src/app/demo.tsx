import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/**
 * The single source of truth for the frontend demo.
 *
 * There is no backend yet, so state lives in `sessionStorage` and is shared by
 * every screen. That is what makes the demo feel like one product instead of a
 * set of disconnected mock-ups: logging a meal in Food changes Today, Insights
 * and Kind points.
 *
 * Nothing here is real health data and nothing leaves the browser.
 */

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type FoodSource = 'catalog' | 'manual' | 'photo' | 'recipe';
export type ActivityKind = 'strength' | 'walk' | 'cardio' | 'yoga' | 'mobility';
export type FocusId = 'feel-better' | 'build-strength' | 'move-more' | 'eat-well' | 'rest-better';
export type CoachTone = 'warm' | 'direct' | 'practical';

export type MealEntry = {
  id: string;
  date: string;
  slot: MealSlot;
  name: string;
  servings: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  source: FoodSource;
};

export type ActivityEntry = {
  id: string;
  date: string;
  name: string;
  kind: ActivityKind;
  minutes: number;
  detail: string;
};

export type SleepEntry = { date: string; hours: number; quality: number };
export type BodyEntry = { date: string; weight: number | null; waist: number | null; note: string };
export type CheckIn = { date: string; mood: number; energy: number; note: string };
export type Goal = { focus: FocusId; text: string; why: string; days: number; createdAt: string };
export type CoachMessage = { id: string; role: 'user' | 'coach'; text: string; at: string };
export type Reminder = { id: string; label: string; time: string; kind: 'meal' | 'water' | 'move' | 'sleep' | 'checkin'; enabled: boolean };
export type GroceryItem = { id: string; text: string; done: boolean; from: string };
export type PlanChange = { id: string; title: string; detail: string; status: 'proposed' | 'accepted' | 'declined' };
export type PhotoReview = {
  id: string;
  date: string;
  label: string;
  confidence: 'low' | 'medium' | 'high';
  items: { name: string; kcal: number; protein: number; carbs: number; fat: number; fiber: number }[];
  saved: boolean;
};

export type Preferences = {
  tone: CoachTone;
  units: 'metric' | 'imperial';
  personalizedInsights: boolean;
  shareWithCircle: boolean;
  productAnalytics: boolean;
  reducedMotion: boolean;
  reminderIntensity: 'gentle' | 'structured' | 'accountability';
};

export type DemoState = {
  version: number;
  name: string;
  goal: Goal | null;
  meals: MealEntry[];
  water: Record<string, number>;
  activities: ActivityEntry[];
  sleep: SleepEntry[];
  body: BodyEntry[];
  habits: Record<string, string[]>;
  mood: Record<string, number>;
  checkIns: CheckIn[];
  momentsDone: string[];
  planChanges: PlanChange[];
  photoReviews: PhotoReview[];
  savedRecipes: string[];
  groceries: GroceryItem[];
  mealPlan: Record<string, string[]>;
  supporters: string[];
  joinedChallenges: string[];
  points: { earned: number; spent: number; log: { id: string; label: string; value: number; at: string }[] };
  badges: string[];
  coach: CoachMessage[];
  reminders: Reminder[];
  connections: Record<string, 'connected' | 'available'>;
  preferences: Preferences;
};

export const FOCUS_OPTIONS: { id: FocusId; label: string; blurb: string }[] = [
  { id: 'feel-better', label: 'Feel better', blurb: 'A balanced daily rhythm' },
  { id: 'build-strength', label: 'Build strength', blurb: 'Move with growing confidence' },
  { id: 'move-more', label: 'Move more', blurb: 'Make activity easier to start' },
  { id: 'eat-well', label: 'Eat well', blurb: 'Find meals that fit real life' },
  { id: 'rest-better', label: 'Rest better', blurb: 'Protect sleep and recovery' },
];

export const MEAL_SLOTS: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'snack'];
export const ACTIVITY_KINDS: ActivityKind[] = ['strength', 'walk', 'cardio', 'yoga', 'mobility'];

export function uid(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function toKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function dayKey(offset = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return toKey(date);
}

export function todayKey(): string {
  return dayKey(0);
}

export function parseKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year ?? 2000, (month ?? 1) - 1, day ?? 1);
}

export function formatKey(key: string): string {
  return parseKey(key).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
}

export function weekdayLetter(key: string): string {
  return parseKey(key).toLocaleDateString(undefined, { weekday: 'narrow' });
}

export function weekdayName(key: string): string {
  return parseKey(key).toLocaleDateString(undefined, { weekday: 'long' });
}

export function lastNDays(count: number): string[] {
  const days: string[] = [];
  for (let index = count - 1; index >= 0; index -= 1) days.push(dayKey(-index));
  return days;
}

export type MealTotals = { kcal: number; protein: number; carbs: number; fat: number; fiber: number; count: number };

export function mealTotals(meals: MealEntry[]): MealTotals {
  return meals.reduce<MealTotals>(
    (totals, meal) => ({
      kcal: totals.kcal + meal.kcal,
      protein: totals.protein + meal.protein,
      carbs: totals.carbs + meal.carbs,
      fat: totals.fat + meal.fat,
      fiber: totals.fiber + meal.fiber,
      count: totals.count + 1,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, count: 0 },
  );
}

export function activityTotals(activities: ActivityEntry[]): { sessions: number; minutes: number; kinds: number } {
  return {
    sessions: activities.length,
    minutes: activities.reduce((total, activity) => total + activity.minutes, 0),
    kinds: new Set(activities.map((activity) => activity.kind)).size,
  };
}

export function onDate<T extends { date: string }>(entries: T[], date: string): T[] {
  return entries.filter((entry) => entry.date === date);
}

export function round(value: number): number {
  return Math.round(value * 10) / 10;
}

const STORAGE_KEY = 'nurture.demo.v1';
const NAME_KEY = 'nurture.name';
const STATE_VERSION = 1;

export function defaultState(name = 'Alex'): DemoState {
  const today = todayKey();
  return {
    version: STATE_VERSION,
    name,
    goal: null,
    meals: [],
    water: { [today]: 3 },
    activities: [],
    sleep: [],
    body: [],
    habits: {},
    mood: {},
    checkIns: [],
    momentsDone: [],
    planChanges: [
      {
        id: 'change-evening',
        title: 'Move strength to the weekend',
        detail: 'Three evening sessions were skipped while two morning walks happened. Keeping weekday movement short and moving strength to Saturday fits what actually occurred.',
        status: 'proposed',
      },
      {
        id: 'change-breakfast',
        title: 'Keep the breakfast you already repeat',
        detail: 'You log the same breakfast most days. Reusing it as a saved meal removes one decision from the morning.',
        status: 'proposed',
      },
    ],
    photoReviews: [],
    savedRecipes: [],
    groceries: [],
    mealPlan: {},
    supporters: [],
    joinedChallenges: [],
    points: { earned: 4, spent: 0, log: [{ id: 'seed-1', label: 'Starting the demo', value: 4, at: today }] },
    badges: [],
    coach: [],
    reminders: [
      { id: 'rem-water', label: 'Water with a meal', time: '13:00', kind: 'water', enabled: true },
      { id: 'rem-move', label: 'A short walk', time: '12:30', kind: 'move', enabled: true },
      { id: 'rem-checkin', label: 'Evening check-in', time: '20:30', kind: 'checkin', enabled: false },
    ],
    connections: {},
    preferences: {
      tone: 'warm',
      units: 'metric',
      personalizedInsights: true,
      shareWithCircle: false,
      productAnalytics: false,
      reducedMotion: false,
      reminderIntensity: 'gentle',
    },
  };
}

function readName(): string {
  try {
    const stored = window.sessionStorage.getItem(NAME_KEY);
    return stored && stored.trim() ? stored.trim() : 'Alex';
  } catch {
    return 'Alex';
  }
}

export function saveName(name: string) {
  try {
    window.sessionStorage.setItem(NAME_KEY, name);
  } catch {
    /* sessionStorage can be unavailable in private modes; the demo still works. */
  }
}

export function loadName(): string {
  return readName();
}

function loadState(): DemoState {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState(readName());
    const parsed = JSON.parse(raw) as DemoState;
    if (parsed.version !== STATE_VERSION) return defaultState(readName());
    return { ...defaultState(parsed.name), ...parsed, preferences: { ...defaultState(parsed.name).preferences, ...parsed.preferences } };
  } catch {
    return defaultState(readName());
  }
}

function persist(state: DemoState) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* Ignore quota/private-mode failures; the in-memory state is still correct. */
  }
}

export function clearDemoStorage() {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Points are awarded once per rule per day, which is what keeps them honest. */
export function awardPoints(state: DemoState, ruleId: string, label: string, value: number): DemoState['points'] {
  const today = todayKey();
  const id = `${ruleId}:${today}`;
  if (state.points.log.some((entry) => entry.id === id)) return state.points;
  return {
    earned: state.points.earned + value,
    spent: state.points.spent,
    log: [{ id, label, value, at: today }, ...state.points.log],
  };
}

type DemoContextValue = {
  state: DemoState;
  update: (patch: Partial<DemoState> | ((prev: DemoState) => Partial<DemoState>)) => void;
  reset: () => void;
  setName: (name: string) => void;
  today: string;
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(loadState);

  useEffect(() => {
    persist(state);
  }, [state]);

  const update = useCallback((patch: Partial<DemoState> | ((prev: DemoState) => Partial<DemoState>)) => {
    setState((prev) => {
      const partial = typeof patch === 'function' ? patch(prev) : patch;
      return { ...prev, ...partial };
    });
  }, []);

  const reset = useCallback(() => {
    clearDemoStorage();
    setState(defaultState(readName()));
  }, []);

  const setName = useCallback((name: string) => {
    saveName(name);
    setState((prev) => ({ ...prev, name }));
  }, []);

  const value = useMemo<DemoContextValue>(
    () => ({ state, update, reset, setName, today: todayKey() }),
    [state, update, reset, setName],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used inside <DemoProvider>.');
  return context;
}
