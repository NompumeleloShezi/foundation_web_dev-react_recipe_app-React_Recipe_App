import PropTypes from "prop-types";
import styles from "./UI.module.css";

/**
 * Reusable Button component.
 * Demonstrates: destructured props, default props, expressions as
 * className, and passing an event handler down as a prop.
 */
function Button({ children, variant = "primary", onClick, type = "button", disabled = false, fullWidth = false }) {
  const classes = [
    styles.button,
    styles[variant],
    fullWidth ? styles.fullWidth : "",
  ].join(" ").trim();

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "danger"]),
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
};

export default Button;
