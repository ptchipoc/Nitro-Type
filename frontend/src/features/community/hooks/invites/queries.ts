import { useQuery } from "@tanstack/react-query";

import { fetchMyInvites } from "@/features/community/services/community.service";

import { ChannelInvite } from "@/features/community/types/community.type";

import { communityKeys } from "../keys";

export function useMyInvites() {
    return useQuery<ChannelInvite[]>({
        queryKey: communityKeys.inviteList(),
        queryFn: fetchMyInvites,
    });
}