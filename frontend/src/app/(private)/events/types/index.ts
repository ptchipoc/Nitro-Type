import { EventStatus, EventType } from "@/features/events/types";

export type EventsFilterLabels = {
  tabs: {
    ALL: string;
    PUBLIC: string;
    PRIVATE: string;
    SCHEDULED: string;
    ACTIVE: string;
    FINISHED: string;
    MINE: string;
  };
  searchPlaceholder: string;
  filters: string;
  createEvent: string;
};

export type ActiveFilter =
  | { kind: "ALL" }
  | { kind: "TYPE"; type: EventType }
  | { kind: "STATUS"; status: EventStatus }
  | { kind: "MINE" };

export interface EventsFilterProps {
  activeFilter: ActiveFilter;
  onFilterChange: (filter: ActiveFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  labels: EventsFilterLabels;
  onCreateEvent?: () => void;
}
