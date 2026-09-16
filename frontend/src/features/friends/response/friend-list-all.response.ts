import { ApiEnvelope } from "@/features/apiClient";
import { listFriends } from "../type";

export type FriendListAllResponse = ApiEnvelope<listFriends>;