import { useQuery } from "@tanstack/react-query";
import { getPublicEvents } from "../queries/query.get";

export function usePublicEvents() {
  return useQuery({
    queryKey: ["events-public"],
    queryFn: () => getPublicEvents(),
  });
}