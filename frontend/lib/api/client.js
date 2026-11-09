// Browser requests use the same-origin Next rewrite. Server-side requests
// target the backend origin directly.
export const API_BASE_URL = typeof window === "undefined"
  ? (process.env.API_URL || "http://localhost:3000").replace(/\/$/, "")
  : "";

export async function postJson(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json().catch(() => ({}));
  return { response, result };
}
