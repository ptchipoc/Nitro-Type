import { DomainEvent } from "@shared/entities/domain-event.base";

export class SessionStartedEvent extends DomainEvent {
  public readonly sessionId: string;
  public readonly creatorId: string;
  public readonly timeLimitSeconds: number;

  constructor(sessionId: string, creatorId: string, timeLimitSeconds: number) {
    super("TYPING.SESSION_STARTED");
    this.sessionId = sessionId;
    this.creatorId = creatorId;
    this.timeLimitSeconds = timeLimitSeconds;
  }
}
