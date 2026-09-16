import { DomainEvent } from "@shared/entities/domain-event.base";

export class ParticipantResultSubmittedEvent extends DomainEvent {
  constructor(
    public readonly eventId: string,
    public readonly userId: string,
    public readonly roundNumber: number,
    public readonly score: number,
    public readonly wpm: number,
    public readonly accuracy: number,
    public readonly completionRate: number,
    public readonly errorRate: number,
    public readonly completionTime: number,
  ) {
    super("EVENT.RESULT_SUBMITTED");
  }
}
