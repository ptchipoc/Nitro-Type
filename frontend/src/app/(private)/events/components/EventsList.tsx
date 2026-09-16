"use client";

import { EventCard } from "@/features/events/components/EventCard";
import { TypingEvent } from "@/features/events/types";
interface EventsListProps {
  events: TypingEvent[];
}

export function EventsList({ events }: EventsListProps) {
  
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, i) => (
          <EventCard key={event.id} event={event} index={i} />
        ))}
      </div>
    </section>
  );
}
