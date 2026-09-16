import { apiClient } from "@/features/apiClient";
import { UserGetAllResponse } from "../response/user-get-all.response";

export function getUserGetAll() {
  return apiClient<UserGetAllResponse>(`/users`);
}