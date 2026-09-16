import { useQuery } from "@tanstack/react-query";

import {
    fetchDMConversations,
    fetchDMMessages,
} from "@/features/community/services/community.service";

import {
    DMConversation,
    Message,
} from "@/features/community/types/community.type";

import { communityKeys } from "../keys";

export function useDMConversations() {
    return useQuery<DMConversation[]>({
        queryKey: communityKeys.dmList(),
        queryFn: fetchDMConversations,
    });
}

export function useDMMessages(
    dmId: string,
    limit?: number,
) {
    return useQuery<Message[]>({
        queryKey: communityKeys.dmMessages(dmId),

        queryFn: () =>
            fetchDMMessages(dmId, limit),

        enabled: !!dmId,
    });
}