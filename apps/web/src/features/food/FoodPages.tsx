import { useMemo, useState } from 'react';
import { Chip, DayStrip, EmptyState, Field, Meter, Muted, Note, PageHeader, Panel, Row, Stat, StatGrid } from '../../components/ui';
import { Link } from '../../router';
import { useToast } from '../../app/toast';
import { WaterDrops } from '../../components/WaterDrops';
import { FOOD_CATALOG, RECIPE_LIBRARY, SAFETY_NOTES } from '../../content';
import { awardPoints, formatKey, lastNDays, mealTotals, MEAL_SLOTS, onDate, round, uid, useDemo } from '../../app/demo';
import type { GroceryItem, MealEntry, MealSlot, PhotoReview } from '../../app/demo';

/** A photo review is simulated locally: no model, no upload, no server call. */
type Confidence = 'low' | 'medium' | 'high';
type DraftItem = { name: string; kcal: number; protein: number; carbs: number; fat: number; fiber: number };

const CONFIDENCE_TONE: Record<Confidence, 'good' | 'warn' | 'info'> = { low: 'warn', medium: 'info', high: 'good' };
const PHOTO_SAMPLES: { label: string; confidence: Confidence; items: DraftItem[] }[] = [
  {
    label: 'Plate on a table', confidence: 'medium',
    items: [
      { name: 'Chicken (estimated)', kcal: 220, protein: 34, carbs: 0, fat: 8, fiber: 0 },
      { name: 'Rice (estimated)', kcal: 210, protein: 4, carbs: 45, fat: 1, fiber: 1 },
      { name: 'Salad (estimated)', kcal: 60, protein: 2, carbs: 8, fat: 3, fiber: 3 },
    ],
  },
  {
    label: 'Bowl with garnish', confidence: 'low',
    items: [
      { name: 'Noodles (estimated)', kcal: 310, protein: 9, carbs: 58, fat: 6, fiber: 3 },
      { name: 'Vegetables (estimated)', kcal: 90, protein: 3, carbs: 14, fat: 2, fiber: 5 },
    ],
  },
];

function SlotPicker({ value, onChange }: { value: MealSlot; onChange: (slot: MealSlot) => void }) {
  return (
    <div className="segmented">
      {MEAL_SLOTS.map((option) => (
        <button key={option} type="button" className={option === value ? 'is-active' : ''} onClick={() => onChange(option)}>{option}</button>
      ))}
    </div>
  );
}

