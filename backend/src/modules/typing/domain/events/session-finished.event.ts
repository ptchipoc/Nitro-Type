import { DomainEvent } from "@shared/entities/domain-event.base";
import { SessionMode } from "@shared/entities/enums/session";

export class SessionFinishedEvent extends DomainEvent {
  public readonly sessionId: string;
  public readonly mode: SessionMode;

  constructor(sessionId: string, mode: SessionMode) {
    super("TYPING.SESSION_FINISHED");
    this.sessionId = sessionId;
    this.mode = mode;
  }
}
