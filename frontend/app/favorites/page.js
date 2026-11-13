"use client";

import Link from "next/link";
import { useFavorites } from "@/components/FavoritesContext";
import PropertyGrid from "@/components/PropertyGrid";
import styles from "./favorites.module.css";

/** Affiche les logements favoris après l'initialisation du stockage navigateur. */
export default function FavoritesPage() {
  const { favorites, isReady } = useFavorites();

  return (
    <main className={styles.page}>
      <header className={styles.introduction}>
        <h1>Vos favoris</h1>
        <p>
          Retrouvez ici tous les logements que vous avez aimés.<br />
          Prêt à réserver ? Un seul clic et votre prochain séjour est en route.
        </p>
      </header>
      {!isReady ? null : favorites.length ? (
        <PropertyGrid properties={favorites} label="Vos logements favoris" variant="favorites" />
      ) : (
        <p className={styles.empty}>
          Vous n&apos;avez pas encore ajouté de logement à vos favoris. <Link href="/">Découvrir les logements</Link>
        </p>
      )}
    </main>
  );
}
