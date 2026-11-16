/** Métadonnées SEO de la page de messagerie, exclue de l'indexation. */
export const metadata = {
  title: "Messagerie | Kasa",
  description: "Messagerie Kasa pour échanger avec les hôtes.",
  alternates: { canonical: "/messages" },
  robots: { index: false, follow: false },
};

/**
 * Applique les métadonnées à la page de messagerie sans ajouter de wrapper.
 * @param {{children: import('react').ReactNode}} props Contenu de la messagerie.
 * @returns {import('react').ReactNode} Contenu transmis sans wrapper supplémentaire.
 */
export default function MessagesLayout({ children }) {
  return children;
}
