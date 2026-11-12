import { API_BASE_URL } from "./client";

/**
 * Récupère la liste des logements; la réponse est mise en cache une heure.
 * @returns {Promise<Array<Object>>} Logements disponibles.
 * @throws {Error} Si l'API renvoie un statut HTTP d'échec.
 */
export async function getProperties() {
  const response = await fetch(`${API_BASE_URL}/api/properties`, {
    next: { revalidate: 3600, tags: ["properties"] },
  });

  if (!response.ok) {
    throw new Error(`Properties API returned HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Recherche un logement par slug ou identifiant, puis récupère ses détails.
 * @param {string} slug Slug public ou identifiant du logement.
 * @returns {Promise<Object|null>} Logement détaillé, ou null s'il est introuvable.
 * @throws {Error} Si la requête API échoue pour une raison autre qu'une absence (404).
 */
export async function getPropertyBySlug(slug) {
  const properties = await getProperties();
  // L'API détail attend l'identifiant; la liste sert à résoudre le slug public vers cet identifiant.
  const summary = properties.find((property) => property.slug === slug || property.id === slug);

  if (!summary) return null;

  const response = await fetch(`${API_BASE_URL}/api/properties/${encodeURIComponent(summary.id)}`, {
    next: { revalidate: 3600, tags: ["properties", `property-${summary.id}`] },
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Property API returned HTTP ${response.status}`);
  }

  const details = await response.json();
  return { ...summary, ...details, slug: details.slug || summary.slug };
}
