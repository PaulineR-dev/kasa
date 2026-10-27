import styles from "./page.module.css";
import Image from "next/image";

export default function Loading() {
  return (
    <main className={styles.home} aria-busy="true" aria-label="Chargement des logements">
      <section className={styles.intro}>
        <h1>Chez vous, partout et ailleurs</h1>
        <p>
          Kasa, vivez des séjours uniques dans des hébergements chaleureux,
          sélectionnés avec soin par nos hôtes.
        </p>
      </section>
      <Image
        className={styles.homeFrame}
        src="/images/frame.png"
        alt=""
        width={1115}
        height={458}
        priority
      />
      <div className={styles.propertyGrid}>
        {Array.from({ length: 6 }, (_, index) => (
          <div className={styles.skeletonCard} key={index} />
        ))}
      </div>
    </main>
  );
}