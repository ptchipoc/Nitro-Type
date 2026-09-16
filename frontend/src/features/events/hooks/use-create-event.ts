import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent } from "../actions/mutations";
import { CreateEventInput } from "../actions/event.inputs";

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEventInput) => createEvent(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", "events-public"] });
    },
  });
}