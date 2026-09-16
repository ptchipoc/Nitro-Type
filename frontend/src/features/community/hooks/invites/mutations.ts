import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { fetchAcceptInvite } from "@/features/community/services/community.service";

import { communityKeys } from "../keys";

export function useAcceptInvite() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (code: string) =>
            fetchAcceptInvite(code),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: communityKeys.channelList(),
            });

            queryClient.invalidateQueries({
                queryKey: communityKeys.inviteList(),
            });
        },
    });
}