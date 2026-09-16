import { DomainEvent } from "@shared/entities/domain-event.base";

export class EventInviteEvent extends DomainEvent {
  constructor(
    public readonly recipientId: string,
    public readonly eventId: string,
    public readonly eventName: string,
  ) {
    super("EVENT.INVITE");
  }
}
