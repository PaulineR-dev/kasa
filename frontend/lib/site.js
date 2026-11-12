/**
 * Renvoie l'URL publique du site, sans barre oblique finale.
 * Utilise l'URL locale de développement si SITE_URL n'est pas configurée.
 * @returns {string} URL de base du site.
 */
export function getSiteUrl() {
  const configuredUrl = process.env.SITE_URL || "http://localhost:3001";
  return configuredUrl.replace(/\/$/, "");
}
