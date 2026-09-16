import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptFriendship } from "../actions/friend-accept-friendship.action";

export const friendAcceptFriendshipHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => acceptFriendship(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", "pendents"] });
      queryClient.invalidateQueries({ queryKey: ["friends", "list-all"] });
    },
  });
};
