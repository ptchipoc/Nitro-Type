import { DomainEvent } from "@shared/entities/domain-event.base";

export class EventFinishedEvent extends DomainEvent {
  constructor(
    public readonly eventId: string,
    public readonly eventName: string,
  ) {
    super("EVENT.FINISHED");
  }
}
