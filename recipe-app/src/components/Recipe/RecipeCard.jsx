import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { CUISINE_COLORS } from "../../data/recipesData";
import { formatCookTime, difficultyIcon } from "../../utils/helpers";
import styles from "./Recipe.module.css";

/**
 * Summary card for a single recipe. Receives the recipe object and
 * favorite state/handler as props from its parent (RecipeList). Tracks
 * its own hover state (onMouseEnter/onMouseLeave) to reveal a
 * "View recipe" hint over the image.
 */
function RecipeCard({ recipe, isFavorite, onFavoriteToggle }) {
  const [isHovered, setIsHovered] = useState(false);
  const cuisineColor = CUISINE_COLORS[recipe.cuisine] || "#5C6B3A";

  return (
    <div className={styles.card}>
      <Link
        to={`/recipes/${recipe.id}`}
        className={styles.cardImageLink}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={recipe.image}
          alt={recipe.title}
          className={styles.cardImage}
        />
        {isHovered && <span className={styles.cardImageHint}>View recipe →</span>}
      </Link>

      <button
        className={`${styles.favButton} ${isFavorite ? styles.favButtonActive : ""}`}
        onClick={() => onFavoriteToggle(recipe.id)}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? "♥" : "♡"}
      </button>

      <div className={styles.cardBody}>
        <Link to={`/recipes/${recipe.id}`} className={styles.cardTitleLink}>
          <h3 className={styles.cardTitle}>{recipe.title}</h3>
        </Link>
        <p className={styles.cardCuisine} style={{ color: cuisineColor }}>
          {recipe.cuisine}
        </p>
        <div className={styles.cardMeta}>
          <span>{formatCookTime(recipe.prepTime + recipe.cookTime)}</span>
          <span>{difficultyIcon(recipe.difficulty)} {recipe.difficulty}</span>
          <span>Serves {recipe.servings || 4}</span>
        </div>
      </div>
    </div>
  );
}

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
    cuisine: PropTypes.string,
    category: PropTypes.string,
    difficulty: PropTypes.string,
    cookTime: PropTypes.number,
    prepTime: PropTypes.number,
    servings: PropTypes.number,
  }).isRequired,
  isFavorite: PropTypes.bool,
  onFavoriteToggle: PropTypes.func,
};

RecipeCard.defaultProps = {
  isFavorite: false,
  onFavoriteToggle: () => {},
};

export default RecipeCard;
