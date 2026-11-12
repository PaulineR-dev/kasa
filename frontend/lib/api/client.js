/**
 * Base utilisée pour les appels API : même origine dans le navigateur (réécriture
 * Next.js), URL du serveur API lors d'un appel depuis le serveur.
 * @type {string}
 */
export const API_BASE_URL = typeof window === "undefined"
  ? (process.env.API_URL || "http://localhost:3000").replace(/\/$/, "")
  : "";

/**
 * Envoie un objet JSON à l'API et renvoie la réponse HTTP et son contenu JSON.
 * @param {string} path Chemin de l'API, par exemple `/auth/login`.
 * @param {Object} body Données à sérialiser en JSON.
 * @returns {Promise<{response: Response, result: Object}>} Réponse HTTP et corps décodé.
 */
export async function postJson(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json().catch(() => ({}));
  return { response, result };
}
