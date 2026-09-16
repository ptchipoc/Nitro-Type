import { cn } from "@/lib/utils";
import { ActiveFilter, EventsFilterLabels } from "../types";
import { isSameFilter, TAB_CONFIG } from "../constants/events-filter.constants";

interface FilterTabsProps {
  activeFilter: ActiveFilter;
  onFilterChange: (filter: ActiveFilter) => void;
  labels: EventsFilterLabels["tabs"];
}

export function FilterTabs({
  activeFilter,
  onFilterChange,
  labels,
}: FilterTabsProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted/20 border border-border rounded-sm w-fit flex-wrap">
      {TAB_CONFIG.map(({ filter, labelKey }) => {
        const isActive = isSameFilter(activeFilter, filter);
        return (
          <button
            key={labelKey}
            onClick={() => onFilterChange(filter)}
            className={cn(
              "px-4 py-1.5 rounded-sm text-xs font-mono font-bold transition-all cursor-pointer",
              isActive
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
            )}
          >
            {labels[labelKey]}
          </button>
        );
      })}
    </div>
  );
}
