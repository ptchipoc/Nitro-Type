"use client";

import { EventsFilterProps } from "../types";
import { FilterActions } from "./filter-actions";
import { FilterTabs } from "./filter-tabs";
import { SearchBar } from "./search-bar";

export function EventsFilter({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  labels,
  onCreateEvent,
}: EventsFilterProps) {
  return (
    <section className="sticky top-[64px] z-30 bg-background/80 backdrop-blur-md py-4 mb-8 border-b border-border">
      <div className="flex flex-col gap-4">
        {/* Tabs — linha própria pois agora são 7 */}
        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
          labels={labels.tabs}
        />
        {/* Search + Actions */}
        <div className="flex items-center gap-3">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder={labels.searchPlaceholder}
          />
          <FilterActions
            filtersLabel={labels.filters}
            createEventLabel={labels.createEvent}
            onCreateEvent={onCreateEvent}
          />
        </div>
      </div>
    </section>
  );
}
