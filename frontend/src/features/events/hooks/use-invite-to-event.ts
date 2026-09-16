import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inviteToEvent } from "../actions/mutations";
import { InviteToEventInput } from "../actions/event.inputs";

export function useInviteToEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, input }: { eventId: string; input: InviteToEventInput }) =>
      inviteToEvent(eventId, input),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["events", eventId, "participants"] });
    },
  });
}