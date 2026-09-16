import { apiClient } from "@/features/apiClient";
import { friendRequestResponse } from "../type";
import { tr } from "date-fns/locale";

export async function rejectFriendship(id: string): Promise<friendRequestResponse> {
    const response = await apiClient<friendRequestResponse>(
        `/users/friends/${id}/reject`,
        { method: "POST" }
    );
    return response;
}
