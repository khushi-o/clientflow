/** Vite exposes only variables prefixed with VITE_. Set in .env / .env.production */
export const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function originFromApiBase() {
  try {
    const u = new URL(API_BASE);
    return u.origin;
  } catch {
    return "http://localhost:5000";
  }
}

/** Socket.io connects to the API host (no /api path). */
export function getSocketUrl() {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  return originFromApiBase();
}
