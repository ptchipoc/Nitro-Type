import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFriend } from "../queries/friend-delete.query";

export const usefriendDeleteHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (friendshipId: string) => deleteFriend(friendshipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", "list-all"] });
    },
  });
};
