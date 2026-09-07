import PropTypes from "prop-types";
import styles from "./UI.module.css";

/** Simple loading indicator shown while recipe data is "fetched". */
function Loading({ label = "Loading recipes..." }) {
  return (
    <div className={styles.loadingWrap}>
      <div className={styles.spinner} />
      <p>{label}</p>
    </div>
  );
}

Loading.propTypes = {
  label: PropTypes.string,
};

export default Loading;
