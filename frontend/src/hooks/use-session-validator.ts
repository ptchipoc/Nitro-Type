"use client";

import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { API_URL } from "@/lib/api/config";

/**
 * Hook that validates the backend session is still alive.
 * If the NextAuth JWT is valid but the backend session (cookies) expired,
 * this forces a client-side logout to sync the frontend state.
 *
 * Should be placed in the (private) layout so it runs on every private page.
 */
export function useSessionValidator() {
  const { status } = useSession();
  const checkedRef = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || checkedRef.current) return;
    checkedRef.current = true;

    const controller = new AbortController();

    fetch(`${API_URL}/users/me`, {
      credentials: "include",
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok && (res.status === 401 || res.status === 403 || res.status === 404 || res.status === 500)) {
          // Backend doesn't recognize the session or user no longer exists — force logout
          signOut({ callbackUrl: "/login" });
        }
      })
      .catch(() => {
        // Network error or abort — do nothing
      });

    return () => {
      controller.abort();
    };
  }, [status]);
}
