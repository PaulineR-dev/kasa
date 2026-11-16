/**
 * Renvoie l'URL publique du site, sans barre oblique finale.
 * Utilise l'URL locale en développement et le domaine public sur Vercel si SITE_URL manque.
 * @returns {string} URL de base du site.
 */
export function getSiteUrl() {
  const isProduction = process.env.NODE_ENV === "production";
  const configuredUrl = process.env.SITE_URL?.trim();
  const localUrl = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(configuredUrl || "");
  const defaultUrl = isProduction ? "https://kasa-eta-ruby.vercel.app" : "http://localhost:3001";
  const siteUrl = !configuredUrl || (isProduction && localUrl) ? defaultUrl : configuredUrl;

  return siteUrl.replace(/\/$/, "");
}
