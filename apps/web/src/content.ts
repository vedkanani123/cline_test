/**
 * Sample content for the Nurture demo.
 *
 * Everything here is illustrative. Nutrition figures are plausible examples,
 * not verified data, and exercise cues are general rather than personalized
 * instruction. The real product will replace this file with a reviewed content
 * service and a licensed food database.
 */

export type FoodItem = {
  id: string;
  name: string;
  serving: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  tags: string[];
};

export const FOOD_CATALOG: FoodItem[] = [
  { id: 'oats-milk', name: 'Oats with milk', serving: '1 bowl', kcal: 285, protein: 12, carbs: 43, fat: 8, fiber: 6, tags: ['breakfast', 'vegetarian'] },
  { id: 'eggs-toast', name: 'Eggs on toast', serving: '2 eggs + 2 slices', kcal: 340, protein: 20, carbs: 30, fat: 16, fiber: 4, tags: ['breakfast'] },
  { id: 'greek-yogurt', name: 'Greek yogurt & berries', serving: '1 cup', kcal: 190, protein: 17, carbs: 20, fat: 4, fiber: 3, tags: ['breakfast', 'vegetarian'] },
  { id: 'dal-rice', name: 'Dal, rice & vegetables', serving: '1 plate', kcal: 520, protein: 19, carbs: 78, fat: 13, fiber: 11, tags: ['lunch', 'vegetarian', 'indian'] },
  { id: 'chicken-bowl', name: 'Chicken grain bowl', serving: '1 bowl', kcal: 610, protein: 42, carbs: 58, fat: 21, fiber: 9, tags: ['lunch', 'high-protein'] },
  { id: 'tofu-stirfry', name: 'Tofu & vegetable stir-fry', serving: '1 plate', kcal: 430, protein: 26, carbs: 34, fat: 20, fiber: 8, tags: ['dinner', 'vegan'] },
  { id: 'salmon-plate', name: 'Salmon, potatoes & greens', serving: '1 plate', kcal: 640, protein: 40, carbs: 45, fat: 30, fiber: 7, tags: ['dinner', 'omega-3'] },
  { id: 'apple-pb', name: 'Apple & peanut butter', serving: '1 apple + 1 tbsp', kcal: 200, protein: 6, carbs: 26, fat: 9, fiber: 5, tags: ['snack', 'vegan'] },
  { id: 'khichdi', name: 'Vegetable khichdi', serving: '1 bowl', kcal: 380, protein: 14, carbs: 60, fat: 9, fiber: 9, tags: ['dinner', 'indian', 'vegetarian'] },
  { id: 'idli-sambar', name: 'Idli with sambar', serving: '3 idli + 1 bowl', kcal: 310, protein: 11, carbs: 55, fat: 5, fiber: 6, tags: ['breakfast', 'indian', 'vegetarian'] },
  { id: 'paneer-roti', name: 'Paneer with roti & salad', serving: '1 plate', kcal: 560, protein: 28, carbs: 48, fat: 27, fiber: 8, tags: ['lunch', 'indian', 'vegetarian'] },
  { id: 'soup-bread', name: 'Vegetable soup & wholemeal bread', serving: '1 bowl + 2 slices', kcal: 260, protein: 10, carbs: 40, fat: 6, fiber: 7, tags: ['dinner', 'light'] },
];

export type Recipe = {
  id: string;
  title: string;
  minutes: number;
  servings: number;
  tags: string[];
  kcal: number;
  protein: number;
  fiber: number;
  ingredients: string[];
  steps: string[];
};

