import { describe, expect, it } from 'vitest';
import {
  activityTotals,
  awardPoints,
  dayKey,
  defaultState,
  formatKey,
  lastNDays,
  mealTotals,
  onDate,
  toKey,
  uid,
  weekdayLetter,
  type ActivityEntry,
  type MealEntry,
} from './demo';

function meal(overrides: Partial<MealEntry> = {}): MealEntry {
  return {
    id: uid('meal'),
    date: dayKey(0),
    slot: 'lunch',
    name: 'Test meal',
    servings: 1,
    kcal: 100,
    protein: 10,
    carbs: 20,
    fat: 5,
    fiber: 4,
    source: 'manual',
    ...overrides,
  };
}

function activity(overrides: Partial<ActivityEntry> = {}): ActivityEntry {
  return { id: uid('act'), date: dayKey(0), name: 'Walk', kind: 'walk', minutes: 20, detail: '', ...overrides };
}

describe('date helpers', () => {
  it('produces stable keys in local time', () => {
    expect(toKey(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(toKey(new Date(2026, 11, 31))).toBe('2026-12-31');
  });

  it('offsets days from today', () => {
    expect(dayKey(0)).toBe(toKey(new Date()));
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(dayKey(-1)).toBe(toKey(yesterday));
  });

  it('returns a contiguous ascending range', () => {
    const days = lastNDays(7);
    expect(days).toHaveLength(7);
    expect(days[6]).toBe(dayKey(0));
    expect(days[0]).toBe(dayKey(-6));
  });

  it('formats a key and a weekday letter without throwing', () => {
    expect(formatKey('2026-01-05').length).toBeGreaterThan(3);
    expect(weekdayLetter('2026-01-05')).toHaveLength(1);
  });
});

describe('mealTotals', () => {
  it('sums an empty list to zero', () => {
    expect(mealTotals([])).toEqual({ kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, count: 0 });
  });

  it('sums every nutrient and counts entries', () => {
    const totals = mealTotals([meal(), meal({ kcal: 250, protein: 20, carbs: 30, fat: 10, fiber: 6 })]);
    expect(totals).toEqual({ kcal: 350, protein: 30, carbs: 50, fat: 15, fiber: 10, count: 2 });
  });
});

describe('activityTotals', () => {
  it('counts sessions, minutes and distinct kinds', () => {
    const totals = activityTotals([activity(), activity({ minutes: 10 }), activity({ kind: 'yoga', minutes: 15 })]);
    expect(totals).toEqual({ sessions: 3, minutes: 45, kinds: 2 });
  });

  it('handles no activity', () => {
    expect(activityTotals([])).toEqual({ sessions: 0, minutes: 0, kinds: 0 });
  });
});

describe('onDate', () => {
  it('filters by date and leaves the source array untouched', () => {
    const entries = [meal({ date: '2026-01-01' }), meal({ date: '2026-01-02' })];
    const result = onDate(entries, '2026-01-01');
    expect(result).toHaveLength(1);
    expect(entries).toHaveLength(2);
  });
});

describe('awardPoints', () => {
  it('awards a rule once per day', () => {
    const state = defaultState('Test');
    const once = awardPoints(state, 'rule-meal', 'Logged a meal', 2);
    const twice = awardPoints({ ...state, points: once }, 'rule-meal', 'Logged a meal', 2);
    expect(once.earned).toBe(state.points.earned + 2);
    expect(twice.earned).toBe(once.earned);
    expect(twice.log.filter((entry) => entry.label === 'Logged a meal')).toHaveLength(1);
  });

  it('awards a different rule on the same day', () => {
    const state = defaultState('Test');
    const afterMeal = awardPoints(state, 'rule-meal', 'Logged a meal', 2);
    const afterMove = awardPoints({ ...state, points: afterMeal }, 'rule-move', 'Moved your way', 2);
    expect(afterMove.earned).toBe(state.points.earned + 4);
  });

  it('never lets a rule exceed its daily cap', () => {
    let state = defaultState('Test');
    for (let index = 0; index < 25; index += 1) {
      state = { ...state, points: awardPoints(state, 'rule-move', 'Moved your way', 2) };
    }
    expect(state.points.log.filter((entry) => entry.label === 'Moved your way')).toHaveLength(1);
  });
});

describe('defaultState', () => {
  it('starts with a clean, honest sample', () => {
    const state = defaultState('Sam');
    expect(state.name).toBe('Sam');
    expect(state.meals).toEqual([]);
    expect(state.activities).toEqual([]);
    expect(state.badges).toEqual([]);
    expect(state.preferences.shareWithCircle).toBe(false);
    expect(state.preferences.productAnalytics).toBe(false);
  });

  it('seeds three demo glasses of water for today', () => {
    expect(defaultState('Sam').water[dayKey(0)]).toBe(3);
  });
});

describe('uid', () => {
  it('produces unique ids with the given prefix', () => {
    const ids = new Set(Array.from({ length: 500 }, () => uid('meal')));
    expect(ids.size).toBe(500);
    expect([...ids][0]?.startsWith('meal-')).toBe(true);
  });
});
