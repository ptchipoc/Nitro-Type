import { DomainEvent } from "@shared/entities/domain-event.base";

export class RoundFinishedEvent extends DomainEvent {
  constructor(
    public readonly eventId: string,
    public readonly roundNumber: number,
  ) {
    super("EVENT.ROUND_FINISHED");
  }
}
