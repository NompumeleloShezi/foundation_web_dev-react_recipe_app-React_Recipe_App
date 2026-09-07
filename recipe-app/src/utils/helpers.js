// helpers.js
// Small pure functions shared across components.

/**
 * Combine prep + cook time into a friendly display string, e.g. "40 min".
 */
export function formatCookTime(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hrs} hr` : `${hrs} hr ${mins} min`;
}

/**
 * Return a small emoji indicator for a difficulty level.
 * Used as an example of a function called inside JSX.
 */
export function difficultyIcon(difficulty) {
  switch (difficulty) {
    case "easy":
      return "🟢";
    case "medium":
      return "🟡";
    case "hard":
      return "🔴";
    default:
      return "⚪";
  }
}

/**
 * Filter a list of recipes by search term, category, cuisine and difficulty.
 * Any filter left as "all"/"" is ignored.
 */
export function filterRecipes(recipes, { search = "", category = "all", cuisine = "all", difficulty = "all" }) {
  const term = search.trim().toLowerCase();
  return recipes.filter((recipe) => {
    const matchesSearch = term === "" || recipe.title.toLowerCase().includes(term);
    const matchesCategory = category === "all" || recipe.category === category;
    const matchesCuisine = cuisine === "all" || recipe.cuisine === cuisine;
    const matchesDifficulty = difficulty === "all" || recipe.difficulty === difficulty;
    return matchesSearch && matchesCategory && matchesCuisine && matchesDifficulty;
  });
}

/** Build the default empty meal plan structure for the seven days of the week. */
export function buildEmptyMealPlan() {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const plan = {};
  days.forEach((day) => {
    plan[day] = { breakfast: null, lunch: null, dinner: null };
  });
  return plan;
}

export const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const MEAL_SLOTS = ["breakfast", "lunch", "dinner"];

/** Read a JSON value from localStorage, falling back gracefully. */
export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`Could not read "${key}" from localStorage`, err);
    return fallback;
  }
}

/** Write a JSON value to localStorage, failing silently if unavailable. */
export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Could not write "${key}" to localStorage`, err);
  }
}

export function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/** Sort a recipe array by the given key without mutating the input. */
export function sortRecipes(recipes, sortBy) {
  const list = [...recipes];
  const difficultyRank = { easy: 0, medium: 1, hard: 2 };

  switch (sortBy) {
    case "title-az":
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case "time-asc":
      return list.sort((a, b) => a.prepTime + a.cookTime - (b.prepTime + b.cookTime));
    case "difficulty":
      return list.sort((a, b) => difficultyRank[a.difficulty] - difficultyRank[b.difficulty]);
    default:
      return list;
  }
}

/**
 * Aggregate every ingredient line across all planned meals in a week into
 * a flat, de-duplicated, alphabetized shopping list. Recipes that repeat
 * an identical ingredient line have it merged with a note of how many
 * recipes call for it, rather than being listed twice.
 */
export function buildShoppingList(mealPlan) {
  const counts = new Map();

  Object.values(mealPlan).forEach((dayMeals) => {
    Object.values(dayMeals).forEach((recipe) => {
      if (!recipe || !Array.isArray(recipe.ingredients)) return;
      recipe.ingredients.forEach((line) => {
        const key = line.trim().toLowerCase();
        if (!counts.has(key)) {
          counts.set(key, { label: line, count: 0, recipes: new Set() });
        }
        const entry = counts.get(key);
        entry.count += 1;
        entry.recipes.add(recipe.title);
      });
    });
  });

  return Array.from(counts.values())
    .map((entry) => ({
      label: entry.label,
      count: entry.count,
      recipes: Array.from(entry.recipes),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
