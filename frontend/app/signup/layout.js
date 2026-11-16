/** Métadonnées SEO de la page de création de compte. */
export const metadata = {
  title: "Créer un compte | Kasa",
  description: "Créez votre compte Kasa pour découvrir des logements et partager vos annonces.",
  alternates: { canonical: "/signup" },
  robots: { index: true, follow: true },
};

/**
 * Applique les métadonnées spécifiques aux pages d'inscription.
 * @param {{children: import('react').ReactNode}} props Contenu de la page d'inscription.
 * @returns {import('react').ReactNode} Contenu transmis sans wrapper supplémentaire.
 */
export default function SignupLayout({ children }) {
  return children;
}
