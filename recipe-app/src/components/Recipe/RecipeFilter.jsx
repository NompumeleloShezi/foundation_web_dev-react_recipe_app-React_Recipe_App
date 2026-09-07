import PropTypes from "prop-types";
import { CATEGORIES, CUISINE_COLORS } from "../../data/recipesData";
import { capitalize } from "../../utils/helpers";
import styles from "./Recipe.module.css";

/**
 * Filter controls for the Recipes page: category select, cuisine chips,
 * and difficulty select, plus a clear-filters button.
 */
function RecipeFilter({ category, cuisine, difficulty, onCategoryChange, onCuisineChange, onDifficultyChange, onClear }) {
  const cuisines = Object.keys(CUISINE_COLORS);
  const hasActiveFilters = category !== "all" || cuisine !== "all" || difficulty !== "all";

  return (
    <div className={styles.filterBar}>
      <div className={styles.filterGroup}>
        <label htmlFor="category-select" className={styles.filterLabel}>Category</label>
        <select
          id="category-select"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{capitalize(cat)}</option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="difficulty-select" className={styles.filterLabel}>Difficulty</label>
        <select
          id="difficulty-select"
          value={difficulty}
          onChange={(e) => onDifficultyChange(e.target.value)}
        >
          <option value="all">Any difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <span className={styles.filterLabel}>Cuisine</span>
        <div className={styles.chipRow}>
          {cuisines.map((c) => (
            <button
              key={c}
              className={styles.chip}
              style={
                cuisine === c
                  ? { background: CUISINE_COLORS[c], borderColor: CUISINE_COLORS[c], color: "#fffbf2" }
                  : {}
              }
              onClick={() => onCuisineChange(cuisine === c ? "all" : c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button className={styles.clearButton} onClick={onClear}>
          Clear filters
        </button>
      )}
    </div>
  );
}

RecipeFilter.propTypes = {
  category: PropTypes.string.isRequired,
  cuisine: PropTypes.string.isRequired,
  difficulty: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onCuisineChange: PropTypes.func.isRequired,
  onDifficultyChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

export default RecipeFilter;
