export function getSiteUrl() {
  const configuredUrl = process.env.SITE_URL || "http://localhost:3001";
  return configuredUrl.replace(/\/$/, "");
}
