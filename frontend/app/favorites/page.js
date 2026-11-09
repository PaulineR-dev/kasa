"use client";

import Link from "next/link";
import { useFavorites } from "@/components/FavoritesContext";
import PropertyGrid from "@/components/PropertyGrid";
import styles from "./favorites.module.css";

export default function FavoritesPage() {
  const { favorites, isReady } = useFavorites();

  return (
    <main className={styles.page}>
      <h1>Vos favoris</h1>
      {!isReady ? null : favorites.length ? (
        <PropertyGrid properties={favorites} label="Vos logements favoris" />
      ) : (
        <p className={styles.empty}>Vous n&apos;avez pas encore ajouté de logement à vos favoris. <Link href="/">Découvrir les logements</Link></p>
      )}
    </main>
  );
}
