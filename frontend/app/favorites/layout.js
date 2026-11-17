/** Métadonnées SEO de la page de favoris, autorisée à l'indexation. */
export const metadata = {
  title: "Mes favoris | Kasa",
  description: "Retrouvez les logements que vous avez ajoutés à vos favoris sur Kasa.",
  alternates: { canonical: "/favorites" },
  robots: { index: true, follow: true },
};

/**
 * Définit le titre, la description et les consignes d'indexation de la page.
 * @param {{children: import('react').ReactNode}} props Contenu de la page des favoris.
 * @returns {import('react').ReactNode} Contenu transmis sans wrapper supplémentaire.
 */
export default function FavoritesLayout({ children }) {
  return children;
}
