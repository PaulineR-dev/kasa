/** Métadonnées SEO de la page de favoris, exclue de l'indexation. */
export const metadata = {
  title: "Mes favoris | Kasa",
  description: "Retrouvez les logements que vous avez ajoutés à vos favoris sur Kasa.",
  alternates: { canonical: "/favorites" },
  robots: { index: false, follow: false },
};

/**
 * Définit le titre et la description de la page des favoris.
 * La consigne `noindex` demande aux moteurs de recherche de ne pas afficher
 * cette page dans leurs résultats, car son contenu dépend des favoris propres
 * à chaque utilisateur.
 * @param {{children: import('react').ReactNode}} props Contenu de la page des favoris.
 * @returns {import('react').ReactNode} Contenu transmis sans wrapper supplémentaire.
 */
export default function FavoritesLayout({ children }) {
  return children;
}
