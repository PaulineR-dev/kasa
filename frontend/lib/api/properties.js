import { API_BASE_URL } from "./client";

export async function getProperties() {
  const response = await fetch(`${API_BASE_URL}/api/properties`, {
    next: { revalidate: 3600, tags: ["properties"] },
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
    next: { revalidate: 3600, tags: ["properties", `property-${summary.id}`] },
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Property API returned HTTP ${response.status}`);
  }

  const details = await response.json();
  return { ...summary, ...details, slug: details.slug || summary.slug };
}
