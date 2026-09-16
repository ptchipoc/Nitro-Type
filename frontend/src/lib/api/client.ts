import { API_URL } from "./config";
import { ApiRequestError } from "./errors";
import { signOut } from "next-auth/react";

let isSigningOut = false;

function handleSessionExpired() {
  if (isSigningOut) return;
  isSigningOut = true;
  signOut({ callbackUrl: "/login" }).finally(() => {
    isSigningOut = false;
  });
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));

    // Session expired: backend returns 401 for auth, or 404 specifically for the user profile
    if (res.status === 401 || (res.status === 404 && path === "/users/me")) {
      handleSessionExpired();
      return undefined as unknown as T;
    }

    throw new ApiRequestError(
      res.status,
      body?.error?.message || res.statusText,
      path,
    );
  }

  return res.json();
}
