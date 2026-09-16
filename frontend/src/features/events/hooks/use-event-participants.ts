import { useQuery } from "@tanstack/react-query";
import { getEventParticipants } from "../queries/query.get";

export function useEventParticipants(eventId: string) {
  return useQuery({
    queryKey: ["events", eventId, "participants"],
    queryFn: () => getEventParticipants(eventId),
    enabled: !!eventId,
  });
}