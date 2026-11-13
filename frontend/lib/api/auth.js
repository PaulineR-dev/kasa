// Dans le navigateur, Next.js relaie ces chemins relatifs vers le serveur API.
const API_BASE_URL = typeof window === "undefined"
  ? (process.env.API_URL || "http://localhost:3000").replace(/\/$/, "")
  : "";

/** Envoie les identifiants au chemin d'authentification demandé. */
async function postAuthJson(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json().catch(() => ({}));
  return { response, result };
}

/**
 * Crée un compte utilisateur via l'API d'authentification.
 * @param {{name: string, email: string, password: string, role?: string}} user Informations d'inscription.
 * @returns {Promise<{response: Response, result: Object}>} Réponse HTTP et corps JSON.
 */
export async function registerUser({ name, email, password, role = "client" }) {
  return postAuthJson("/auth/register", { name, email, password, role });
}

/**
 * Authentifie un utilisateur via l'API.
 * @param {{email: string, password: string}} credentials Identifiants de connexion.
 * @returns {Promise<{response: Response, result: Object}>} Réponse HTTP et corps JSON.
 */
export async function loginUser({ email, password }) {
  return postAuthJson("/auth/login", { email, password });
}
