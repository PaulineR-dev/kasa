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
