import styles from "./common.module.css";

/** Simple site footer. */
function Footer() {
  return (
    <footer className={styles.footer}>
      <p>Fork & Plan — your simple companion for discovering recipes and planning meals.</p>
      <p className={styles.footerMeta}>Recipe photography shown here is illustrative placeholder art.</p>
    </footer>
  );
}

export default Footer;
