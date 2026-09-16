import { EventStatus, EventType } from "@/features/events/types";
import { ActiveFilter, EventsFilterLabels } from "../types";

export type TabConfig = {
  filter: ActiveFilter;
  labelKey: keyof EventsFilterLabels["tabs"];
};

export const TAB_CONFIG: TabConfig[] = [
  { filter: { kind: "ALL" }, labelKey: "ALL" },
  { filter: { kind: "STATUS", status: EventStatus.ACTIVE }, labelKey: "ACTIVE"},
  { filter: { kind: "STATUS", status: EventStatus.FINISHED }, labelKey: "FINISHED"},
  { filter: { kind: "MINE" }, labelKey: "MINE" },
];

// Helper para comparar filtros (sem deep-equal lib)
export function isSameFilter(a: ActiveFilter, b: ActiveFilter): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === "TYPE" && b.kind === "TYPE") return a.type === b.type;
  if (a.kind === "STATUS" && b.kind === "STATUS") return a.status === b.status;
  return true; // ALL e MINE só têm kind
}
