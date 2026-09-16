import { DomainEvent } from "@shared/entities/domain-event.base";

export class MessageSentEvent extends DomainEvent {
  public readonly messageId: string;
  public readonly channelId: string | undefined;
  public readonly dmId: string | undefined;
  public readonly senderId: string;

  constructor(
    messageId: string,
    channelId: string | undefined,
    dmId: string | undefined,
    senderId: string,
  ) {
    super("COMMUNITY.MESSAGE_SENT");
    this.messageId = messageId;
    this.channelId = channelId;
    this.dmId = dmId;
    this.senderId = senderId;
  }
}
