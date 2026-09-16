import { apiClient } from "@/features/apiClient";
import { friendRequestResponse } from "../type";

export async function cancelFriendship(requestId: string): Promise<friendRequestResponse> {
  const response = await apiClient<friendRequestResponse>(
    `/users/friends/requests/${requestId}`,
    { method: "DELETE" }
  );
  return response;
}
