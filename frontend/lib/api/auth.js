import { API_BASE_URL, postJson } from "./client";

/**
 * Crée un compte utilisateur via l'API d'authentification.
 * @param {{name: string, email: string, password: string, role?: string}} user Informations d'inscription.
 * @returns {Promise<{response: Response, result: Object}>} Réponse HTTP et corps JSON.
 */
export async function registerUser({ name, email, password, role = "client" }) {
  return postJson("/auth/register", { name, email, password, role });
}

/**
 * Authentifie un utilisateur via l'API.
 * @param {{email: string, password: string}} credentials Identifiants de connexion.
 * @returns {Promise<{response: Response, result: Object}>} Réponse HTTP et corps JSON.
 */
export async function loginUser({ email, password }) {
  return postJson("/auth/login", { email, password });
}