export const RECIPE_LIBRARY: Recipe[] = [
  {
    id: 'recipe-oats',
    title: 'Overnight oats that survive a busy morning',
    minutes: 5,
    servings: 1,
    tags: ['breakfast', 'no-cook', 'budget'],
    kcal: 320,
    protein: 14,
    fiber: 7,
    ingredients: ['40g rolled oats', '150ml milk or soy milk', '1 tbsp yogurt', '1 tsp chia', 'Fruit of your choice'],
    steps: [
      'Stir the oats, milk, yogurt and chia in a jar.',
      'Leave in the fridge overnight — no cooking needed.',
      'Top with fruit in the morning and eat cold.',
    ],
  },
  {
    id: 'recipe-dal',
    title: 'Everyday dal with a quick tempering',
    minutes: 30,
    servings: 4,
    tags: ['dinner', 'indian', 'vegetarian', 'budget'],
    kcal: 240,
    protein: 13,
    fiber: 9,
    ingredients: ['1 cup lentils', '1 onion', '2 tomatoes', '1 tsp cumin', '1 tsp turmeric', 'Ghee or oil', 'Salt'],
    steps: [
      'Rinse the lentils and simmer with turmeric until soft.',
      'Fry cumin in ghee, add onion, then tomato.',
      'Stir the tempering through the lentils and season.',
    ],
  },
  {
    id: 'recipe-bowl',
    title: 'Any-grain bowl with a protein and a sauce',
    minutes: 20,
    servings: 2,
    tags: ['lunch', 'flexible', 'high-protein'],
    kcal: 520,
    protein: 32,
    fiber: 10,
    ingredients: ['Cooked grains', 'A protein (eggs, tofu, chicken, beans)', 'Roasted or raw vegetables', 'A sauce you like'],
    steps: [
      'Warm the grains and the protein.',
      'Pile vegetables on top.',
      'Add sauce at the end so nothing goes soggy.',
    ],
  },
  {
    id: 'recipe-soup',
    title: 'Fridge-clearing vegetable soup',
    minutes: 25,
    servings: 4,
    tags: ['dinner', 'light', 'budget', 'vegan'],
    kcal: 160,
    protein: 7,
    fiber: 8,
    ingredients: ['Any vegetables', '1 onion', 'Stock or water', 'Beans or lentils', 'Herbs'],
    steps: [
      'Soften the onion, then add everything else.',
      'Simmer until the vegetables are tender.',
      'Blend half if you want it thicker.',
    ],
  },
  {
    id: 'recipe-breakfast-toast',
    title: 'Five-minute savoury toast',
    minutes: 5,
    servings: 1,
    tags: ['breakfast', 'quick', 'vegetarian'],
    kcal: 300,
    protein: 16,
    fiber: 5,
    ingredients: ['2 slices wholemeal bread', '2 eggs or mashed beans', 'Greens or tomato', 'Chilli or pepper'],
    steps: ['Toast the bread.', 'Cook the eggs or warm the beans.', 'Pile on the greens and season.'],
  },
  {
    id: 'recipe-snack',
    title: 'A snack that actually holds you',
    minutes: 2,
    servings: 1,
    tags: ['snack', 'portable', 'vegetarian'],
    kcal: 210,
    protein: 9,
    fiber: 5,
    ingredients: ['Fruit', 'A handful of nuts or a spoon of nut butter', 'Optional yogurt'],
    steps: ['Combine.', 'Keep it somewhere you will actually see it.'],
  },
];

export type Exercise = {
  id: string;
  name: string;
  group: 'legs' | 'push' | 'pull' | 'core' | 'full-body' | 'mobility';
  equipment: 'none' | 'dumbbell' | 'band' | 'bar' | 'machine';
  cues: string[];
  easier: string;
  harder: string;
};

