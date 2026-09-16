import { apiClient } from "@/features/apiClient";
import { friendRequestResponse } from "../type";

export async function deleteFriend(friendshipId: string): Promise<friendRequestResponse> {
  const response = await apiClient<friendRequestResponse>(
    `/users/friends/${friendshipId}`,
    { method: "DELETE" }
  );
  return response;
}
