import { apiClient } from "@/features/apiClient";
import { UserResponse } from "../response/user.response";

export function getMe() {
  return apiClient<UserResponse>("/users/me");
}