import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptInvite } from "../actions/mutations";

export function useAcceptInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => acceptInvite(eventId),
    onSuccess: (_, eventId) => {
      // queryClient.invalidateQueries({
      //   queryKey: ["events", "events-public", eventId, "participants"],
      // });
      queryClient.refetchQueries({
        queryKey: ["events", eventId],
      });
    },
  });
}