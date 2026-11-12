import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";

/** Affiche le pied de page commun avec le logo et le copyright. */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Link className={styles.logoLink} href="/" aria-label="Kasa, accueil">
        <Image src="/images/kasa.png" alt="Kasa" width={46} height={53} />
      </Link>
      <small className={styles.copyright}>© 2025 Kasa. All rights reserved</small>
    </footer>
  );
}
