const API_BASE_URL = (process.env.API_URL || "http://localhost:3000").replace(/\/$/, "");

export async function getProperties() {
  const response = await fetch(`${API_BASE_URL}/api/properties`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Properties API returned HTTP ${response.status}`);
  }

  return response.json();
}

export async function getPropertyBySlug(slug) {
  const properties = await getProperties();
  const summary = properties.find((property) => property.slug === slug || property.id === slug);

  if (!summary) return null;

  const response = await fetch(`${API_BASE_URL}/api/properties/${encodeURIComponent(summary.id)}`, {
    cache: "no-store",
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Property API returned HTTP ${response.status}`);
  }

  const details = await response.json();
  return { ...summary, ...details, slug: details.slug || summary.slug };
}
