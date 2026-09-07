import PropTypes from "prop-types";
import Header from "../components/common/Header";
import MealPlanner from "../components/MealPlanner/MealPlanner";

/** Thin page wrapper around the MealPlanner component. */
function MealPlannerPage({ mealPlan, onAssignMeal, onRemoveMeal, onClearWeek }) {
  return (
    <div>
      <Header eyebrow="This week" title="Meal planner" />
      <MealPlanner
        mealPlan={mealPlan}
        onAssignMeal={onAssignMeal}
        onRemoveMeal={onRemoveMeal}
        onClearWeek={onClearWeek}
      />
    </div>
  );
}

MealPlannerPage.propTypes = {
  mealPlan: PropTypes.object.isRequired,
  onAssignMeal: PropTypes.func.isRequired,
  onRemoveMeal: PropTypes.func.isRequired,
  onClearWeek: PropTypes.func.isRequired,
};

export default MealPlannerPage;
