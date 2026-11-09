import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropertyBySlug } from "@/lib/api/properties";
import PropertyCarousel from "@/components/PropertyCarousel";
import styles from "./property.module.css";

export const instant = false;

function ChipList({ items = [] }) {
  return (
    <ul className={styles.chips}>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

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

  return (
    <main className={`${styles.page} property-detail-page`}>
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
          <a
            className={styles.contact}
            href={`mailto:contact@kasa.fr?subject=${encodeURIComponent(`À propos de ${property.title}`)}`}
          >
            Contacter l’hôte
          </a>
          <a
            className={styles.contact}
            href={`mailto:contact@kasa.fr?subject=${encodeURIComponent(`Message concernant ${property.title}`)}`}
          >
            Envoyer un message
          </a>
        </aside>
      </div>

      <section className={styles.descriptionCard} aria-labelledby="property-title">
        <h1 id="property-title">{property.title}</h1>
        <p className={styles.location}>
          <Image src="/images/localisation.png" alt="" width={16} height={16} />
          {property.location}
        </p>
        <p className={styles.description}>{property.description}</p>
        <div className={styles.group}>
          <h2>Équipements</h2>
          <ChipList items={property.equipments} />
        </div>
        <div className={`${styles.group} ${styles.categoryGroup}`}>
          <h2>Catégorie</h2>
          <ChipList items={property.tags} />
        </div>
      </section>
    </main>
  );
}
