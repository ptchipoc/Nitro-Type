import { DomainEvent } from "@shared/entities/domain-event.base";

export class RoundStartedEvent extends DomainEvent {
  constructor(
    public readonly eventId: string,
    public readonly roundNumber: number,
    public readonly timeLimitSeconds: number,
    public readonly wordCount: number,
    public readonly text: string,
    public readonly category: string,
    public readonly difficulty: string,
  ) {
    super("EVENT.ROUND_STARTED");
  }
}
