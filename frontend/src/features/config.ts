const IS_SERVER = typeof window === "undefined";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
export const PRIVATE_API_URL = process.env.NEXT_PRIVATE_API_URL;

/**
 * Parses SOCKET_URL (e.g. "https://localhost:3000/backend") into:
 *  - origin: "https://localhost:3000"          (for socket.io server)
 *  - path:   "/backend/socket.io/"             (so nginx proxies to backend)
 *
 * This is needed because socket.io's default path `/socket.io/` would hit
 * the nginx root location (frontend), not `/backend/` (backend).
 */
export function getSocketConfig() {
  const raw = SOCKET_URL || "https://localhost:3000/backend";
  try {
    const url = new URL(raw);
    const prefix = url.pathname.replace(/\/+$/, ""); // e.g. "/backend"
    return {
      origin: url.origin,                             // "https://localhost:3000"
      path: `${prefix}/socket.io/`.replace(/\/\/+/g, "/"), // "/backend/socket.io/"
    };
  } catch {
    // Fallback: assume raw is already an origin
    return { origin: raw, path: "/socket.io/" };
  }
}
