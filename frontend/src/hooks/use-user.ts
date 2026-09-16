import { fetchUserMe } from "@/lib/api/endpoints/user/user.service";
import {
  ApiUser,
  UserRole,
  UserStatus,
} from "@/lib/api/endpoints/user/user.type";
import { useQuery } from "@tanstack/react-query";

export const userKeys = {
  all: ["user"] as const,
  me: () => [...userKeys.all, "me"] as const,
};

export function useUser() {
  return useQuery<ApiUser>({
    queryKey: userKeys.me(),
    queryFn: fetchUserMe,
    staleTime: 1000 * 60 * 5, // 5 min — não vai buscar de novo em cada render
    gcTime: 1000 * 60 * 10, // 10 min no cache depois de unmount
    retry: 1, // tenta 1x antes de dar pau
    refetchOnWindowFocus: false, // não refetch cada vez que o user volta ao tab
  });
}

export function useUserRole() {
  const { data } = useUser();
  return data?.role ?? null;
}

export function useUserProfile() {
  const { data } = useUser();
  return data?.profile ?? null;
}

export function useIsAdmin() {
  const role = useUserRole();
  return role === UserRole.ADMIN;
}

export function useIsProvider() {
  const role = useUserRole();
  return role === UserRole.PROVIDER;
}

export function useIsActiveUser() {
  const { data } = useUser();
  return data?.status === UserStatus.ACTIVE;
}
