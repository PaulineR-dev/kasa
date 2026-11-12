import { getProperties } from "@/lib/api/properties";
import { getSiteUrl } from "@/lib/site";

/**
 * Génère le sitemap XML avec la page d'accueil et les pages des logements.
 * Si l'API est indisponible, le sitemap contient tout de même l'accueil.
 * @returns {Promise<Array<{url: string, changeFrequency: string, priority: number, lastModified?: Date}>>}
 */
// Next.js transforme cette fonction en fichier XML accessible à /sitemap.xml.
export default async function sitemap() {
  // Le domaine vient de SITE_URL (avec une valeur locale par défaut).
  const baseUrl = getSiteUrl();
  let properties = [];

  try {
    // Ajouter les pages des logements connus par l'API afin qu'elles soient découvertes.
    properties = await getProperties();
  } catch {
    // Conserve la route statique si l’API des logements est temporairement indisponible.
  }

  return [
    // Première entrée : la page d'accueil du site.
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    // Entrées suivantes : une URL pour chaque logement (propriété) de l'API.
    ...properties.map((property) => ({
      url: `${baseUrl}/properties/${encodeURIComponent(property.slug || property.id)}`,
      changeFrequency: "weekly",
      priority: 0.8,
      // Date de mise à jour facultative, si l'API la fournit.
      lastModified: property.updated_at ? new Date(property.updated_at) : undefined,
    })),
  ];
}
