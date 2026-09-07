import PropTypes from "prop-types";
import styles from "./common.module.css";

/**
 * Reusable page header used at the top of each page. Demonstrates
 * default props and an expression (calculated string) passed as props.
 */
function Header({ eyebrow, title, subtitle }) {
  return (
    <div className={styles.header}>
      {eyebrow && <p className="page-eyebrow">{eyebrow}</p>}
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}

Header.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};

Header.defaultProps = {
  eyebrow: "",
  subtitle: "",
};

export default Header;
