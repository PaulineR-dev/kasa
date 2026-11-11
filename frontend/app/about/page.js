import Image from "next/image";
import styles from "./about.module.css";

export const metadata = {
  title: "À propos | Kasa",
  description: "Découvrez la mission de Kasa et notre vision de l’hospitalité.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <section className={styles.introduction} aria-labelledby="about-title">
        <h1 id="about-title">À propos</h1>
        <div className={styles.introText}>
          <p>
            Chez Kasa, nous croyons que chaque voyage<br className={styles.mobileBreak} /> mérite un lieu unique où se sentir bien.
          </p>
          <p>
            Depuis notre création, nous mettons en relation des<br className={styles.mobileBreak} /> voyageurs en quête d&apos;authenticité avec des hôtes,
            <br className={styles.mobileBreak} />
            <br className={styles.desktopBreak} /> passionnés qui aiment partager leur région et leurs bonnes adresses.
          </p>
        </div>
      </section>

      <Image
        className={styles.banner}
        src="/images/a-propos.png"
        alt="Un chalet chaleureux niché dans la nature"
        width={1115}
        height={458}
        sizes="(max-width: 600px) calc(100vw - 32px), (max-width: 1160px) calc(100vw - 48px), 1115px"
        priority
        fetchPriority="high"
      />

      <section className={styles.mission} aria-labelledby="mission-title">
        <div className={styles.missionCopy}>
          <h2 id="mission-title">Notre mission est simple :</h2>
          <ol className={styles.missionList}>
            <li>Offrir une plateforme fiable et simple d&apos;utilisation</li>
            <li>Proposer des hébergements variés et de qualité</li>
            <li>Favoriser des échanges humains et chaleureux entre hôtes et voyageurs</li>
          </ol>
          <p className={styles.closing}>
            Que vous cherchiez un appartement cosy en centre-ville, une maison en bord de mer ou un chalet à la montagne,
            Kasa vous accompagne pour que chaque séjour devienne un souvenir inoubliable.
          </p>
        </div>
        <Image
          className={styles.missionImage}
          src="/images/a-propos2.png"
          alt="Une maison où voyageurs et hôtes peuvent se sentir bien"
          width={494}
          height={458}
          sizes="(max-width: 800px) min(100vw - 32px, 494px), 494px"
        />
      </section>
    </main>
  );
}
