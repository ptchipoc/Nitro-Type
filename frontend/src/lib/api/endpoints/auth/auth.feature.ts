import { AuthResponse } from "@/lib/api/endpoints/auth/auth.response";
import { ApiSuccess } from "@/lib/api/api";
import { apiFetch } from "@/lib/api/client";
import { ApiRequestError } from "@/lib/api/errors";
import { INTERNAL_API_URL } from "../../config";

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

export function verifyEmailCode(input: { email: string; code: string }) {
  return apiFetch<AuthResponse>("/auth/verify/email", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function resendVerificationCode(email: string) {
  return apiFetch<ApiSuccess>("/auth/verify/resend", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function requestPasswordReset(email: string) {
  return apiFetch<ApiSuccess>("/auth/password/forgot", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(input: {
  email: string;
  code: string;
  newPassword: string;
}) {
  return apiFetch<ApiSuccess>("/auth/password/reset", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function signUpEmail(credentials: {
  name: string;
  email: string;
  password: string;
}) {
  return apiFetch<ApiSuccess>("/auth/sign-up/email", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

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
