import styles from "./page.module.css";
import Image from "next/image";

export default function Loading() {
  return (
    <main className={styles.home} aria-busy="true" aria-label="Chargement des logements">
      <section className={styles.intro}>
        <h1>Chez vous, partout et ailleurs</h1>
        <p>
          Avec Kasa, vivez des séjours uniques dans des hébergements chaleureux,
          sélectionnés avec soin par nos hôtes.
        </p>
      </section>
      <Image
        className={styles.homeFrame}
        src="/images/frame.png"
        alt=""
        width={1115}
        height={458}
        sizes="(max-width: 600px) calc(100vw - 32px), (max-width: 1160px) calc(100vw - 48px), 1115px"
        priority
        fetchPriority="high"
      />
      <div className={styles.propertyGrid}>
        {Array.from({ length: 6 }, (_, index) => (
          <div className={styles.skeletonCard} key={index} />
        ))}
      </div>
    </main>
  );
}
