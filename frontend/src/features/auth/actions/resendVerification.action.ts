import { apiClient, ApiSuccess } from "@/features/apiClient";

export function resendVerificationCode(email: string) {
  return apiClient<ApiSuccess>("/auth/verify/resend", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
