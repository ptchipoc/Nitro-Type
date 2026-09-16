import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitRoundResults } from "../actions/mutations";
import { SubmitRoundResultsInput } from "../actions/event.inputs";

export function useSubmitRoundResults() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, input }: { eventId: string; input: SubmitRoundResultsInput }) =>
      submitRoundResults(eventId, input),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["events", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events", eventId, "ranking"] });
    },
  });
}