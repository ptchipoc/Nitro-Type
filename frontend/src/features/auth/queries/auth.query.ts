import { AuthResponse } from "../responses/auth.response";
import { ApiRequestError } from "@/lib/api/errors";
import { INTERNAL_API_URL } from "@/lib/api/config";

/**
 * Sign in with email and password
 * Uses INTERNAL_API_URL because it's called from server-side (auth.ts)
 */
export async function signInEmail(credentials: {
  email: string;
  password: string;
}) {
  const response = await fetch(`${INTERNAL_API_URL}/auth/sign-in/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new ApiRequestError(
      response.status,
      data?.error?.message || response.statusText,
      "/auth/sign-in/email",
    );
  }

  return {
    ...(data as AuthResponse),
    _rawHeaders: response.headers,
  };
}

/**
 * Sign in with OAuth provider
 * Uses INTERNAL_API_URL because it's called from server-side (auth.ts)
 */
export async function signInProvider(credentials: {
  provider: string;
  providerId: string;
  name: string;
  email: string;
  emailVerified: boolean;
  avatarUrl?: string;
}) {
  const response = await fetch(`${INTERNAL_API_URL}/auth/provider`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new ApiRequestError(
      response.status,
      data?.error?.message || response.statusText,
      "/auth/provider",
    );
  }

  return {
    ...(data as AuthResponse),
    _rawHeaders: response.headers,
  };
}
