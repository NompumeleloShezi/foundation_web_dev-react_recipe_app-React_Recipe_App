import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Header from "../components/common/Header";
import RecipeList from "../components/Recipe/RecipeList";
import Button from "../components/UI/Button";

/**
 * Favorites page. Demonstrates a ternary between the filled and
 * empty-state views, driven by state lifted up in App.jsx.
 */
function FavoritesPage({ favorites, onFavoriteToggle }) {
  return (
    <div>
      <Header eyebrow="Your cookbook" title="Favorites" />

      {favorites.length > 0 ? (
        <RecipeList
          recipes={favorites}
          favorites={favorites}
          onFavoriteToggle={onFavoriteToggle}
        />
      ) : (
        <div className="empty-state">
          <h3>No favorites yet</h3>
          <p>Tap the heart on any recipe to save it here for later.</p>
          <Link to="/recipes">
            <Button variant="secondary">Browse recipes</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

FavoritesPage.propTypes = {
  favorites: PropTypes.array.isRequired,
  onFavoriteToggle: PropTypes.func.isRequired,
};

export default FavoritesPage;
