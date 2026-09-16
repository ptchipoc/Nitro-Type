import { useQuery } from "@tanstack/react-query";

import { fetchPresence } from "@/features/community/services/community.service";

import { UserPresence } from "@/features/community/types/community.type";

import { communityKeys } from "../keys";

export function usePresence(userId: string) {
    return useQuery<UserPresence>({
        queryKey: communityKeys.presence(userId),

        queryFn: () =>
            fetchPresence(userId),

        enabled: !!userId,
    });
}