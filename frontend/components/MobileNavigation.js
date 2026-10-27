"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

export default function MobileNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={`${styles.mobileNavigation} ${menuOpen ? styles.menuOpen : ""}`}>
      <div className={styles.mobileHeader}>
        <Link href="/" aria-label="Kasa, accueil">
          <Image src="/images/kasa.png" alt="Kasa" width={46} height={53} priority />
        </Link>
        <button
          className={styles.menuToggle}
          type="button"
          aria-label="Ouvrir le menu"
          aria-expanded={menuOpen}
          aria-hidden={menuOpen}
          tabIndex={menuOpen ? -1 : 0}
          onClick={() => setMenuOpen(true)}
        >
          <Image src="/images/mobile-navigation.png" alt="" width={46} height={46} priority />
        </button>
      </div>

      <div
        className={styles.mobileMenuOverlay}
        aria-hidden={!menuOpen}
      >
        <div className={styles.mobileMenuTop}>
          <Link href="/" aria-label="Kasa, accueil" onClick={() => setMenuOpen(false)}>
            <Image src="/images/kasa.png" alt="Kasa" width={46} height={53} priority />
          </Link>
        </div>
        <nav className={styles.mobileMenuLinks} aria-label="Navigation mobile">
          <div className={styles.mobileMenuItem}>
            <Link href="/" onClick={() => setMenuOpen(false)}>Accueil</Link>
            <span className={styles.menuSeparator} aria-hidden="true" />
          </div>
          <div className={styles.mobileMenuItem}>
            <Link href="/about" onClick={() => setMenuOpen(false)}>À propos</Link>
            <span className={styles.menuSeparator} aria-hidden="true" />
          </div>
          <div className={styles.mobileMenuItem}>
            <Link href="/messages" onClick={() => setMenuOpen(false)}>Messagerie</Link>
            <span className={styles.menuSeparator} aria-hidden="true" />
          </div>
          <div className={styles.mobileMenuItem}>
            <Link href="/favorites" onClick={() => setMenuOpen(false)}>Favoris</Link>
          </div>
          <Link className={styles.mobileAddLink} href="/properties/new" onClick={() => setMenuOpen(false)}>Ajouter un logement</Link>
        </nav>
      </div>
      <button
        className={styles.menuClose}
        type="button"
        aria-label="Fermer le menu"
        aria-hidden={!menuOpen}
        tabIndex={menuOpen ? 0 : -1}
        onClick={() => setMenuOpen(false)}
      >
        <Image src="/images/croix.png" alt="" width={26} height={26} />
      </button>
    </div>
  );
}