import styles from "./common.module.css";

/** Simple site footer. */
function Footer() {
  return (
    <footer className={styles.footer}>
      <p>Fork & Plan — built for a local cooking school and its food-blogger partners.</p>
      <p className={styles.footerMeta}>Recipe photography shown here is illustrative placeholder art.</p>
    </footer>
  );
}

export default Footer;
