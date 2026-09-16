import { DomainEvent } from "@shared/entities/domain-event.base";

export class EventStartedEvent extends DomainEvent {
  constructor(
    public readonly eventId: string,
    public readonly eventName: string,
  ) {
    super("EVENT.STARTED");
  }
}
