import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import RecipeCard from "../RecipeCard";

const sampleRecipe = {
  id: 9,
  title: "Lemon Herb Roast Chicken",
  image: "/assets/images/recipe-09.jpg",
  cuisine: "American",
  category: "dinner",
  difficulty: "medium",
  prepTime: 20,
  cookTime: 75,
  servings: 4,
};

function renderCard(props = {}) {
  return render(
    <MemoryRouter>
      <RecipeCard recipe={sampleRecipe} {...props} />
    </MemoryRouter>
  );
}

describe("RecipeCard", () => {
  it("displays the recipe title, cuisine, and servings", () => {
    renderCard();
    expect(screen.getByText("Lemon Herb Roast Chicken")).toBeInTheDocument();
    expect(screen.getByText("American")).toBeInTheDocument();
    expect(screen.getByText("Serves 4")).toBeInTheDocument();
  });

  it("shows an empty heart when not a favorite, filled when it is", () => {
    const { rerender } = renderCard({ isFavorite: false });
    expect(screen.getByRole("button", { name: /add to favorites/i })).toHaveTextContent("♡");

    rerender(
      <MemoryRouter>
        <RecipeCard recipe={sampleRecipe} isFavorite />
      </MemoryRouter>
    );
    expect(screen.getByRole("button", { name: /remove from favorites/i })).toHaveTextContent("♥");
  });

  it("calls onFavoriteToggle with the recipe id when the heart is clicked", async () => {
    const onFavoriteToggle = vi.fn();
    renderCard({ onFavoriteToggle });
    await userEvent.click(screen.getByRole("button", { name: /add to favorites/i }));
    expect(onFavoriteToggle).toHaveBeenCalledWith(9);
  });

  it("combines prep and cook time in the displayed duration", () => {
    renderCard();
    // 20 + 75 = 95 minutes -> "1 hr 35 min"
    expect(screen.getByText("1 hr 35 min")).toBeInTheDocument();
  });
});
