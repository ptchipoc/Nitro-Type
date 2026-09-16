import { useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleEvent } from "../actions/mutations";

export function useScheduleEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => scheduleEvent(eventId),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ["events", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}