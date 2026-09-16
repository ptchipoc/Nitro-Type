import { apiClient } from "@/features/apiClient";
import { friendRequestResponse } from "../type";

export async function sendFriendRequest(userId: string): Promise<friendRequestResponse> {
  const response = await apiClient<friendRequestResponse>(
    `/users/friends/request`,
    {
      method: "POST",
      body: JSON.stringify({ receiverId: userId }),
    }
  );
  return response;
}
