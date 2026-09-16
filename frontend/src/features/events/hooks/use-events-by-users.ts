import { useQuery } from "@tanstack/react-query";
import { getTotalWinsByUser } from "../queries/query.get";

export function useTotalWinsByUser(eventId: string) {
  return useQuery({
    queryKey: ["events", eventId, "total-win"],
    queryFn: () => getTotalWinsByUser(eventId),
  });
}
