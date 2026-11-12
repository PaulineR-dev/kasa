import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FavoritesProvider } from "@/components/FavoritesContext";
import { getSiteUrl } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Kasa",
  description: "Chez vous, partout et ailleurs.",
  metadataBase: new URL(getSiteUrl()),
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

/** Assemble le document HTML et les composants communs à toutes les pages. */
export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.variable}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Kasa",
              url: getSiteUrl(),
              inLanguage: "fr-FR",
            }).replace(/</g, "\\u003c"),
          }}
        />
        <FavoritesProvider>
          <Header />
          <div className="site-content">{children}</div>
          <Footer />
        </FavoritesProvider>
      </body>
    </html>
  );
}
