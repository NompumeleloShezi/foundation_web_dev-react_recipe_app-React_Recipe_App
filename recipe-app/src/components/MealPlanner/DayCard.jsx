import PropTypes from "prop-types";
import { MEAL_SLOTS, capitalize } from "../../utils/helpers";
import styles from "./MealPlanner.module.css";

/**
 * Represents a single day in the weekly meal plan, with a slot for each
 * meal. Reused seven times by MealPlanner (one per day of the week).
 */
function DayCard({ day, meals, onRemoveMeal, onOpenPicker, isToday }) {
  return (
    <div className={`${styles.dayCard} ${isToday ? styles.dayCardToday : ""}`}>
      <h3 className={styles.dayHeading}>{capitalize(day)}</h3>
      {MEAL_SLOTS.map((slot) => {
        const meal = meals[slot];
        return (
          <div key={slot} className={styles.slot}>
            <span className={styles.slotLabel}>{capitalize(slot)}</span>
            {meal ? (
              <div className={styles.slotFilled}>
                <span>{meal.title}</span>
                <button
                  className={styles.slotRemove}
                  onClick={() => onRemoveMeal(day, slot)}
                  aria-label={`Remove ${meal.title} from ${day} ${slot}`}
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                className={styles.slotEmpty}
                onClick={() => onOpenPicker(day, slot)}
              >
                + Add recipe
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

DayCard.propTypes = {
  day: PropTypes.string.isRequired,
  meals: PropTypes.shape({
    breakfast: PropTypes.object,
    lunch: PropTypes.object,
    dinner: PropTypes.object,
  }).isRequired,
  onRemoveMeal: PropTypes.func.isRequired,
  onOpenPicker: PropTypes.func.isRequired,
  isToday: PropTypes.bool,
};

DayCard.defaultProps = {
  isToday: false,
};

export default DayCard;
