import { ApiEnvelope } from "@/features/apiClient";
import { ApiUser } from "../type";

export type UserListResponse = ApiEnvelope<ApiUser[]>;
