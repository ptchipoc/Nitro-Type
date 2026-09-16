import { apiClient } from "@/features/apiClient";
import { friendRequestResponse } from "../type";

export async function acceptFriendship(id: string): Promise<friendRequestResponse> {
  const response = await apiClient<friendRequestResponse>(
    `/users/friends/${id}/accept`,
    { method: "POST" }
  );
  return response;
}
