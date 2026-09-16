import { apiClient, ApiSuccess } from "@/features/apiClient";

export function requestPasswordReset(email: string) {
  return apiClient<ApiSuccess>("/auth/password/forgot", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
