import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  fetchCreateChannel,
  fetchDeleteChannel,
  fetchUpdateChannel,
} from "@/features/community/services/community.service";

import {
  CreateChannelInput,
  UpdateChannelInput,
} from "@/features/community/input/community.input";

import { communityKeys } from "../keys";

export function useCreateChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateChannelInput) =>
      fetchCreateChannel(input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.channelList(),
      });
    },
  });
}

export function useUpdateChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      channelId,
      input,
    }: {
      channelId: string;
      input: UpdateChannelInput;
    }) => fetchUpdateChannel(channelId, input),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.channelDetail(
          variables.channelId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: communityKeys.channelList(),
      });
    },
  });
}

export function useDeleteChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (channelId: string) =>
      fetchDeleteChannel(channelId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.channelList(),
      });
    },
  });
}