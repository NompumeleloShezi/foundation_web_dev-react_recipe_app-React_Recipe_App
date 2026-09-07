import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./UI.module.css";

/**
 * Controlled search input. Demonstrates a change event, a submit event,
 * and focus/blur events used for a simple highlight effect.
 */
function SearchBar({ value, onChange, onSubmit, placeholder = "Search recipes..." }) {
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(value);
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <input
        type="text"
        className={`${styles.searchInput} ${focused ? styles.searchInputFocused : ""}`}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <button type="submit" className={styles.searchButton}>
        Search
      </button>
    </form>
  );
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  placeholder: PropTypes.string,
};

export default SearchBar;
