import { useState } from "react";
import PropTypes from "prop-types";
import DayCard from "./DayCard";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import { recipesData } from "../../data/recipesData";
import { DAYS_OF_WEEK, buildShoppingList } from "../../utils/helpers";
import styles from "./MealPlanner.module.css";

const TODAY_NAME = DAYS_OF_WEEK[(new Date().getDay() + 6) % 7]; // Monday-first index

/**
 * Weekly meal planner: renders a DayCard for each day, a Modal recipe
 * picker used to fill an empty slot, and a Modal shopping list that
 * aggregates every ingredient from the week's planned meals. Receives
 * the plan and update handlers as props from App.jsx (lifted state).
 */
function MealPlanner({ mealPlan, onAssignMeal, onRemoveMeal, onClearWeek }) {
  const [pickerTarget, setPickerTarget] = useState(null); // { day, slot } | null
  const [pickerSearch, setPickerSearch] = useState("");
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [checkedItems, setCheckedItems] = useState(new Set());

  const filledCount = DAYS_OF_WEEK.reduce((count, day) => {
    return count + Object.values(mealPlan[day]).filter(Boolean).length;
  }, 0);

  const filteredOptions = recipesData.filter((r) =>
    r.title.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  const shoppingList = buildShoppingList(mealPlan);

  const handlePick = (recipe) => {
    if (pickerTarget) {
      onAssignMeal(pickerTarget.day, pickerTarget.slot, recipe);
    }
    setPickerTarget(null);
    setPickerSearch("");
  };

  const toggleChecked = (label) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <div>
      <div className={styles.headerRow}>
        <p className={styles.progress}>{filledCount} of 21 meals planned this week</p>
        <div className={styles.headerActions}>
          <Button
            variant="secondary"
            onClick={() => setShowShoppingList(true)}
            disabled={filledCount === 0}
          >
            🛒 Shopping list
          </Button>
          <Button variant="danger" onClick={onClearWeek}>
            Clear week
          </Button>
        </div>
      </div>

      <div className={styles.grid}>
        {DAYS_OF_WEEK.map((day) => (
          <DayCard
            key={day}
            day={day}
            meals={mealPlan[day]}
            onRemoveMeal={onRemoveMeal}
            onOpenPicker={(d, slot) => setPickerTarget({ day: d, slot })}
            isToday={day === TODAY_NAME}
          />
        ))}
      </div>

      <Modal
        isOpen={pickerTarget !== null}
        onClose={() => setPickerTarget(null)}
        title="Choose a recipe"
      >
        <input
          type="text"
          className={styles.pickerSearch}
          placeholder="Search recipes..."
          value={pickerSearch}
          onChange={(e) => setPickerSearch(e.target.value)}
          autoFocus
        />
        <div className={styles.pickerList}>
          {filteredOptions.length === 0 && <p>No recipes match "{pickerSearch}".</p>}
          {filteredOptions.map((recipe) => (
            <button
              key={recipe.id}
              className={styles.pickerItem}
              onClick={() => handlePick(recipe)}
            >
              <img src={recipe.image} alt={recipe.title} />
              <span>{recipe.title}</span>
            </button>
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={showShoppingList}
        onClose={() => setShowShoppingList(false)}
        title="This week's shopping list"
      >
        {shoppingList.length === 0 ? (
          <p>Add a few meals to the plan to generate a shopping list.</p>
        ) : (
          <>
            <p className={styles.shoppingHint}>
              {shoppingList.length} ingredients across your planned meals. Check items off as you shop.
            </p>
            <ul className={styles.shoppingList}>
              {shoppingList.map((item) => (
                <li
                  key={item.label}
                  className={checkedItems.has(item.label) ? styles.shoppingItemDone : ""}
                  onClick={() => toggleChecked(item.label)}
                >
                  <span className={styles.checkbox}>
                    {checkedItems.has(item.label) ? "✓" : ""}
                  </span>
                  <span className={styles.shoppingLabel}>
                    {item.label}
                    {item.count > 1 && (
                      <span className={styles.shoppingCount}> · used in {item.count} recipes</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </Modal>
    </div>
  );
}

MealPlanner.propTypes = {
  mealPlan: PropTypes.object.isRequired,
  onAssignMeal: PropTypes.func.isRequired,
  onRemoveMeal: PropTypes.func.isRequired,
  onClearWeek: PropTypes.func.isRequired,
};

export default MealPlanner;
