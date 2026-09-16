import { DomainEvent } from "@shared/entities/domain-event.base";

export class FriendRequestCancelledEvent extends DomainEvent {
  constructor(
    public readonly senderId: string,
    public readonly receiverId: string,
    public readonly senderName: string,
  ) {
    super("friend.request.cancelled");
  }
}
