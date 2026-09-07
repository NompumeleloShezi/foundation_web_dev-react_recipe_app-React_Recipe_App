import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { recipesData, CUISINE_COLORS } from "../../data/recipesData";
import { formatCookTime, difficultyIcon, DAYS_OF_WEEK, MEAL_SLOTS, capitalize } from "../../utils/helpers";
import VideoPlayer from "../Media/VideoPlayer";
import Button from "../UI/Button";
import styles from "./Recipe.module.css";

/**
 * Full recipe view. Reads the :id route param, looks the recipe up in the
 * static data set, and renders a 404-style message if it isn't found
 * (conditional rendering / early return).
 */
function RecipeDetail({ favorites, onFavoriteToggle, onAddToPlan }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [checked, setChecked] = useState([]);
  const [planDay, setPlanDay] = useState(DAYS_OF_WEEK[0]);
  const [planSlot, setPlanSlot] = useState(MEAL_SLOTS[0]);
  const [confirmMessage, setConfirmMessage] = useState("");

  const recipe = recipesData.find((r) => r.id === parseInt(id, 10));

  if (!recipe) {
    return (
      <div className="empty-state">
        <h3>Recipe not found</h3>
        <p>It may have been removed, or the link is incorrect.</p>
        <Button variant="secondary" onClick={() => navigate("/recipes")}>
          Back to recipes
        </Button>
      </div>
    );
  }

  const isFavorite = favorites.some((fav) => fav.id === recipe.id);
  const cuisineColor = CUISINE_COLORS[recipe.cuisine] || "#5C6B3A";

  const toggleIngredient = (index) => {
    setChecked((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleAddToPlan = () => {
    onAddToPlan(planDay, planSlot, recipe);
    setConfirmMessage(`Added to ${capitalize(planDay)} ${planSlot}.`);
    setTimeout(() => setConfirmMessage(""), 2500);
  };

  return (
    <div>
      <button className={styles.backLink} onClick={() => navigate("/recipes")}>
        ← Back to recipes
      </button>

      <div className={styles.detailHero} style={{ background: `${cuisineColor}17` }}>
        <img src={recipe.image} alt={recipe.title} className={styles.detailImage} />
        <div className={styles.detailInfo}>
          <p className="page-eyebrow" style={{ color: cuisineColor }}>{recipe.cuisine}</p>
          <h1 className="page-title">{recipe.title}</h1>
          <div className={styles.cardMeta}>
            <span>Prep {formatCookTime(recipe.prepTime)}</span>
            <span>Cook {formatCookTime(recipe.cookTime)}</span>
            <span>{difficultyIcon(recipe.difficulty)} {capitalize(recipe.difficulty)}</span>
            <span>Serves {recipe.servings}</span>
          </div>
          <button
            className={`${styles.favButtonLarge} ${isFavorite ? styles.favButtonActive : ""}`}
            onClick={() => onFavoriteToggle(recipe.id)}
          >
            {isFavorite ? "♥ Saved to favorites" : "♡ Save to favorites"}
          </button>
        </div>
      </div>

      <div className={styles.detailBody}>
        <div>
          <h2 className="section-title">Ingredients</h2>
          <ul className={styles.ingredientList}>
            {recipe.ingredients.map((ingredient, index) => (
              <li
                key={index}
                className={checked.includes(index) ? styles.ingredientDone : ""}
                onClick={() => toggleIngredient(index)}
              >
                <span className={styles.checkbox}>{checked.includes(index) ? "✓" : ""}</span>
                {ingredient}
              </li>
            ))}
          </ul>

          <div className={styles.planPicker}>
            <select value={planDay} onChange={(e) => setPlanDay(e.target.value)}>
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>{capitalize(day)}</option>
              ))}
            </select>
            <select value={planSlot} onChange={(e) => setPlanSlot(e.target.value)}>
              {MEAL_SLOTS.map((slot) => (
                <option key={slot} value={slot}>{capitalize(slot)}</option>
              ))}
            </select>
            <Button variant="secondary" onClick={handleAddToPlan}>
              Add to meal plan
            </Button>
          </div>
          {confirmMessage && <p className={styles.confirmText}>{confirmMessage}</p>}
        </div>

        <div>
          <h2 className="section-title">Instructions</h2>
          <ol className={styles.stepList}>
            {recipe.instructions.map((step, index) => (
              <li key={index}>
                <span className={styles.stepNum}>{index + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>

          {recipe.videoUrl && (
            <div style={{ marginTop: 28 }}>
              <VideoPlayer videoUrl={recipe.videoUrl} title={`${recipe.title} — tutorial`} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

RecipeDetail.propTypes = {
  favorites: PropTypes.array.isRequired,
  onFavoriteToggle: PropTypes.func.isRequired,
  onAddToPlan: PropTypes.func.isRequired,
};

export default RecipeDetail;
