import { apiClient } from "@/features/apiClient";
import { UserResponse } from "../response/user.response";

export function getUser(userId: string) {
  return apiClient<UserResponse>(`/users/id?id=${userId}`);
}