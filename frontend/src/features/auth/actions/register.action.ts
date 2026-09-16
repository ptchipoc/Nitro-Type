import { apiClient, ApiSuccess } from "@/features/apiClient";
import { RegisterInput } from "../inputs/register.input";

export function registerAction(input: RegisterInput) {
  return apiClient<ApiSuccess>(`/auth/sign-up/email`, {
    method: "POST",
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      password: input.password,
    }),
  });
}