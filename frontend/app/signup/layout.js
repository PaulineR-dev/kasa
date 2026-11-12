export const metadata = {
  title: "Créer un compte | Kasa",
  description: "Créez votre compte Kasa pour découvrir des logements et partager vos annonces.",
  alternates: { canonical: "/signup" },
  robots: { index: true, follow: true },
};

/** Applique les métadonnées spécifiques aux pages d'inscription. */
export default function SignupLayout({ children }) {
  return children;
}
