import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startEvent } from "../actions/mutations";

export function useStartEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => startEvent(eventId),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ["events", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}