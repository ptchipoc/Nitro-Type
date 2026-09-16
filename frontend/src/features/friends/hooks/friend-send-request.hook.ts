import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendFriendRequestAction } from "../actions/friend-send-request.action";

export const useFriendSendRequestHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => sendFriendRequestAction(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", "pendents"] });
    },
  });
};
