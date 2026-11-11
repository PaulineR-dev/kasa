import { getSiteUrl } from "@/lib/site";

// Next.js génère /robots.txt à partir de cet objet.
export default function robots() {
  const baseUrl = getSiteUrl();
  return {
    // Autorise tous les robots à explorer les pages du site.
    rules: { userAgent: "*", allow: "/" },
    // Indique aux robots où trouver la liste des URLs du site.
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
