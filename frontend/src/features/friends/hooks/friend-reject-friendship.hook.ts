import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectFriendship } from "../actions/friend-reject-friendship.action";


export const friendRejectFriendshipHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rejectFriendship(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", "pendents"] });
    },
  });
};
