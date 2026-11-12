export const metadata = {
  title: "Se connecter | Kasa",
  description: "Connectez-vous à votre compte Kasa pour retrouver vos réservations et vos annonces.",
  alternates: { canonical: "/login" },
  robots: { index: true, follow: true },
};

/**
 * Définit le titre et la description affichés pour la page de connexion.
 * La page reste indexable (`index: true`) et ses liens peuvent être suivis
 * (`follow: true`) par les moteurs de recherche.
 */
export default function LoginLayout({ children }) {
  return children;
}
