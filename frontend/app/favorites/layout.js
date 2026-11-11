export const metadata = {
  title: "Mes favoris | Kasa",
  description: "Retrouvez les logements que vous avez ajoutés à vos favoris sur Kasa.",
  alternates: { canonical: "/favorites" },
  robots: { index: false, follow: false },
};

export default function FavoritesLayout({ children }) {
  return children;
}
