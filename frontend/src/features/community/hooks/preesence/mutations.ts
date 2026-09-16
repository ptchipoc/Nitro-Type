import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { fetchUpdatePresence } from "@/features/community/services/community.service";

import { UpdatePresenceInput } from "@/features/community/input/community.input";

import { communityKeys } from "../keys";

export function useUpdatePresence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdatePresenceInput) =>
      fetchUpdatePresence(input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.all,
      });
    },
  });
}