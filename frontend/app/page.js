import Image from "next/image";
import { connection } from "next/server";
import { getProperties } from "@/lib/api/properties";
import PropertyGrid from "@/components/PropertyGrid";
import styles from "./page.module.css";

/** Rend la page d'accueil et récupère côté serveur la liste des logements. */
export default async function Home() {
  // Le binding Vercel du backend n'existe qu'à l'exécution, donc charge les annonces après connexion.
  await connection();
  let properties = [];
  let hasError = false;

  try {
    properties = await getProperties();
  } catch {
    hasError = true;
  }

  return (
    <main className={styles.home}>
      <section className={styles.intro} aria-labelledby="home-title">
        <h1 id="home-title">
          Chez vous,
          <span className={styles.desktopHeadingContinuation}> partout et ailleurs</span>
          <span className={styles.mobileHeadingContinuation}>partout et ailleurs</span>
        </h1>
        <p>
          Avec Kasa, vivez des séjours uniques dans des
          <br className={styles.mobileIntroBreak} />
          {" "}hébergements chaleureux, sélectionnés avec soin
          <br className={styles.mobileIntroBreak} />
          {" "}par nos hôtes.
        </p>
      </section>

      <Image
        className={styles.homeFrame}
        src="/images/frame.png"
        alt=""
        width={1115}
        height={458}
        quality={100}
        sizes="(max-width: 600px) calc(100vw - 32px), (max-width: 1160px) calc(100vw - 48px), 1115px"
        priority
        fetchPriority="high"
      />

      {hasError ? (
        <p className={styles.message} role="alert">
          Les logements n’ont pas pu être chargés. Veuillez réessayer plus tard.
        </p>
      ) : properties.length === 0 ? (
        <p className={styles.message}>Aucun logement disponible pour le moment.</p>
      ) : (
        <>
          <PropertyGrid properties={properties} />
          <section className={styles.howItWorks} aria-labelledby="how-it-works-title">
            <h2 id="how-it-works-title">Comment ça marche ?</h2>
            <p className={styles.howItWorksIntro}>
              <span>Que vous partiez pour un week-end improvisé, des vacances en famille ou un voyage professionnel,</span>
              <span>Kasa vous aide à trouver un lieu qui vous ressemble.</span>
            </p>
            <div className={styles.steps}>
              <article className={styles.stepCard}>
                <h3>Recherchez</h3>
                <p>Entrez votre destination, vos dates et laissez Kasa faire le reste</p>
              </article>
              <article className={styles.stepCard}>
                <h3>Réservez</h3>
                <p>
                  Profitez d’une plateforme sécurisée
                  <br />et de profils d’hôtes vérifiés.
                </p>
              </article>
              <article className={styles.stepCard}>
                <h3>Vivez l’expérience</h3>
                <p>
                  Installez-vous, profitez de votre séjour,
                  <br />et sentez-vous chez vous, partout.
                </p>
              </article>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
