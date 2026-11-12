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
 */
export default function FavoritesLayout({ children }) {
  return children;
}