export function FoodDiary() {
  const { state, update, today } = useDemo();
  const { toast } = useToast();
  const [slot, setSlot] = useState<MealSlot>('breakfast');
  const [foodId, setFoodId] = useState(FOOD_CATALOG[0].id);
  const [servings, setServings] = useState(1);
  const food = FOOD_CATALOG.find((item) => item.id === foodId) ?? FOOD_CATALOG[0];
  const todayMeals = onDate(state.meals, today);
  const totals = mealTotals(todayMeals);
  const addMeal = () => {
    const entry: MealEntry = {
      id: uid('meal'), date: today, slot, name: food.name, servings,
      kcal: Math.round(food.kcal * servings), protein: round(food.protein * servings),
      carbs: round(food.carbs * servings), fat: round(food.fat * servings), fiber: round(food.fiber * servings), source: 'catalog',
    };
    const firstOfDay = todayMeals.length === 0;
    update((prev) => ({ meals: [entry, ...prev.meals], points: firstOfDay ? awardPoints(prev, 'rule-meal', 'Logged a meal', 2) : prev.points }));
    toast(`${servings} × ${food.name} added to ${slot}.`);
  };
  const removeMeal = (id: string) => {
    update((prev) => ({ meals: prev.meals.filter((meal) => meal.id !== id) }));
    toast('Entry removed.', 'info');
  };
  return (
    <div className="page">
      <PageHeader kicker="Food / Daily record" title="Food diary" blurb="Log meals from a small sample catalog. Adjust servings before saving — catalog figures are fictional examples." actions={<Link className="button button--ghost button--small" to="/app/food/scan">Review a photo</Link>} />
      <Panel title="Add a meal" subtitle="Pick a food, choose a slot and set servings.">
        <Field label="Food">
          <select value={foodId} onChange={(event) => setFoodId(event.target.value)}>
            {FOOD_CATALOG.map((item) => (<option key={item.id} value={item.id}>{item.name} · {item.serving}</option>))}
          </select>
        </Field>
        <div className="stack stack--tight"><span className="kicker">Meal</span><SlotPicker value={slot} onChange={setSlot} /></div>
        <div className="stack stack--tight"><span className="kicker">Servings</span>
          <Row>
            <button type="button" className="icon-button" aria-label="One fewer serving" onClick={() => setServings((value) => Math.max(1, value - 1))}>−</button>
            <strong>{servings}</strong>
            <button type="button" className="icon-button" aria-label="One more serving" onClick={() => setServings((value) => Math.min(20, value + 1))}>+</button>
          </Row>
        </div>
        <Muted>This will save {Math.round(food.kcal * servings)} kcal · {round(food.protein * servings)}g protein · {round(food.carbs * servings)}g carbs · {round(food.fat * servings)}g fat · {round(food.fiber * servings)}g fiber.</Muted>
        <Row><button type="button" className="button" onClick={addMeal}>Add to today’s diary</button></Row>
        <Note tone="quiet">Edit servings before saving. Catalog nutrition values are illustrative examples, not a dietary assessment.</Note>
      </Panel>
      <Panel title="Recorded today" subtitle={todayMeals.length === 0 ? 'Nothing logged yet' : `${todayMeals.length} entr${todayMeals.length === 1 ? 'y' : 'ies'}`}>
        <StatGrid>
          <Stat label="Energy" value={totals.kcal} unit="kcal" hint="From your own entries" />
          <Stat label="Protein" value={round(totals.protein)} unit="g" />
          <Stat label="Carbs" value={round(totals.carbs)} unit="g" />
          <Stat label="Fat" value={round(totals.fat)} unit="g" />
          <Stat label="Fiber" value={round(totals.fiber)} unit="g" />
        </StatGrid>
        {todayMeals.length === 0 ? (
          <EmptyState title="No meals recorded today" body="Add a meal above, or review a photo to build an editable estimate." />
        ) : (
          MEAL_SLOTS.map((slotKey) => {
            const items = todayMeals.filter((meal) => meal.slot === slotKey);
            if (items.length === 0) return null;
            return (
              <div key={slotKey} className="stack stack--tight">
                <span className="kicker">{slotKey}</span>
                <ul className="list">
                  {items.map((meal) => (
                    <li key={meal.id} className="list__item">
                      <span className="list__main">
                        <span className="list__title">{meal.name}</span>
                        <span className="list__meta">{meal.servings} serving{meal.servings === 1 ? '' : 's'} · {meal.kcal} kcal · {round(meal.protein)}g protein · source: {meal.source}</span>
                      </span>
                      <button type="button" className="icon-button" aria-label={`Remove ${meal.name}`} onClick={() => removeMeal(meal.id)}>×</button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })
        )}
      </Panel>
      <Note tone="quiet">Nutrition figures here are illustrative examples, not a measurement or a dietary assessment.</Note>
    </div>
  );
}

export function FoodScan() {
  const { state, update, today } = useDemo();
  const { toast } = useToast();
  const [label, setLabel] = useState('');
  const [confidence, setConfidence] = useState<Confidence>('medium');
  const [items, setItems] = useState<DraftItem[]>([]);
  const [slot, setSlot] = useState<MealSlot>('lunch');
  const analyse = (nextLabel: string, sample: (typeof PHOTO_SAMPLES)[number]) => {
    setLabel(nextLabel);
    setConfidence(sample.confidence);
    setItems(sample.items.map((item) => ({ ...item })));
  };
  const useSample = () => { analyse('Sample photo', PHOTO_SAMPLES[0]); toast('Sample analysed. Every figure is an editable estimate.', 'info'); };
  const onFile = (file: File | null) => { if (!file) return; analyse(file.name, PHOTO_SAMPLES[1]); toast('Photo reviewed in this browser only — no upload and no real AI.', 'info'); };
  const updateItem = (index: number, patch: Partial<DraftItem>) => setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  const addToDiary = () => {
    if (items.length === 0) return;
    const entries: MealEntry[] = items.map((item) => ({
      id: uid('meal'), date: today, slot, name: item.name, servings: 1,
      kcal: Math.round(item.kcal), protein: round(item.protein), carbs: round(item.carbs), fat: round(item.fat), fiber: round(item.fiber), source: 'photo',
    }));
    const review: PhotoReview = { id: uid('photo'), date: today, label: label || 'Photo', confidence, items: items.map((item) => ({ ...item })), saved: true };
    update((prev) => ({ meals: [...entries, ...prev.meals], photoReviews: [review, ...prev.photoReviews], points: awardPoints(prev, 'rule-meal', 'Logged a meal', 2) }));
    setItems([]); setLabel('');
    toast(`${entries.length} photo estimate${entries.length === 1 ? '' : 's'} added to your diary.`);
  };
  const discard = () => {
    if (items.length === 0) return;
    const review: PhotoReview = { id: uid('photo'), date: today, label: label || 'Photo', confidence, items: items.map((item) => ({ ...item })), saved: false };
    update((prev) => ({ photoReviews: [review, ...prev.photoReviews] }));
    setItems([]); setLabel('');
    toast('Review discarded. Nothing was added to your diary.', 'info');
  };
  return (
    <div className="page">
      <PageHeader kicker="Food / Photo review" title="Review a meal photo" blurb="A simulated analysis. Everything below is an editable estimate you can correct before saving." actions={<Link className="button button--ghost button--small" to="/app/food/diary">Open food diary</Link>} />
      <Panel title="Add a photo" subtitle="Pick a file, or use a sample so you can try the flow.">
        <div className="grid-2">
          <Field label="Photo" hint="Stays on your device. Nothing is uploaded.">
            <input type="file" accept="image/*" onChange={(event) => onFile(event.target.files?.[0] ?? null)} />
          </Field>
          <div className="stack stack--tight"><span className="kicker">No photo handy?</span><button type="button" className="button button--ghost" onClick={useSample}>Use a sample photo</button></div>
        </div>
        <Note tone="warn">{SAFETY_NOTES.photo}</Note>
      </Panel>
      {items.length > 0 ? (
        <Panel title="Detected items (editable estimate)" subtitle={`Simulated analysis of “${label || 'your photo'}”`} actions={<Chip tone={CONFIDENCE_TONE[confidence]}>{confidence} confidence</Chip>}>
          <div className="stack stack--tight"><span className="kicker">Add to meal</span><SlotPicker value={slot} onChange={setSlot} /></div>
          {items.map((item, index) => (
            <div key={index} className="stack stack--tight">
              <Field label={`Item ${index + 1}`}><input type="text" value={item.name} onChange={(event) => updateItem(index, { name: event.target.value })} /></Field>
              <div className="grid-3">
                <Field label="kcal"><input type="number" min={0} value={item.kcal} onChange={(event) => updateItem(index, { kcal: Math.max(0, Number(event.target.value) || 0) })} /></Field>
                <Field label="Protein (g)"><input type="number" min={0} value={item.protein} onChange={(event) => updateItem(index, { protein: Math.max(0, Number(event.target.value) || 0) })} /></Field>
                <Field label="Carbs (g)"><input type="number" min={0} value={item.carbs} onChange={(event) => updateItem(index, { carbs: Math.max(0, Number(event.target.value) || 0) })} /></Field>
                <Field label="Fat (g)"><input type="number" min={0} value={item.fat} onChange={(event) => updateItem(index, { fat: Math.max(0, Number(event.target.value) || 0) })} /></Field>
                <Field label="Fiber (g)"><input type="number" min={0} value={item.fiber} onChange={(event) => updateItem(index, { fiber: Math.max(0, Number(event.target.value) || 0) })} /></Field>
              </div>
            </div>
          ))}
          <Note tone="quiet">Confidence is a rough signal only. A photo cannot reveal cooking oil, sauces, hidden ingredients or exact portion mass — treat this as a draft you can edit.</Note>
          <Row><button type="button" className="button" onClick={addToDiary}>Add to diary</button><button type="button" className="button button--ghost" onClick={discard}>Discard</button></Row>
        </Panel>
      ) : null}
      <Panel title="Recent photo reviews" subtitle="Every review you save or discard is recorded here.">
        {state.photoReviews.length === 0 ? (
          <EmptyState title="No photo reviews yet" body="Analyse a photo above and it will appear here." />
        ) : (
          <ul className="list">
            {state.photoReviews.map((review) => (
              <li key={review.id} className="list__item">
                <span className="list__main">
                  <span className="list__title">{review.label}</span>
                  <span className="list__meta">{review.items.length} item{review.items.length === 1 ? '' : 's'} · {review.confidence} confidence · {formatKey(review.date)}</span>
                </span>
                <Chip tone={review.saved ? 'good' : 'quiet'}>{review.saved ? 'added' : 'discarded'}</Chip>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <Note tone="quiet">This photo review is simulated in the browser. There is no AI model, no upload and no server call.</Note>
    </div>
  );
}

export function FoodRecipes() {
  const { state, update, today } = useDemo();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('all');
  const [day, setDay] = useState(today);
  const days = lastNDays(7);
  const tags = Array.from(new Set(RECIPE_LIBRARY.flatMap((recipe) => recipe.tags)));
  const needle = query.trim().toLowerCase();
  const filtered = RECIPE_LIBRARY.filter((recipe) => (tag === 'all' || recipe.tags.includes(tag)) && (needle === '' || recipe.title.toLowerCase().includes(needle)));
  const toggleSave = (id: string) => {
    const saved = state.savedRecipes.includes(id);
    update((prev) => ({ savedRecipes: saved ? prev.savedRecipes.filter((entry) => entry !== id) : [...prev.savedRecipes, id] }));
    toast(saved ? 'Recipe removed from saved.' : 'Recipe saved.', 'info');
  };
  const addIngredients = (recipe: (typeof RECIPE_LIBRARY)[number]) => {
    const additions: GroceryItem[] = recipe.ingredients.map((text) => ({ id: uid('groc'), text, done: false, from: recipe.title }));
    update((prev) => ({ groceries: [...prev.groceries, ...additions] }));
    toast(`${recipe.ingredients.length} ingredient${recipe.ingredients.length === 1 ? '' : 's'} added to groceries.`);
  };
  const addToPlan = (recipe: (typeof RECIPE_LIBRARY)[number]) => {
    if ((state.mealPlan[day] ?? []).includes(recipe.id)) { toast(`${recipe.title} is already on ${formatKey(day)}.`, 'info'); return; }
    update((prev) => ({ mealPlan: { ...prev.mealPlan, [day]: [...(prev.mealPlan[day] ?? []), recipe.id] } }));
    toast(`${recipe.title} added to ${formatKey(day)}.`);
  };
  return (
    <div className="page">
      <PageHeader kicker="Food / Recipes" title="Recipes" blurb="Everyday cooking that fits your time, taste and budget. Nutrition figures are illustrative examples." />
      <Panel title="Find a recipe">
        <Field label="Search" hint="Try “oats”, “dal” or “soup”."><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} /></Field>
        <div className="stack stack--tight"><span className="kicker">Tag</span>
          <div className="segmented">
            <button type="button" className={tag === 'all' ? 'is-active' : ''} onClick={() => setTag('all')}>all</button>
            {tags.map((option) => (<button key={option} type="button" className={tag === option ? 'is-active' : ''} onClick={() => setTag(option)}>{option}</button>))}
          </div>
        </div>
        <div className="stack stack--tight"><span className="kicker">Add to meal plan on</span><DayStrip days={days} active={day} onSelect={setDay} renderLabel={formatKey} /></div>
      </Panel>
      {filtered.length === 0 ? (
        <EmptyState title="No recipes match" body="Try a different tag or clear the search box." />
      ) : (
        <div className="recipe-grid">
          {filtered.map((recipe) => {
            const saved = state.savedRecipes.includes(recipe.id);
            const plannedForDay = (state.mealPlan[day] ?? []).includes(recipe.id);
            return (
              <article key={recipe.id} className="recipe">
                <h3 className="recipe__title">{recipe.title}</h3>
                <div className="recipe__meta">
                  <Chip tone="quiet">{recipe.minutes} min</Chip><Chip tone="quiet">{recipe.servings} serving{recipe.servings === 1 ? '' : 's'}</Chip>
                  <Chip tone="quiet">{recipe.kcal} kcal</Chip><Chip tone="quiet">{recipe.protein}g protein</Chip><Chip tone="quiet">{recipe.fiber}g fiber</Chip>
                </div>
                <div className="stack stack--tight"><span className="kicker">Ingredients</span>
                  <ul className="recipe__steps">{recipe.ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}</ul>
                </div>
                <div className="stack stack--tight"><span className="kicker">Steps</span>
                  <ol className="recipe__steps">{recipe.steps.map((step, index) => <li key={step}><span>{index + 1}.</span><span>{step}</span></li>)}</ol>
                </div>
                <Row>
                  <button type="button" className="button button--ghost button--small" aria-pressed={saved} onClick={() => toggleSave(recipe.id)}>{saved ? 'Saved ✓' : 'Save recipe'}</button>
                  <button type="button" className="button button--ghost button--small" onClick={() => addIngredients(recipe)}>Add ingredients to groceries</button>
                  <button type="button" className="button button--small" onClick={() => addToPlan(recipe)} disabled={plannedForDay}>{plannedForDay ? `Planned ${formatKey(day)}` : 'Add to meal plan'}</button>
                </Row>
              </article>
            );
          })}
        </div>
      )}
      <Note tone="quiet">Recipe nutrition values are illustrative examples and will vary with your ingredients and portions.</Note>
    </div>
  );
}

export function FoodMealPlanner() {
  const { state, update } = useDemo();
  const { toast } = useToast();
  const [choice, setChoice] = useState<Record<string, string>>({});
  const days = lastNDays(7);
  const recipeById = (id: string) => RECIPE_LIBRARY.find((recipe) => recipe.id === id);
  const savedFirst = [...RECIPE_LIBRARY].sort((a, b) => Number(state.savedRecipes.includes(b.id)) - Number(state.savedRecipes.includes(a.id)));
  const plannedTotal = days.reduce((total, day) => total + (state.mealPlan[day]?.length ?? 0), 0);
  const daysUsed = days.filter((day) => (state.mealPlan[day]?.length ?? 0) > 0).length;
  const addRecipe = (day: string) => {
    const id = choice[day];
    if (!id) return;
    const recipe = recipeById(id);
    if ((state.mealPlan[day] ?? []).includes(id)) { toast('That recipe is already planned for this day.', 'info'); return; }
    update((prev) => ({ mealPlan: { ...prev.mealPlan, [day]: [...(prev.mealPlan[day] ?? []), id] } }));
    toast(`${recipe ? recipe.title : 'Recipe'} added to ${formatKey(day)}.`);
  };
  const removeRecipe = (day: string, id: string) => update((prev) => ({ mealPlan: { ...prev.mealPlan, [day]: (prev.mealPlan[day] ?? []).filter((entry) => entry !== id) } }));
  const clearDay = (day: string) => {
    update((prev) => { const next = { ...prev.mealPlan }; delete next[day]; return { mealPlan: next }; });
    toast(`${formatKey(day)} cleared.`, 'info');
  };
  const buildGroceries = () => {
    const plannedIds = days.flatMap((day) => state.mealPlan[day] ?? []);
    if (plannedIds.length === 0) { toast('Plan at least one meal first.', 'warn'); return; }
    const seen = new Set(state.groceries.map((item) => item.text.trim().toLowerCase()));
    const additions: GroceryItem[] = [];
    for (const id of plannedIds) {
      const recipe = recipeById(id);
      if (!recipe) continue;
      for (const text of recipe.ingredients) {
        const key = text.trim().toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        additions.push({ id: uid('groc'), text, done: false, from: recipe.title });
      }
    }
    if (additions.length === 0) { toast('Every planned ingredient is already on your list.', 'info'); return; }
    update((prev) => ({ groceries: [...prev.groceries, ...additions] }));
    toast(`${additions.length} ingredient${additions.length === 1 ? '' : 's'} added from the plan.`);
  };
  return (
    <div className="page">
      <PageHeader kicker="Food / Meal planner" title="Meal planner" blurb="Plan a few days without planning your whole life. Saved recipes appear first." />
      <Panel title="This week">
        <StatGrid>
          <Stat label="Meals planned" value={plannedTotal} hint="Across the next seven days" />
          <Stat label="Days used" value={`${daysUsed}/7`} />
        </StatGrid>
        <Row><button type="button" className="button" onClick={buildGroceries} disabled={plannedTotal === 0}>Build groceries from the plan</button></Row>
        <Note tone="quiet">Ingredients are de-duplicated by text before they are added to your grocery list.</Note>
      </Panel>
      <div className="grid-2">
        {days.map((day) => {
          const ids = state.mealPlan[day] ?? [];
          return (
            <Panel key={day} title={formatKey(day)} subtitle={ids.length === 0 ? 'Nothing planned' : `${ids.length} meal${ids.length === 1 ? '' : 's'} planned`}>
              {ids.length > 0 ? (
                <ul className="list">
                  {ids.map((id) => {
                    const recipe = recipeById(id);
                    return (
                      <li key={id} className="list__item list__item--plain">
                        <span className="list__main">
                          <span className="list__title">{recipe ? recipe.title : 'Recipe'}</span>
                          {recipe ? <span className="list__meta">{recipe.minutes} min · {recipe.kcal} kcal</span> : null}
                        </span>
                        <button type="button" className="icon-button" aria-label="Remove from plan" onClick={() => removeRecipe(day, id)}>×</button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <Muted>No meals planned.</Muted>
              )}
              <Field label="Add a recipe" hint="Saved recipes are listed first.">
                <select value={choice[day] ?? ''} onChange={(event) => setChoice((prev) => ({ ...prev, [day]: event.target.value }))}>
                  <option value="">Choose a recipe…</option>
                  {savedFirst.map((recipe) => (<option key={recipe.id} value={recipe.id}>{state.savedRecipes.includes(recipe.id) ? '★ ' : ''}{recipe.title}</option>))}
                </select>
              </Field>
              <Row>
                <button type="button" className="button button--small" onClick={() => addRecipe(day)} disabled={!choice[day]}>Add</button>
                <button type="button" className="button button--ghost button--small" onClick={() => clearDay(day)} disabled={ids.length === 0}>Clear day</button>
              </Row>
            </Panel>
          );
        })}
      </div>
      <Note tone="quiet">Planned meals and the grocery list are stored only in this browser session.</Note>
    </div>
  );
}

export function FoodGroceries() {
  const { state, update } = useDemo();
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [from, setFrom] = useState('My list');
  const groups = useMemo(() => {
    const map = new Map<string, GroceryItem[]>();
    for (const item of state.groceries) {
      const list = map.get(item.from) ?? [];
      list.push(item);
      map.set(item.from, list);
    }
    return Array.from(map.entries());
  }, [state.groceries]);
  const done = state.groceries.filter((item) => item.done).length;
  const addItem = () => {
    const value = text.trim();
    if (!value) return;
    const source = from.trim() || 'My list';
    update((prev) => ({ groceries: [...prev.groceries, { id: uid('groc'), text: value, done: false, from: source }] }));
    setText('');
    toast(`Added “${value}”.`);
  };
  const toggle = (id: string) => update((prev) => ({ groceries: prev.groceries.map((item) => (item.id === id ? { ...item, done: !item.done } : item)) }));
  const remove = (id: string) => update((prev) => ({ groceries: prev.groceries.filter((item) => item.id !== id) }));
  const clearCompleted = () => { update((prev) => ({ groceries: prev.groceries.filter((item) => !item.done) })); toast('Completed items cleared.', 'info'); };
  return (
    <div className="page">
      <PageHeader kicker="Food / Groceries" title="Groceries" blurb="A list that builds itself from what you plan to cook." />
      <Panel title="Add an item">
        <div className="grid-2">
          <Field label="Item"><input type="text" value={text} placeholder="e.g. Oat milk" onChange={(event) => setText(event.target.value)} /></Field>
          <Field label="Group" hint="Defaults to “My list”."><input type="text" value={from} onChange={(event) => setFrom(event.target.value)} /></Field>
        </div>
        <Row><button type="button" className="button" onClick={addItem} disabled={!text.trim()}>Add to list</button></Row>
      </Panel>
      <Panel title="Your list" subtitle={`${done} of ${state.groceries.length} done`}>
        <Meter value={done} max={state.groceries.length} label="Grocery progress" />
        <Row className="row--between">
          <Muted>{state.groceries.length - done} item{state.groceries.length - done === 1 ? '' : 's'} left</Muted>
          <button type="button" className="button button--ghost button--small" onClick={clearCompleted} disabled={done === 0}>Clear completed</button>
        </Row>
        {state.groceries.length === 0 ? (
          <EmptyState title="Your list is empty" body="Add items above, or build a list from a recipe or your meal plan." />
        ) : (
          groups.map(([group, items]) => (
            <div key={group} className="stack stack--tight">
              <span className="kicker">{group}</span>
              <ul className="list">
                {items.map((item) => (
                  <li key={item.id} className="list__item">
                    <label className="check">
                      <input type="checkbox" checked={item.done} onChange={() => toggle(item.id)} />
                      <span className={item.done ? 'muted' : undefined}>{item.text}</span>
                    </label>
                    <button type="button" className="icon-button" aria-label={`Remove ${item.text}`} onClick={() => remove(item.id)}>×</button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </Panel>
    </div>
  );
}

export function FoodWater() {
  const { state, update, today } = useDemo();
  const [goal, setGoal] = useState(8);
  const glasses = state.water[today] ?? 0;
  const cap = Math.max(goal, glasses, 1);
  const addGlass = () => update((prev) => ({ water: { ...prev.water, [today]: (prev.water[today] ?? 0) + 1 } }));
  const removeGlass = () => update((prev) => ({ water: { ...prev.water, [today]: Math.max(0, (prev.water[today] ?? 0) - 1) } }));
  return (
    <div className="page">
      <PageHeader kicker="Food / Water" title="Water" blurb="Gentle hydration tracking, with no rigid universal target." />
      <Panel title="Today" subtitle="Glasses of water you have recorded today.">
        <WaterDrops value={glasses} max={cap} label={`${glasses} of ${goal} glasses`} />
        <StatGrid>
          <Stat label="Today" value={glasses} unit="glasses" />
          <Stat label="Goal (display cap)" value={goal} unit="glasses" hint="A level you choose — not a target" />
        </StatGrid>
        <Row>
          <button type="button" className="button" onClick={addGlass}>Add a glass</button>
          <button type="button" className="button button--ghost" onClick={removeGlass} disabled={glasses === 0}>Remove a glass</button>
        </Row>
      </Panel>
      <Panel title="Display cap" subtitle="A reference level for the dots above — not a target you have to hit.">
        <Field label="Glasses" hint="Change this any time. It only changes the display.">
          <input type="number" min={1} max={20} value={goal} onChange={(event) => setGoal(Math.min(20, Math.max(1, Number(event.target.value) || 1)))} />
        </Field>
      </Panel>
      <Note tone="quiet">Hydration needs vary by person, climate and activity, and there is no single universal target. This counter is a gentle record, not a rule.</Note>
    </div>
  );
}
