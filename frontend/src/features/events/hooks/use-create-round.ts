import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRound } from "../actions/mutations";
import { CreateRoundInput } from "../actions/event.inputs";

export function useCreateRound() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, input }: { eventId: string; input: CreateRoundInput }) =>
      createRound(eventId, input),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["events", eventId] });
    },
  });
}