// Le navigateur passe par les réécritures Next.js; le serveur appelle l'API directement.
const API_BASE_URL = typeof window === "undefined"
  ? (process.env.BACKEND_URL || process.env.API_URL || "http://localhost:3000").replace(/\/$/, "")
  : "";

/** Réessaie brièvement lorsqu'une instance backend répond avant la fin de l'initialisation SQLite. */
async function fetchPropertiesApi(url, options) {
  let response = await fetch(url, options);

  for (let attempt = 0; response.status === 503 && attempt < 3; attempt += 1) {
    // La base devient généralement disponible juste après le démarrage de l'instance backend.
    await new Promise((resolve) => setTimeout(resolve, 150 * (attempt + 1)));

    // Ne pas réutiliser une éventuelle réponse d'erreur mise en cache lors de la première tentative.
    const retryOptions = { ...options, cache: "no-store" };
    delete retryOptions.next;
    response = await fetch(url, retryOptions);
  }

  return response;
}

/**
 * Récupère la liste des logements; la réponse est mise en cache une heure.
 * @returns {Promise<Array<Object>>} Logements disponibles.
 * @throws {Error} Si l'API renvoie un statut HTTP d'échec.
 */
export async function getProperties() {
  const response = await fetchPropertiesApi(`${API_BASE_URL}/api/properties`, {
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

  const response = await fetchPropertiesApi(`${API_BASE_URL}/api/properties/${encodeURIComponent(summary.id)}`, {
    next: { revalidate: 3600, tags: ["properties", `property-${summary.id}`] },
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Property API returned HTTP ${response.status}`);
  }

  const details = await response.json();
  return { ...summary, ...details, slug: details.slug || summary.slug };
}
