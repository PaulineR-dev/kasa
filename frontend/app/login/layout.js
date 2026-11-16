/** Métadonnées SEO de la page de connexion. */
export const metadata = {
  title: "Se connecter | Kasa",
  description: "Connectez-vous à votre compte Kasa pour retrouver vos réservations et vos annonces.",
  alternates: { canonical: "/login" },
  robots: { index: true, follow: true },
};

/**
 * Applique les métadonnées de connexion sans ajouter de wrapper.
 * La page reste indexable (`index: true`) et ses liens peuvent être suivis
 * (`follow: true`) par les moteurs de recherche.
 * @param {{children: import('react').ReactNode}} props Contenu de la page de connexion.
 * @returns {import('react').ReactNode} Contenu transmis sans wrapper supplémentaire.
 */
export default function LoginLayout({ children }) {
  return children;
}
