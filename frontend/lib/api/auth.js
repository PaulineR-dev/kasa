import { API_BASE_URL, postJson } from "./client";

export async function registerUser({ name, email, password, role = "client" }) {
  return postJson("/auth/register", { name, email, password, role });
}

export async function loginUser({ email, password }) {
  return postJson("/auth/login", { email, password });
}