export const EXERCISE_LIBRARY: Exercise[] = [
  { id: 'ex-squat', name: 'Bodyweight squat', group: 'legs', equipment: 'none', cues: ['Feet about hip width', 'Sit back and down', 'Knees track over toes'], easier: 'Sit down to a chair and stand up', harder: 'Hold a weight at your chest' },
  { id: 'ex-incline-pushup', name: 'Incline push-up', group: 'push', equipment: 'none', cues: ['Hands on a stable surface', 'Body in one line', 'Lower with control'], easier: 'Use a higher surface', harder: 'Move hands to the floor' },
  { id: 'ex-row', name: 'Dumbbell row', group: 'pull', equipment: 'dumbbell', cues: ['Flat back', 'Pull toward the hip', 'Lower slowly'], easier: 'Use a lighter weight or a band', harder: 'Pause at the top for one second' },
  { id: 'ex-hinge', name: 'Hip hinge', group: 'legs', equipment: 'none', cues: ['Push hips back', 'Keep the spine long', 'Stand by squeezing glutes'], easier: 'Hands on a wall for balance', harder: 'Hold a weight at your chest' },
  { id: 'ex-deadbug', name: 'Dead bug', group: 'core', equipment: 'none', cues: ['Ribs down', 'Move slowly', 'Breathe out as you extend'], easier: 'Move only the legs', harder: 'Extend both arm and leg' },
  { id: 'ex-plank', name: 'Forearm plank', group: 'core', equipment: 'none', cues: ['Elbows under shoulders', 'Squeeze glutes', 'Stop before your back sags'], easier: 'Do it on your knees', harder: 'Add slow shoulder taps' },
  { id: 'ex-band-pull', name: 'Band pull-apart', group: 'pull', equipment: 'band', cues: ['Arms long', 'Pull the band apart', 'Keep shoulders down'], easier: 'Use a lighter band', harder: 'Slow the return' },
  { id: 'ex-stepup', name: 'Step-up', group: 'legs', equipment: 'none', cues: ['Use a stable step', 'Whole foot on the step', 'Stand tall at the top'], easier: 'Use a lower step', harder: 'Hold weights' },
  { id: 'ex-overhead', name: 'Overhead press', group: 'push', equipment: 'dumbbell', cues: ['Ribs stacked over hips', 'Press up and slightly back', 'Do not arch the lower back'], easier: 'Seated with light weights', harder: 'Pause overhead' },
  { id: 'ex-bridge', name: 'Glute bridge', group: 'legs', equipment: 'none', cues: ['Heels close to hips', 'Lift the hips, not the ribs', 'Lower slowly'], easier: 'Smaller range', harder: 'Single leg' },
];

export type Routine = {
  id: string;
  name: string;
  focus: string;
  minutes: number;
  exercises: { name: string; sets: number; reps: string }[];
};

export const ROUTINES: Routine[] = [
  {
    id: 'routine-full-body',
    name: 'Full-body strength',
    focus: 'A repeatable whole-body session',
    minutes: 18,
    exercises: [
      { name: 'Bodyweight squat', sets: 3, reps: 'choose comfortable reps' },
      { name: 'Incline push-up', sets: 3, reps: 'choose comfortable reps' },
      { name: 'Dumbbell row', sets: 3, reps: 'choose comfortable reps' },
    ],
  },
  {
    id: 'routine-core',
    name: 'Ten-minute core',
    focus: 'For days when only a short session fits',
    minutes: 10,
    exercises: [
      { name: 'Dead bug', sets: 3, reps: '6 each side' },
      { name: 'Forearm plank', sets: 3, reps: '20–30 seconds' },
      { name: 'Glute bridge', sets: 3, reps: '10 slow reps' },
    ],
  },
];

export type YogaFlow = { id: string; name: string; minutes: number; focus: string; poses: string[] };

export const YOGA_FLOWS: YogaFlow[] = [
  { id: 'yoga-desk', name: 'Desk-day reset', minutes: 8, focus: 'Neck, shoulders and upper back', poses: ['Seated side bend', 'Cat–cow', 'Thread the needle', 'Chest opener'] },
  { id: 'yoga-hips', name: 'Hips and lower back', minutes: 15, focus: 'After a lot of sitting', poses: ['Figure four', 'Low lunge', 'Butterfly', 'Supine twist'] },
  { id: 'yoga-wind', name: 'Wind-down before bed', minutes: 10, focus: 'Slow breathing and calm', poses: ['Child’s pose', 'Legs up the wall', 'Box breathing', 'Body scan'] },
  { id: 'yoga-morning', name: 'Morning mobility', minutes: 6, focus: 'Waking the whole body up', poses: ['Standing roll-down', 'Shoulder circles', 'Hip circles', 'Reach and breathe'] },
];

export type CardioIdea = { id: string; name: string; minutes: number; kind: 'walk' | 'run' | 'ride' | 'swim'; note: string };

