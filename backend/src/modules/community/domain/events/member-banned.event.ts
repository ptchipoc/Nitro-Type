import { DomainEvent } from "@shared/entities/domain-event.base";

export class MemberBannedEvent extends DomainEvent {
  public readonly channelId: string;
  public readonly userId: string;
  public readonly bannedBy: string;
  public readonly notifyChannel: boolean;

  constructor(
    channelId: string,
    userId: string,
    bannedBy: string,
    notifyChannel: boolean = true,
  ) {
    super("COMMUNITY.MEMBER_BANNED");
    this.channelId = channelId;
    this.userId = userId;
    this.bannedBy = bannedBy;
    this.notifyChannel = notifyChannel;
  }
}
