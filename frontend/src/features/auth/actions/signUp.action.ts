import { apiClient, ApiSuccess } from "@/features/apiClient";

export function signUpEmail(credentials: {
  name: string;
  email: string;
  password: string;
}) {
  return apiClient<ApiSuccess>("/auth/sign-up/email", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}
