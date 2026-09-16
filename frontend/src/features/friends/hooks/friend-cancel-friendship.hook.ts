import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelFriendship } from "../queries/friend-cancel-friendship.query";

export const friendCancelFriendshipHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => cancelFriendship(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", "pendents"] });
    },
  });
};
