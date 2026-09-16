import { apiClient, ApiSuccess } from "@/features/apiClient";

export function resetPassword(input: {
  email: string;
  code: string;
  newPassword: string;
}) {
  return apiClient<ApiSuccess>("/auth/password/reset", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
