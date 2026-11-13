"use client";

import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/components/FavoritesContext";
import styles from "@/app/page.module.css";
import { getSiteUrl } from "@/lib/site";

/**
 * Affiche les logements sous forme de grille avec leurs liens et boutons favoris.
 * Le JSON-LD `ItemList` décrit aussi cette liste aux moteurs de recherche : chaque
 * logement y figure comme un élément ordonné avec son nom et l'URL de sa fiche.
 */
export default function PropertyGrid({ properties, label = "Tous les logements", variant = "default" }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFavoritesPage = variant === "favorites";

  return (
    <section className={`${styles.propertyGrid} ${isFavoritesPage ? "favorites-property-grid" : ""}`} aria-label={label}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: properties.map((property, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `${getSiteUrl()}/properties/${encodeURIComponent(property.slug || property.id)}`,
              name: property.title,
            })),
          }).replace(/</g, "\\u003c"),
        }}
      />
      {properties.map((property) => {
        const selected = isFavorite(property.id);
        return (
          <article className={`${styles.propertyCard} ${isFavoritesPage ? "favorites-property-card" : ""}`} key={property.id}>
            <Link className={styles.cardLink} href={`/properties/${property.slug || property.id}`}>
              <div
                className={`${styles.propertyImageWrap} ${isFavoritesPage ? "favorites-property-image-wrap" : ""}`}
              >
                <Image
                  className={styles.propertyImage}
                  src={property.cover}
                  alt={property.title}
                  fill
                  unoptimized
                  quality={100}
                  priority={properties[0]?.id === property.id}
                  fetchPriority={properties[0]?.id === property.id ? "high" : "auto"}
                  sizes="(max-width: 386px) calc(100vw - 32px), 355px"
                />
              </div>
              <div className={`${styles.propertyContent} ${isFavoritesPage ? "favorites-property-content" : ""}`}>
                <h2 className={styles.propertyTitle}>{property.title}</h2>
                <p className={isFavoritesPage ? "favorites-property-location" : styles.propertyDescription}>
                  {isFavoritesPage ? property.location : property.description}
                </p>
                <p className={`${styles.propertyPrice} ${isFavoritesPage ? "favorites-property-price" : ""}`}>
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
