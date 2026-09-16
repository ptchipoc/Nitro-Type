import { DomainEvent } from "@shared/entities/domain-event.base";

export class DmNotificationEvent extends DomainEvent {
  constructor(
    public readonly recipientId: string,
    public readonly senderId: string,
    public readonly senderUsername: string,
    public readonly preview: string,
  ) {
    super("dm.notification");
  }
}
