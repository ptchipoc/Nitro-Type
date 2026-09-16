import { useQuery } from "@tanstack/react-query";

import { fetchChannelMessages } from "@/features/community/services/community.service";

import { Message } from "@/features/community/types/community.type";

import { communityKeys } from "../keys";

export function useChannelMessages(
  channelId: string,
  limit?: number,
) {
  return useQuery<Message[]>({
    queryKey: communityKeys.channelMessages(channelId),

    queryFn: () =>
      fetchChannelMessages(channelId, limit),

    enabled: !!channelId,
    // refetchInterval: 5000,
  });
}