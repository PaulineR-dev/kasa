"use client";

import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/components/FavoritesContext";
import styles from "@/app/page.module.css";

export default function PropertyGrid({ properties, label = "Tous les logements" }) {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <section className={styles.propertyGrid} aria-label={label}>
      {properties.map((property) => {
        const selected = isFavorite(property.id);
        return (
          <article className={styles.propertyCard} key={property.id}>
            <Link className={styles.cardLink} href={`/properties/${property.slug || property.id}`}>
              <div className={styles.propertyImageWrap}>
                <Image
                  className={styles.propertyImage}
                  src={property.cover}
                  alt={property.title}
                  fill
                  sizes="(max-width: 600px) calc(100vw - 32px), 355px"
                />
              </div>
              <div className={styles.propertyContent}>
                <h2 className={styles.propertyTitle}>{property.title}</h2>
                <p className={styles.propertyDescription}>{property.description}</p>
                <p className={styles.propertyPrice}>
                  <span>{property.price_per_night} €</span>
                  <span className={styles.perNight}>par nuit</span>
                </p>
              </div>
            </Link>
            <button
              className={`${styles.favoriteVisual} ${selected ? styles.favoriteActive : ""}`}
              type="button"
              aria-label={selected ? `Retirer ${property.title} des favoris` : `Ajouter ${property.title} aux favoris`}
              aria-pressed={selected}
              onClick={() => toggleFavorite(property)}
            >
              <Image className={styles.favoriteIcon} src="/images/heart-icon.png" alt="" width={16} height={16} />
              <Image className={styles.favoriteIconSelected} src="/images/heart-icon-selected.png" alt="" width={16} height={16} />
            </button>
          </article>
        );
      })}
    </section>
  );
}
