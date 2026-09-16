import { DomainEvent } from "@shared/entities/domain-event.base";

export class MessageEditedEvent extends DomainEvent {
  public readonly messageId: string;
  public readonly channelId: string | undefined;
  public readonly dmId: string | undefined;
  public readonly authorId: string;
  public readonly content: string;

  constructor(
    messageId: string,
    channelId: string | undefined,
    dmId: string | undefined,
    authorId: string,
    content: string,
  ) {
    super("COMMUNITY.MESSAGE_EDITED");
    this.messageId = messageId;
    this.channelId = channelId;
    this.dmId = dmId;
    this.authorId = authorId;
    this.content = content;
  }
}
