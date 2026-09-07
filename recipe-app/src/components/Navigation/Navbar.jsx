import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./Navbar.module.css";

/**
 * Sticky site navigation. Highlights the active route with `useLocation`
 * and collapses into a hamburger menu on small screens.
 */
function Navbar({ favoritesCount }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: "/", label: "Home", match: (p) => p === "/" },
    { to: "/recipes", label: "Recipes", match: (p) => p.startsWith("/recipes") },
    { to: "/meal-planner", label: "Meal Plan", match: (p) => p === "/meal-planner" },
    { to: "/favorites", label: "Favorites", match: (p) => p === "/favorites" },
  ];

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} onClick={() => setMenuOpen(false)}>
          <span className={styles.brandMark}>🍴</span>
          <span className={styles.brandName}>Fork & Plan</span>
        </Link>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`${styles.links} ${menuOpen ? styles.linksOpen : ""}`}>
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={link.match(location.pathname) ? styles.active : ""}
              aria-current={link.match(location.pathname) ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
              {link.to === "/favorites" && favoritesCount > 0 && (
                <span className={styles.badge}>{favoritesCount}</span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

Navbar.propTypes = {
  favoritesCount: PropTypes.number,
};

Navbar.defaultProps = {
  favoritesCount: 0,
};

export default Navbar;
