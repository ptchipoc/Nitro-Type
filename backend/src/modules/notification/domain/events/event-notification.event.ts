import { DomainEvent } from "@shared/entities/domain-event.base";

export class EventNotificationEvent extends DomainEvent {
  public readonly recipientId: string;
  public readonly action:
    | "EVENT_INVITE"
    | "EVENT_ACCEPTED"
    | "EVENT_STARTED"
    | "EVENT_RESULT";
  public readonly eventId: string;
  public readonly eventName: string;
  public readonly extra?: Record<string, unknown>;
  public readonly message?: string;
  constructor(
    recipientId: string, //
    action:
      | "EVENT_INVITE"
      | "EVENT_ACCEPTED"
      | "EVENT_STARTED"
      | "EVENT_RESULT",
    eventId: string,
    eventName: string,
    message?: string,
    extra?: Record<string, unknown>,
  ) {
    super("EVENT.NOTIFICATION");
    this.recipientId = recipientId;
    this.action = action;
    this.eventId = eventId;
    this.eventName = eventName;
    this.extra = extra;
    this.message = message;
  }
}
