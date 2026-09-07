import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navigation/Navbar";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import RecipesPage from "./pages/RecipesPage";
import RecipeDetail from "./components/Recipe/RecipeDetail";
import MealPlannerPage from "./pages/MealPlannerPage";
import FavoritesPage from "./pages/FavoritesPage";
import NotFound from "./pages/NotFound";
import { buildEmptyMealPlan, readStorage, writeStorage } from "./utils/helpers";
import { recipesData } from "./data/recipesData";

const FAVORITES_KEY = "forkAndPlan.favorites";
const MEAL_PLAN_KEY = "forkAndPlan.mealPlan";

/**
 * Root component. Owns the two pieces of state that are shared across
 * multiple pages/routes (favorites and the weekly meal plan), lifting
 * them up here so any page or sibling component can read or update them.
 * Both are persisted to localStorage so they survive a page refresh.
 */
function App() {
  const [favorites, setFavorites] = useState(() => readStorage(FAVORITES_KEY, []));
  const [mealPlan, setMealPlan] = useState(() => readStorage(MEAL_PLAN_KEY, buildEmptyMealPlan()));

  // Persist favorites whenever they change.
  useEffect(() => {
    writeStorage(FAVORITES_KEY, favorites);
  }, [favorites]);

  // Persist the meal plan whenever it changes.
  useEffect(() => {
    writeStorage(MEAL_PLAN_KEY, mealPlan);
  }, [mealPlan]);

  const handleFavoriteToggle = (recipeId) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === recipeId);
      if (exists) {
        return prev.filter((fav) => fav.id !== recipeId);
      }
      // Look the full recipe up so favorites can be displayed without
      // re-fetching from any page.
      const recipe = recipesData.find((r) => r.id === recipeId);
      return recipe ? [...prev, recipe] : prev;
    });
  };

  const handleAssignMeal = (day, slot, recipe) => {
    setMealPlan((prev) => ({
      ...prev,
      [day]: { ...prev[day], [slot]: recipe },
    }));
  };

  const handleRemoveMeal = (day, slot) => {
    setMealPlan((prev) => ({
      ...prev,
      [day]: { ...prev[day], [slot]: null },
    }));
  };

  const handleClearWeek = () => {
    setMealPlan(buildEmptyMealPlan());
  };

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar favoritesCount={favorites.length} />

      <main className="app-main" id="main-content">
        <Routes>
          <Route
            path="/"
            element={<Home favorites={favorites} onFavoriteToggle={handleFavoriteToggle} />}
          />
          <Route
            path="/recipes"
            element={<RecipesPage favorites={favorites} onFavoriteToggle={handleFavoriteToggle} />}
          />
          <Route
            path="/recipes/:id"
            element={
              <RecipeDetail
                favorites={favorites}
                onFavoriteToggle={handleFavoriteToggle}
                onAddToPlan={handleAssignMeal}
              />
            }
          />
          <Route
            path="/meal-planner"
            element={
              <MealPlannerPage
                mealPlan={mealPlan}
                onAssignMeal={handleAssignMeal}
                onRemoveMeal={handleRemoveMeal}
                onClearWeek={handleClearWeek}
              />
            }
          />
          <Route
            path="/favorites"
            element={<FavoritesPage favorites={favorites} onFavoriteToggle={handleFavoriteToggle} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
