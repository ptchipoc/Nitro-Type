import { apiClient } from "@/features/apiClient";
import { SendFriendRequestInput } from "../inputs/friend-friendship-request.inputs";

export const sendFriendRequestAction = (receiverId: string) => {
    // console.log("sendFriendRequestAction called with receiverId:", receiverId);
    const input: SendFriendRequestInput = { receiverId };
    // console.log("Input for sending friend request:", input);
    return apiClient("/users/friends/request", {
        method: "POST",
        body: JSON.stringify(input),
    });
}