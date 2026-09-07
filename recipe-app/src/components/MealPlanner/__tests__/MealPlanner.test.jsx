import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MealPlanner from "../MealPlanner";
import { buildEmptyMealPlan } from "../../../utils/helpers";

describe("MealPlanner", () => {
  it("renders all seven days", () => {
    render(
      <MealPlanner
        mealPlan={buildEmptyMealPlan()}
        onAssignMeal={vi.fn()}
        onRemoveMeal={vi.fn()}
        onClearWeek={vi.fn()}
      />
    );
    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it("opens the recipe picker and assigns a recipe to a slot", async () => {
    const onAssignMeal = vi.fn();
    render(
      <MealPlanner
        mealPlan={buildEmptyMealPlan()}
        onAssignMeal={onAssignMeal}
        onRemoveMeal={vi.fn()}
        onClearWeek={vi.fn()}
      />
    );

    await userEvent.click(screen.getAllByText("+ Add recipe")[0]);
    await userEvent.type(screen.getByPlaceholderText("Search recipes..."), "Pancakes");
    await userEvent.click(await screen.findByText("Fluffy Buttermilk Pancakes"));

    expect(onAssignMeal).toHaveBeenCalledWith(
      "monday",
      "breakfast",
      expect.objectContaining({ title: "Fluffy Buttermilk Pancakes" })
    );
  });

  it("disables the shopping list button when the week is empty", () => {
    render(
      <MealPlanner
        mealPlan={buildEmptyMealPlan()}
        onAssignMeal={vi.fn()}
        onRemoveMeal={vi.fn()}
        onClearWeek={vi.fn()}
      />
    );
    expect(screen.getByText("🛒 Shopping list").closest("button")).toBeDisabled();
  });

  it("shows a shopping list generated from planned meals", async () => {
    const plan = buildEmptyMealPlan();
    plan.monday.breakfast = {
      id: 1,
      title: "Fluffy Buttermilk Pancakes",
      ingredients: ["2 cups all-purpose flour", "2 large eggs"],
    };

    render(
      <MealPlanner
        mealPlan={plan}
        onAssignMeal={vi.fn()}
        onRemoveMeal={vi.fn()}
        onClearWeek={vi.fn()}
      />
    );

    await userEvent.click(screen.getByText("🛒 Shopping list"));
    expect(screen.getByText("2 cups all-purpose flour")).toBeInTheDocument();
    expect(screen.getByText("2 large eggs")).toBeInTheDocument();
  });

  it("calls onClearWeek when the clear week button is clicked", async () => {
    const onClearWeek = vi.fn();
    render(
      <MealPlanner
        mealPlan={buildEmptyMealPlan()}
        onAssignMeal={vi.fn()}
        onRemoveMeal={vi.fn()}
        onClearWeek={onClearWeek}
      />
    );
    await userEvent.click(screen.getByText("Clear week"));
    expect(onClearWeek).toHaveBeenCalledTimes(1);
  });
});
