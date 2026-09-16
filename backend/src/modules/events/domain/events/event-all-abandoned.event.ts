import { DomainEvent } from "@shared/entities/domain-event.base";

export class EventAllAbandonedEvent extends DomainEvent {
  constructor(public readonly eventId: string) {
    super("EVENT.ALL_ABANDONED");
  }
}
