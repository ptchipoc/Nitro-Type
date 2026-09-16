import { apiClient } from "@/features/apiClient";
import { UserGetAllResponse } from "../response/user-get-all.response";
import { useQuery } from "@tanstack/react-query";

export function useUserGetAll() {
  return useQuery<UserGetAllResponse>({
    queryKey: ["users", "get-all"],
    queryFn: () => apiClient<UserGetAllResponse>(`/users`),
  });
}
