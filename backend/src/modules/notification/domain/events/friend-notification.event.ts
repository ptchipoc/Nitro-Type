import { DomainEvent } from "@shared/entities/domain-event.base";

export class FriendNotificationEvent extends DomainEvent {
  constructor(
    public readonly recipientId: string,
    public readonly action:
      | "FRIEND_REQUEST"
      | "FRIEND_ACCEPTED"
      | "FRIEND_REJECTED"
      | "FRIEND_REMOVED",
    public readonly senderName: string,
    public readonly extra?: Record<string, unknown>,
  ) {
    super("friend.notification");
  }
}