export const CARDIO_IDEAS: CardioIdea[] = [
  { id: 'cardio-easy-walk', name: 'Easy walk', minutes: 20, kind: 'walk', note: 'Conversational pace. Any weather, any shoes.' },
  { id: 'cardio-two-miler', name: 'Two-mile steady', minutes: 24, kind: 'run', note: 'Run or run–walk. Slow is fine.' },
  { id: 'cardio-commute-ride', name: 'Commute ride', minutes: 30, kind: 'ride', note: 'Count the trip you were making anyway.' },
  { id: 'cardio-intervals', name: 'Gentle intervals', minutes: 18, kind: 'run', note: 'One minute quicker, two minutes easy, repeat.' },
];

export type HabitDef = { id: string; label: string; hint: string };

export const HABIT_DEFS: HabitDef[] = [
  { id: 'habit-water', label: 'Drink water with meals', hint: 'One glass, three times a day.' },
  { id: 'habit-walk', label: 'Move for ten minutes', hint: 'Any movement counts, including a slow walk.' },
  { id: 'habit-screens', label: 'Screens down before bed', hint: 'Aim for a wind-down, not a rule.' },
  { id: 'habit-veg', label: 'Add a vegetable or fruit', hint: 'Once is enough to count.' },
  { id: 'habit-breath', label: 'Two minutes of quiet', hint: 'Breathing, stretching or just sitting still.' },
];

export type Moment = { id: string; time: string; title: string; detail: string; kind: 'food' | 'move' | 'rest' | 'care' };

export const MOMENTS: Moment[] = [
  { id: 'moment-breakfast', time: '08:30', title: 'A breakfast that lasts', detail: 'Yogurt, fruit & oats', kind: 'food' },
  { id: 'moment-move', time: '12:30', title: 'A little movement', detail: '20-minute easy walk', kind: 'move' },
  { id: 'moment-lunch', time: '13:15', title: 'Lunch pause', detail: 'A balanced meal you enjoy', kind: 'food' },
  { id: 'moment-winddown', time: '21:30', title: 'Wind down', detail: 'A little less screen time', kind: 'rest' },
];

export type Challenge = { id: string; name: string; description: string; length: string; shape: string };

export const CHALLENGES: Challenge[] = [
  { id: 'ch-walk', name: 'Thirty days of showing up', description: 'Any movement, any length, counted once a day.', length: '30 days', shape: 'Shared progress, individual detail stays private' },
  { id: 'ch-veg', name: 'One vegetable a day', description: 'Add one vegetable or fruit to a meal you already eat.', length: '14 days', shape: 'Group tally only' },
  { id: 'ch-sleep', name: 'Wind-down together', description: 'A shared commitment to starting the evening earlier.', length: '21 days', shape: 'No sleep scores shared' },
  { id: 'ch-water', name: 'Water with every meal', description: 'A glass alongside food, not instead of it.', length: '14 days', shape: 'Simple check marks' },
];

export type Creator = { id: string; name: string; discipline: string; program: string; sessions: string; price: string; share: string; note: string };

export const CREATORS: Creator[] = [
  { id: 'cr-1', name: 'Maya R.', discipline: 'Strength coach', program: 'First twelve weeks of lifting', sessions: '3 sessions a week · 30 min', price: 'Included with membership', share: '60% of program revenue', note: 'Beginner-friendly, home or gym equipment.' },
  { id: 'cr-2', name: 'Dev P.', discipline: 'Physiotherapist', program: 'Desk-day back and shoulders', sessions: 'Daily · 8 min', price: 'Included with membership', share: '60% of program revenue', note: 'General mobility, not a treatment plan.' },
  { id: 'cr-3', name: 'Aisha K.', discipline: 'Cook and dietitian', program: 'Everyday cooking in a small kitchen', sessions: '12 recipes · 20 min each', price: 'Included with membership', share: '55% of program revenue', note: 'Budget-first, mostly one-pan.' },
  { id: 'cr-4', name: 'Tom L.', discipline: 'Running coach', program: 'From walking to your first 5K', sessions: '3 runs a week · 9 weeks', price: 'Included with membership', share: '60% of program revenue', note: 'Run–walk intervals from the first session.' },
];

export type Badge = { id: string; name: string; cost: number; description: string };

