import axios from "axios";
import { auth } from "./firebase";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001",
});

// The backend identifies the user from this Firebase ID token, never from
// emails or ids in the request body, so every call must carry it.
/** @returns {Promise<Record<string, string>>} */
export async function authHeaders() {
  // On a fresh page load Firebase restores the session asynchronously; wait
  // for it so early requests are not sent without a token.
  await auth.authStateReady();
  const token = await auth.currentUser?.getIdToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

api.interceptors.request.use(async (config) => {
  Object.assign(config.headers, await authHeaders());
  return config;
});

export default api;
