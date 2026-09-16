import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../queries/query.get";
import { EventStatus, EventType } from "../types";

export function useEvents(status?: EventStatus, type?: EventType) {
  return useQuery({
    queryKey: ["events", status, type],
    queryFn: () => getEvents(status, type),
    
  });
}