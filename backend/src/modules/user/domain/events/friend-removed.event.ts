import { DomainEvent } from "@shared/entities/domain-event.base";

export class FriendRemovedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly friendId: string,
    public readonly userName: string,
  ) {
    super("friend.removed");
  }
}
