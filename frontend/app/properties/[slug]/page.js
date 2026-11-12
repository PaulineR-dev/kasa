import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropertyBySlug } from "@/lib/api/properties";
import PropertyCarousel from "@/components/PropertyCarousel";
import PropertyAccordion from "./PropertyAccordion";
import { getSiteUrl } from "@/lib/site";
import styles from "./property.module.css";

export const instant = false;
/**
 * Prépare les métadonnées SEO de la fiche logement à partir de ses données.
 * @param {{params: Promise<{slug: string}>}} input Paramètres de la route dynamique.
 * @returns {Promise<Object>} Métadonnées de la page, ou titre non indexable si logement absent.
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug).catch(() => null);
  if (!property) return { title: "Logement introuvable | Kasa", robots: { index: false } };

  const canonical = `/properties/${encodeURIComponent(property.slug || property.id)}`;
  return {
    title: `${property.title} | Kasa`,
    description: String(property.description || "").slice(0, 160),
    alternates: { canonical },
    openGraph: { title: `${property.title} | Kasa`, description: property.description, url: canonical, images: property.cover ? [property.cover] : [] },
  };
}

/**
 * Récupère les données du logement et rend sa fiche avec données structurées.
 * @param {{params: Promise<{slug: string}>}} input Paramètres de la route dynamique.
 * @returns {Promise<import('react').ReactElement>} Fiche logement ou page 404.
 */
export default async function PropertyPage({ params }) {
  const { slug } = await params;
  let property;

  try {
    property = await getPropertyBySlug(slug);
  } catch {
    notFound();
  }

  if (!property) notFound();

  const pictures = property.pictures?.length
    ? property.pictures
    : property.cover
      ? [property.cover]
      : [];
  const rating = Number(property.rating_avg ?? property.rating ?? 0);
  const hostName = property.host?.name || "Hôte Kasa";
  const propertyUrl = `${getSiteUrl()}/properties/${encodeURIComponent(property.slug || property.id)}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: property.title,
    description: property.description,
    url: propertyUrl,
    image: pictures,
    address: { "@type": "PostalAddress", addressLocality: property.location, addressCountry: "FR" },
    ...(rating > 0 ? { aggregateRating: { "@type": "AggregateRating", ratingValue: rating, bestRating: 5, ratingCount: Number(property.ratings_count || 1) } } : {}),
  };

  return (
    <main className={`${styles.page} property-detail-page`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <Link href="/" className={styles.back}>
        <Image src="/images/arrow.png" alt="" width={8} height={6} />
        Retour aux annonces
      </Link>

      <div className={styles.heroRow}>
        <PropertyCarousel pictures={pictures} cover={property.cover} title={property.title} />
        <aside className={styles.hostCard} aria-label={`Votre hôte : ${hostName}`}>
          <h2 className={styles.hostLabel}>Votre hôte</h2>
          <div className={styles.hostInfo}>
            {property.host?.picture ? (
              <Image
                className={styles.avatar}
                src={property.host.picture}
                alt={`Portrait de ${hostName}`}
                width={81}
                height={82}
              />
            ) : (
              <div className={styles.avatarFallback} aria-hidden="true">
                {hostName.slice(0, 1)}
              </div>
            )}
            <p className={styles.hostName}>{hostName}</p>
            <div className={styles.rating} aria-label={`Note : ${rating} sur 5`}>
              <Image src="/images/star.png" alt="" width={18} height={18} />
              <span>{rating}</span>
            </div>
          </div>
          <Link
            className={styles.contact}
            href={`/messages?property=${encodeURIComponent(property.slug || property.id)}`}
          >
            Contacter l’hôte
          </Link>
          <Link
            className={styles.contact}
            href={`/messages?property=${encodeURIComponent(property.slug || property.id)}`}
          >
            Envoyer un message
          </Link>
        </aside>
      </div>

      <section className={styles.descriptionCard} aria-labelledby="property-title">
        <h1 id="property-title">{property.title}</h1>
        <p className={styles.location}>
          <Image src="/images/localisation.png" alt="" width={16} height={16} />
          {property.location}
        </p>
        <p className={styles.description}>{property.description}</p>
        <PropertyAccordion title="Équipements" items={property.equipments} />
        <PropertyAccordion title="Catégorie" items={property.tags} />
      </section>
    </main>
  );
}
