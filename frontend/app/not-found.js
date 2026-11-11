import { Inter } from "next/font/google";
import Link from "next/link";
import styles from "./not-found.module.css";

const interBlack = Inter({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-inter-black",
  display: "swap",
});

export default function NotFound() {
  return (
    <main className={`${styles.page} ${interBlack.variable}`}>
      <div className={styles.code} aria-label="Erreur 404">
        <span aria-hidden="true">404</span>
      </div>
      <p className={styles.message}>
        <span>Il semble que la page que vous cherchez ait pris</span>
        <span>des vacances… ou n&apos;ait jamais existé.</span>
      </p>
      <nav className={styles.actions} aria-label="Liens utiles">
        <Link className={styles.button} href="/">Accueil</Link>
        <Link className={styles.button} href="/">Logements</Link>
      </nav>
    </main>
  );
}
