import { DomainEvent } from "@shared/entities/domain-event.base";

export class MemberRemovedEvent extends DomainEvent {
  public readonly channelId: string;
  public readonly userId: string;
  public readonly removedBy: string;
  public readonly notifyChannel: boolean;

  constructor(
    channelId: string,
    userId: string,
    removedBy: string,
    notifyChannel: boolean = true,
  ) {
    super("COMMUNITY.MEMBER_REMOVED");
    this.channelId = channelId;
    this.userId = userId;
    this.removedBy = removedBy;
    this.notifyChannel = notifyChannel;
  }
}
