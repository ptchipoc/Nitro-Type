import { useQuery } from "@tanstack/react-query";

import {
  fetchChannel,
  fetchChannels,
} from "@/features/community/services/community.service";

import { Channel } from "@/features/community/types/community.type";

import { communityKeys } from "../keys";

export function useChannels() {
  return useQuery<{
    private: Channel[];
    public: Channel[];
  }>({
    queryKey: communityKeys.channelList(),
    queryFn: fetchChannels,
    staleTime: 1000 * 60,
  });
}

export function useChannel(channelId: string) {
  return useQuery<Channel>({
    queryKey: communityKeys.channelDetail(channelId),
    queryFn: () => fetchChannel(channelId),
    enabled: !!channelId,
  });
}