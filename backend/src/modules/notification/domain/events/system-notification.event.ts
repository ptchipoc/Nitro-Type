import { DomainEvent } from "@shared/entities/domain-event.base";

export class SystemNotificationEvent extends DomainEvent {
  public readonly recipientId: string;
  public readonly action: "BANNED" | "BLOCKED" | "UNBLOCKED" | "GENERAL";
  public readonly reason?: string;
  constructor(
    recipientId: string,
    action: "BANNED" | "BLOCKED" | "UNBLOCKED" | "GENERAL",
    reason?: string,
  ) {
    super("system.notification");
    this.recipientId = recipientId;
    this.action = action;
    this.reason = reason;
  }
}
