import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import Header from "../components/common/Header";
import SearchBar from "../components/UI/SearchBar";
import RecipeFilter from "../components/Recipe/RecipeFilter";
import RecipeList from "../components/Recipe/RecipeList";
import Loading from "../components/UI/Loading";
import { recipesData } from "../data/recipesData";
import { filterRecipes, sortRecipes } from "../utils/helpers";

/**
 * Main recipe browsing page: search, category/cuisine/difficulty filters,
 * a sort order, and the resulting recipe grid. Simulates an initial load
 * with a brief loading state (ternary conditional rendering).
 */
function RecipesPage({ favorites, onFavoriteToggle }) {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [cuisine, setCuisine] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  // Simulate fetching recipe data on mount.
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(
    () => filterRecipes(recipesData, { search, category, cuisine, difficulty }),
    [search, category, cuisine, difficulty]
  );

  const sorted = useMemo(() => sortRecipes(filtered, sortBy), [filtered, sortBy]);

  const handleClear = () => {
    setCategory("all");
    setCuisine("all");
    setDifficulty("all");
  };

  return (
    <div>
      <Header eyebrow="Recipe box" title="Browse recipes" />

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
        <SearchBar
          value={search}
          onChange={setSearch}
          onSubmit={setSearch}
          placeholder="Search recipes by name..."
        />
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", color: "var(--ink-soft)" }}>
          Sort by
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="default">Featured order</option>
            <option value="title-az">Name (A–Z)</option>
            <option value="time-asc">Total time (quickest first)</option>
            <option value="difficulty">Difficulty (easiest first)</option>
          </select>
        </label>
      </div>

      <RecipeFilter
        category={category}
        cuisine={cuisine}
        difficulty={difficulty}
        onCategoryChange={setCategory}
        onCuisineChange={setCuisine}
        onDifficultyChange={setDifficulty}
        onClear={handleClear}
      />

      {isLoading ? (
        <Loading label="Loading recipes..." />
      ) : (
        <RecipeList
          recipes={sorted}
          favorites={favorites}
          onFavoriteToggle={onFavoriteToggle}
        />
      )}
    </div>
  );
}

RecipesPage.propTypes = {
  favorites: PropTypes.array.isRequired,
  onFavoriteToggle: PropTypes.func.isRequired,
};

export default RecipesPage;
