import { DomainEvent } from "@shared/entities/domain-event.base";

export class MemberAddedEvent extends DomainEvent {
  public readonly channelId: string;
  public readonly userId: string;
  public readonly addedBy: string;

  constructor(channelId: string, userId: string, addedBy: string) {
    super("COMMUNITY.MEMBER_ADDED");
    this.channelId = channelId;
    this.userId = userId;
    this.addedBy = addedBy;
  }
}
