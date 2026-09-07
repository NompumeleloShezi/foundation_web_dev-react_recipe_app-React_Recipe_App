import { describe, it, expect, beforeEach } from "vitest";
import {
  formatCookTime,
  difficultyIcon,
  filterRecipes,
  sortRecipes,
  buildEmptyMealPlan,
  buildShoppingList,
  readStorage,
  writeStorage,
  capitalize,
} from "../helpers";

describe("formatCookTime", () => {
  it("formats minutes under an hour plainly", () => {
    expect(formatCookTime(25)).toBe("25 min");
  });

  it("formats exact hours without a minutes remainder", () => {
    expect(formatCookTime(60)).toBe("1 hr");
    expect(formatCookTime(120)).toBe("2 hr");
  });

  it("formats hours plus remaining minutes", () => {
    expect(formatCookTime(90)).toBe("1 hr 30 min");
    expect(formatCookTime(135)).toBe("2 hr 15 min");
  });
});

describe("difficultyIcon", () => {
  it("returns the correct icon for each known difficulty", () => {
    expect(difficultyIcon("easy")).toBe("🟢");
    expect(difficultyIcon("medium")).toBe("🟡");
    expect(difficultyIcon("hard")).toBe("🔴");
  });

  it("falls back to a neutral icon for unknown values", () => {
    expect(difficultyIcon("unknown")).toBe("⚪");
  });
});

describe("filterRecipes", () => {
  const recipes = [
    { id: 1, title: "Lemon Herb Roast Chicken", category: "dinner", cuisine: "American", difficulty: "medium" },
    { id: 2, title: "Mango Sticky Rice", category: "dessert", cuisine: "Thai", difficulty: "easy" },
    { id: 3, title: "Butter Chicken", category: "dinner", cuisine: "Indian", difficulty: "medium" },
  ];

  it("returns everything when no filters are applied", () => {
    expect(filterRecipes(recipes, {})).toHaveLength(3);
  });

  it("filters by case-insensitive search term", () => {
    const result = filterRecipes(recipes, { search: "chicken" });
    expect(result.map((r) => r.id)).toEqual([1, 3]);
  });

  it("filters by category", () => {
    const result = filterRecipes(recipes, { category: "dessert" });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it("filters by cuisine", () => {
    const result = filterRecipes(recipes, { cuisine: "Indian" });
    expect(result.map((r) => r.id)).toEqual([3]);
  });

  it("combines multiple filters with AND semantics", () => {
    const result = filterRecipes(recipes, { category: "dinner", difficulty: "medium", search: "butter" });
    expect(result.map((r) => r.id)).toEqual([3]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterRecipes(recipes, { search: "sushi" })).toHaveLength(0);
  });
});

describe("sortRecipes", () => {
  const recipes = [
    { title: "Zucchini Bread", prepTime: 10, cookTime: 50, difficulty: "medium" },
    { title: "Apple Pie", prepTime: 15, cookTime: 25, difficulty: "hard" },
    { title: "Toast", prepTime: 2, cookTime: 3, difficulty: "easy" },
  ];

  it("does not mutate the original array", () => {
    const copy = [...recipes];
    sortRecipes(recipes, "title-az");
    expect(recipes).toEqual(copy);
  });

  it("sorts alphabetically by title", () => {
    const sorted = sortRecipes(recipes, "title-az");
    expect(sorted.map((r) => r.title)).toEqual(["Apple Pie", "Toast", "Zucchini Bread"]);
  });

  it("sorts by total time ascending", () => {
    const sorted = sortRecipes(recipes, "time-asc");
    expect(sorted.map((r) => r.title)).toEqual(["Toast", "Apple Pie", "Zucchini Bread"]);
  });

  it("sorts by difficulty from easy to hard", () => {
    const sorted = sortRecipes(recipes, "difficulty");
    expect(sorted.map((r) => r.title)).toEqual(["Toast", "Zucchini Bread", "Apple Pie"]);
  });

  it("leaves order unchanged for an unrecognized sort key", () => {
    const sorted = sortRecipes(recipes, "default");
    expect(sorted.map((r) => r.title)).toEqual(recipes.map((r) => r.title));
  });
});

describe("buildEmptyMealPlan", () => {
  it("creates all seven days with three empty meal slots each", () => {
    const plan = buildEmptyMealPlan();
    const days = Object.keys(plan);
    expect(days).toHaveLength(7);
    days.forEach((day) => {
      expect(plan[day]).toEqual({ breakfast: null, lunch: null, dinner: null });
    });
  });
});

describe("capitalize", () => {
  it("capitalizes the first letter only", () => {
    expect(capitalize("monday")).toBe("Monday");
    expect(capitalize("breakfast")).toBe("Breakfast");
  });
});

describe("buildShoppingList", () => {
  const chicken = {
    title: "Lemon Herb Roast Chicken",
    ingredients: ["1 whole chicken", "2 lemons", "salt"],
  };
  const risotto = {
    title: "Wild Mushroom Risotto",
    ingredients: ["2 cloves garlic, minced", "salt", "butter"],
  };

  it("returns an empty list for an empty meal plan", () => {
    expect(buildShoppingList(buildEmptyMealPlan())).toEqual([]);
  });

  it("collects ingredients from every filled slot across the week", () => {
    const plan = buildEmptyMealPlan();
    plan.monday.dinner = chicken;
    plan.wednesday.dinner = risotto;

    const list = buildShoppingList(plan);
    const labels = list.map((item) => item.label);
    expect(labels).toEqual(
      expect.arrayContaining(["1 whole chicken", "2 lemons", "2 cloves garlic, minced", "butter", "salt"])
    );
  });

  it("merges an identical ingredient line shared by two recipes into one entry", () => {
    const plan = buildEmptyMealPlan();
    plan.monday.dinner = chicken;
    plan.tuesday.lunch = risotto;

    const list = buildShoppingList(plan);
    const salt = list.find((item) => item.label === "salt");
    expect(salt.count).toBe(2);
    expect(salt.recipes).toEqual(
      expect.arrayContaining(["Lemon Herb Roast Chicken", "Wild Mushroom Risotto"])
    );
  });

  it("sorts the resulting list alphabetically", () => {
    const plan = buildEmptyMealPlan();
    plan.monday.dinner = chicken;
    const labels = buildShoppingList(plan).map((item) => item.label);
    expect(labels).toEqual([...labels].sort((a, b) => a.localeCompare(b)));
  });
});

describe("localStorage helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("writeStorage then readStorage round-trips a value", () => {
    writeStorage("test-key", { hello: "world" });
    expect(readStorage("test-key", null)).toEqual({ hello: "world" });
  });

  it("readStorage returns the fallback when the key is missing", () => {
    expect(readStorage("missing-key", "fallback")).toBe("fallback");
  });

  it("readStorage returns the fallback when stored JSON is corrupt", () => {
    localStorage.setItem("bad-key", "{not valid json");
    expect(readStorage("bad-key", "fallback")).toBe("fallback");
  });
});
