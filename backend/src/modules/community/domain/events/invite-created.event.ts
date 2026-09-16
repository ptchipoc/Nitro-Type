import { DomainEvent } from "@shared/entities/domain-event.base";

export class InviteCreatedEvent extends DomainEvent {
  public readonly channelId: string;
  public readonly invitedUserId: string;
  public readonly code: string;

  constructor(channelId: string, invitedUserId: string, code: string) {
    super("COMMUNITY.INVITE_CREATED");
    this.channelId = channelId;
    this.invitedUserId = invitedUserId;
    this.code = code;
  }
}
