import { apiClient } from "@/features/apiClient";
import { FriendListAllResponse } from "../response/friend-list-all.response";

export function getFriendListAll() {
  return apiClient<FriendListAllResponse>("/users/friends");
}
