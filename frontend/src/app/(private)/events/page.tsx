"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/header";
import { useTranslation } from "@/lib/i18n";

import { EventsList } from "./components/EventsList";
import { NoEvents } from "./components/NoEvents";
import { EventsCarousel } from "@/features/events/components/EventsCarousel";
import { useEvents } from "@/features/events/hooks/use-events";
import { EventStatus, EventType, TypingEvent } from "@/features/events/types";
import { useParams, useRouter } from "next/navigation";
import { ActiveFilter } from "./types";
import { labelsByLocale } from "./constants/labels.locale";
import { EventsFilter } from "./components/events-filter";
import { CursorGlow } from "@/components/cursor-glow";

function deriveApiParams(filter: ActiveFilter): {
  status: EventStatus | undefined;
  type: EventType | undefined;
  mine: boolean;
} {
  switch (filter.kind) {
    case "ALL":
      return { status: undefined, type: undefined, mine: false };
    case "TYPE":
      return { status: undefined, type: filter.type, mine: false };
    case "STATUS":
      return { status: filter.status, type: undefined, mine: false };
    case "MINE":
      return { status: undefined, type: undefined, mine: true };
  }
}

export default function EventsPage() {
  const router = useRouter();
  const { locale } = useTranslation();
  const { data: session } = useSession();
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>({
    kind: "ALL",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const { status, type, mine } = deriveApiParams(activeFilter);
  // Para "mine", ainda buscamos todos os eventos e filtramos client-side
  const { data: result, isLoading, isError } = useEvents(status, type);
  const { id: eventId } = useParams() as { id: string };

  const events = result?.data ?? [];
  const labels = labelsByLocale[locale];
  const currentUserId = session?.user?.id;

  // Aplicar filtros corretamente
  let filteredEvents: TypingEvent[] = events;

  // Filtro por status (apenas para STATUS filter)
  if (activeFilter.kind === "STATUS") {
    filteredEvents = filteredEvents.filter((event) => event.status === activeFilter.status);
  }

  // Filtro por tipo (apenas para TYPE filter)
  if (activeFilter.kind === "TYPE") {
    filteredEvents = filteredEvents.filter((event) => event.type === activeFilter.type);
  }

  // Filtro por eventos do usuário (mine)
  if (activeFilter.kind === "MINE" && currentUserId) {
    filteredEvents = filteredEvents.filter((event) => event.creatorId === currentUserId);
  }

  // Filtro de search client-side
  if (searchQuery.trim()) {
    filteredEvents = filteredEvents.filter((event) => {
      const q = searchQuery.toLowerCase();
      return (
        event.name.toLowerCase().includes(q) ||
        event.description?.toLowerCase().includes(q)
      );
    });
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono text-destructive">
        <p className="text-center">
          Failed to load events. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <Header />
      <CursorGlow />
      <main className="flex-1 pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full">

        <EventsFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          labels={labels}
          onCreateEvent={() => router.push("/events/create")}
        />

        {!isLoading && filteredEvents.length > 0 ? (
          <EventsList events={filteredEvents} />
        ) : (
          <NoEvents labels={labels} />
        )}
      </main>
    </div>
  );
}
