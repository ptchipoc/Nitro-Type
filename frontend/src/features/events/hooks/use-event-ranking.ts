import { useQuery } from "@tanstack/react-query";
import { getEventRanking } from "../queries/query.get";

export function useEventRanking(eventId: string) {
  return useQuery({
    queryKey: ["events", eventId, "ranking"],
    queryFn: () => getEventRanking(eventId),
    enabled: !!eventId,
  });
}