export const BADGES: Badge[] = [
  { id: 'badge-first', name: 'First step', cost: 4, description: 'A small marker for beginning in your own way.' },
  { id: 'badge-steady', name: 'Steady heart', cost: 8, description: 'A reminder that showing up can look different each day.' },
  { id: 'badge-grow', name: 'Room to grow', cost: 12, description: 'For making space to learn and adjust.' },
  { id: 'badge-rest', name: 'Rest is progress', cost: 10, description: 'For choosing recovery on purpose.' },
];

export type PointRule = { id: string; label: string; detail: string; value: number; cap: string };

export const POINT_RULES: PointRule[] = [
  { id: 'rule-checkin', label: 'Check in with yourself', detail: 'Any honest answer counts, including a hard one.', value: 2, cap: 'Once a day' },
  { id: 'rule-meal', label: 'Log a meal', detail: 'Detail is optional. Logging one meal is enough.', value: 2, cap: 'Once a day' },
  { id: 'rule-move', label: 'Move your way', detail: 'Any duration, including a short walk or a stretch.', value: 2, cap: 'Once a day' },
  { id: 'rule-rest', label: 'Notice your rest', detail: 'No sleep target. Recording rest is enough.', value: 2, cap: 'Once a day' },
  { id: 'rule-moment', label: 'Complete a chosen moment', detail: 'Only moments you picked yourself.', value: 1, cap: 'First two each day' },
  { id: 'rule-water', label: 'Reach your own water goal', detail: 'No bonus for drinking more than your goal.', value: 2, cap: 'Once a day' },
];

export type DeviceDef = { id: string; name: string; type: 'watch' | 'ring' | 'band' | 'scale' | 'phone'; note: string };

export const DEVICES: DeviceDef[] = [
  { id: 'dev-watch', name: 'Smart watch', type: 'watch', note: 'Activity, heart rate and sleep, if you grant it.' },
  { id: 'dev-ring', name: 'Sleep ring', type: 'ring', note: 'Sleep stages, temperature and resting heart rate.' },
  { id: 'dev-band', name: 'Fitness band', type: 'band', note: 'Steps, workouts and basic sleep.' },
  { id: 'dev-scale', name: 'Smart scale', type: 'scale', note: 'Weight and body composition, if you want it tracked.' },
  { id: 'dev-phone', name: 'This phone', type: 'phone', note: 'Steps and workouts from the device you are holding.' },
];

export type AppDef = { id: string; name: string; note: string };

export const APPS: AppDef[] = [
  { id: 'app-apple', name: 'Apple Health', note: 'Read and write steps, workouts, sleep, hydration and nutrition.' },
  { id: 'app-healthconnect', name: 'Android Health Connect', note: 'The Android hub for exchanging health data between apps.' },
  { id: 'app-google', name: 'Google Health', note: 'Google’s newer health app and API surface.' },
  { id: 'app-samsung', name: 'Samsung Health', note: 'Everyday tracking on Galaxy devices.' },
  { id: 'app-garmin', name: 'Garmin Connect', note: 'Sport and training metrics from Garmin hardware.' },
  { id: 'app-strava', name: 'Strava', note: 'Outdoor activities, routes and community.' },
  { id: 'app-oura', name: 'Oura', note: 'Sleep, temperature and readiness data.' },
  { id: 'app-whoop', name: 'WHOOP', note: 'Strain, recovery and sleep data.' },
];

export const SAFETY_NOTES = {
  scope:
    'Nurture is an adult wellness coach. It helps you organise food, movement and rest. It does not diagnose, treat or cure any condition.',
  escalation:
    'If something suggests a medical problem — unexplained weight change, chest pain, fainting, an eating-disorder history, pregnancy, or a prescribed diet — Nurture should point you to a qualified clinician or registered dietitian instead of guessing.',
  photo:
    'A photo cannot reveal cooking oil, sauces, hidden ingredients or exact portion mass. Treat every photo estimate as a draft you can edit.',
  device:
    'Step counts, calorie estimates and readiness scores are trends, not measurements. Devices differ by sensor, algorithm and region, and not every field syncs both ways.',
  finance:
    'Demo points, badges and creator revenue shares shown here are illustrative. They carry no cash value and are not an offer of payment.',
} as const;
