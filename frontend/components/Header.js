"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import MobileNavigation from "@/components/MobileNavigation";
import styles from "./Header.module.css";

/** Efface la session locale puis redirige l'utilisateur vers l'accueil. */
export function logout() {
  window.localStorage.removeItem("kasa_token");
  window.localStorage.removeItem("kasa_user");
  window.dispatchEvent(new Event("kasa-auth-changed"));
  window.location.assign("/");
}

/** Affiche la navigation principale et la synchronise avec l'état de connexion. */
export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const syncAuth = () => setIsLoggedIn(Boolean(window.localStorage.getItem("kasa_token")));
    syncAuth();
    // storage couvre les autres onglets; l'événement personnalisé couvre les changements dans cet onglet.
    window.addEventListener("storage", syncAuth);
    window.addEventListener("kasa-auth-changed", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("kasa-auth-changed", syncAuth);
    };
  }, []);

  return (
    <header className={styles.siteHeader}>
      <nav className={`${styles.desktopHeader} ${isLoggedIn ? styles.desktopHeaderLoggedIn : styles.desktopHeaderLoggedOut}`} aria-label="Navigation principale">
        <Link className={`${styles.desktopLink} ${styles.home}`} href="/" aria-current={pathname === "/" ? "page" : undefined}>Accueil</Link>
        <Link className={`${styles.desktopLink} ${styles.about}`} href="/about" aria-current={pathname === "/about" ? "page" : undefined}>À propos</Link>
        <Link className={styles.brand} href="/" aria-label="Kasa, accueil">
          <Image src="/images/kasa-logo.png" alt="Kasa" width={114} height={41} quality={100} priority />
        </Link>
        <Link className={`${styles.desktopLink} ${styles.add}`} href={isLoggedIn ? "/properties/new" : "/login"}>+Ajouter un logement</Link>
        {isLoggedIn ? (
          <button className={`${styles.authButton} ${styles.logoutButton}`} type="button" onClick={logout}>Se déconnecter</button>
        ) : (
          <Link className={`${styles.authButton} ${styles.loginButton}`} href="/login">Se connecter</Link>
        )}
        <div className={`${styles.actions} ${isLoggedIn ? styles.actionsLoggedIn : styles.actionsLoggedOut}`}>
          <Link href={isLoggedIn ? "/favorites" : "/login"} aria-label="Favoris"><Image src="/images/heart.png" alt="" width={10} height={9} quality={100} /></Link>
          <span className={styles.divider} aria-hidden="true" />
          <Link href={isLoggedIn ? "/messages" : "/login"} aria-label="Messagerie"><Image src="/images/message.png" alt="" width={10} height={8} quality={100} /></Link>
        </div>
      </nav>
      <MobileNavigation isLoggedIn={isLoggedIn} onLogout={logout} />
    </header>
  );
}
