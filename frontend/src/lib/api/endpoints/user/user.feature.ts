import { UserListResponse, UserResponse } from "./user.response";
import { apiFetch } from "../../client";

export function getMe() {
  return apiFetch<UserResponse>("/users/me");
}

export function getUsers() {
  return apiFetch<UserListResponse>("/users");
}

export function getUsersBySearch(query: string) {
  return apiFetch<UserListResponse>(
    `/users/search/${encodeURIComponent(query)}`,
  );
}
