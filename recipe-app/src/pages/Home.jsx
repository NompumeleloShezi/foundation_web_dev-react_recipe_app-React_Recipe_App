import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Header from "../components/common/Header";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Loading from "../components/UI/Loading";
import AudioPlayer from "../components/Media/AudioPlayer";
import RecipeList from "../components/Recipe/RecipeList";
import { recipesData } from "../data/recipesData";

/**
 * Landing page: a short intro, a "cooking tips" audio clip (media
 * component requirement), and a handful of featured recipes.
 */
function Home({ favorites, onFavoriteToggle }) {
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const featured = recipesData.slice(0, 4);

  // Simulate fetching the featured recipes on mount.
  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingFeatured(false), 350);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Header
        eyebrow="Welcome"
        title="Cook something new this week"
        subtitle="Browse recipes from our partner food bloggers, plan your week, and save the ones you love."
      />

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "36px" }}>
        <Card style={{ flex: "1 1 260px" }}>
          <h3 className="section-title">From the kitchen</h3>
          <p style={{ color: "var(--ink-soft)", fontSize: "0.9rem", marginBottom: 14 }}>
            A quick audio note from our head instructor on getting the most out of your ingredients.
          </p>
          <AudioPlayer audioUrl="/assets/audio/kitchen-tips.mp3" title="This week's kitchen tip" />
        </Card>

        <Card style={{ flex: "1 1 260px" }}>
          <h3 className="section-title">Plan your week</h3>
          <p style={{ color: "var(--ink-soft)", fontSize: "0.9rem", marginBottom: 14 }}>
            Drop recipes straight into a 7-day planner and keep track of every meal.
          </p>
          <Link to="/meal-planner">
            <Button variant="secondary">Open meal planner</Button>
          </Link>
        </Card>
      </div>

      <h2 className="section-title">Featured recipes</h2>
      {isLoadingFeatured ? (
        <Loading label="Loading featured recipes..." />
      ) : (
        <RecipeList
          recipes={featured}
          favorites={favorites}
          onFavoriteToggle={onFavoriteToggle}
        />
      )}

      <div style={{ textAlign: "center", marginTop: 28 }}>
        <Link to="/recipes">
          <Button variant="primary">Browse all recipes</Button>
        </Link>
      </div>
    </div>
  );
}

Home.propTypes = {
  favorites: PropTypes.array.isRequired,
  onFavoriteToggle: PropTypes.func.isRequired,
};

export default Home;
