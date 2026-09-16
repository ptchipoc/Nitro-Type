import { apiClient } from "@/features/apiClient";
import { FriendPendentsFriendsResponse } from "../response/friend-pendents-friends.response";

export function getFriendPendentsFriends() {
  return apiClient<FriendPendentsFriendsResponse>("/users/friends/requests");
}