import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FavoritesProvider } from "@/components/FavoritesContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Kasa",
  description: "Chez vous, partout et ailleurs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.variable}>
        <FavoritesProvider>
          <Header />
          <div className="site-content">{children}</div>
          <Footer />
        </FavoritesProvider>
      </body>
    </html>
  );
}
