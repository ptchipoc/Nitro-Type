import { apiClient } from "@/features/apiClient";
import { AuthResponse } from "../responses/auth.response";

export function verifyEmailCode(input: { email: string; code: string }) {
  return apiClient<AuthResponse>("/auth/verify/email", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
