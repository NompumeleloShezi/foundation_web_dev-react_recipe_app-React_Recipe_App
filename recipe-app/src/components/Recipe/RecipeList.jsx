import PropTypes from "prop-types";
import RecipeCard from "./RecipeCard";
import styles from "./Recipe.module.css";

/**
 * Renders a grid of RecipeCard components from an array of recipes.
 * Demonstrates the .map() list pattern and conditional (&&) rendering
 * for the empty-results case.
 */
function RecipeList({ recipes, favorites, onFavoriteToggle }) {
  if (recipes.length === 0) {
    return (
      <div className="empty-state">
        <h3>No recipes found</h3>
        <p>Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isFavorite={favorites.some((fav) => fav.id === recipe.id)}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  );
}

RecipeList.propTypes = {
  recipes: PropTypes.array.isRequired,
  favorites: PropTypes.array,
  onFavoriteToggle: PropTypes.func,
};

RecipeList.defaultProps = {
  favorites: [],
  onFavoriteToggle: () => {},
};

export default RecipeList;
