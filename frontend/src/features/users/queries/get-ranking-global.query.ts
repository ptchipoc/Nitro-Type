import { apiClient } from "@/features/apiClient";
import { UserListResponse } from "../response/user-list.response";

export function getRankingGlobal() {
  return apiClient<UserListResponse>("/users/rankingGlobal");
}
