import { DomainEvent } from "@shared/entities/domain-event.base";

export class FriendRequestAcceptedEvent extends DomainEvent {
  constructor(
    public readonly senderId: string,
    public readonly receiverId: string,
    public readonly receiverName: string,
  ) {
    super("friend.request.accepted");
  }
}
