import { ApiEnvelope } from "../../api";
import { ApiUser } from "./user.type";

export type UserResponse = ApiEnvelope<ApiUser>;
export type UserListResponse = ApiEnvelope<ApiUser[]>;
