import { DomainEvent } from "@shared/entities/domain-event.base";

export class ReactionAddedEvent extends DomainEvent {
  public readonly messageId: string;
  public readonly userId: string;
  public readonly emoji: string;

  constructor(messageId: string, userId: string, emoji: string) {
    super("COMMUNITY.REACTION_ADDED");
    this.messageId = messageId;
    this.userId = userId;
    this.emoji = emoji;
  }
}
