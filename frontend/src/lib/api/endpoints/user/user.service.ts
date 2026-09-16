import { getMe, getUsers, getUsersBySearch } from "./user.feature";

export async function fetchUserMe() {
  const response = await getMe();
  if (!response.success) {
    throw new Error("Failed to fetch user");
  }
  return response.data;
}

export async function fetchUsers() {
  const response = await getUsers();
  if (!response.success) {
    throw new Error("Failed to fetch users");
  }
  return response.data;
}

export async function fetchUsersBySearch(query: string) {
  const response = await getUsersBySearch(query);
  if (!response.success) {
    throw new Error("Failed to search users");
  }
  return response.data;
}
