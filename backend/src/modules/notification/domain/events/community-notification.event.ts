import { DomainEvent } from "@shared/entities/domain-event.base";

export class CommunityNotificationEvent extends DomainEvent {
  constructor(
    public readonly recipientId: string,
    public readonly action: "CHANNEL_INVITE" | "CHANNEL_KICK" | "ROLE_UPDATED",
    public readonly channelId: string,
    public readonly channelName: string,
    public readonly extra?: Record<string, unknown>,
  ) {
    super("community.notification");
  }
}
