import { apiServer, ApiSuccess } from "@/features/apiServer";

export function logoutAction() {
  return apiServer<ApiSuccess>(`/auth/sign-out`, {
    method: "POST",
  });
}
