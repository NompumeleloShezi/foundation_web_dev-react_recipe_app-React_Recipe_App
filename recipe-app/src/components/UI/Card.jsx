import PropTypes from "prop-types";
import styles from "./UI.module.css";

/**
 * Generic Card container. Uses the `children` prop so any content can be
 * composed inside it (the composition pattern), plus an optional inline
 * style override and a "padded" flag for conditional styling.
 */
function Card({ children, padded = true, style, className = "" }) {
  return (
    <div
      className={`${styles.card} ${padded ? styles.cardPadded : ""} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  padded: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Card;
