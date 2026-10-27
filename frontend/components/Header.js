import Image from "next/image";
import Link from "next/link";
import MobileNavigation from "@/components/MobileNavigation";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.siteHeader}>
      <nav className={styles.desktopHeader} aria-label="Navigation principale">
        <Link className={`${styles.desktopLink} ${styles.home}`} href="/">Accueil</Link>
        <Link className={`${styles.desktopLink} ${styles.about}`} href="/about">À propos</Link>
        <Link className={styles.brand} href="/" aria-label="Kasa, accueil">
          <Image src="/images/kasa-logo.png" alt="Kasa" width={114} height={41} priority />
        </Link>
        <Link className={`${styles.desktopLink} ${styles.add}`} href="/properties/new">+ Ajouter un logement</Link>
        <div className={styles.actions}>
          <Link href="/favorites" aria-label="Favoris"><Image src="/images/heart.png" alt="" width={10} height={9} /></Link>
          <span className={styles.divider} aria-hidden="true" />
          <Link href="/messages" aria-label="Messagerie"><Image src="/images/message.png" alt="" width={10} height={8} /></Link>
        </div>
      </nav>
      <MobileNavigation />
    </header>
  );
}