import { DomainEvent } from "@shared/entities/domain-event.base";

export class BetweenRoundsEvent extends DomainEvent {
  constructor(
    public readonly eventId: string,
    public readonly delaySeconds: number,
    public readonly nextRoundNumber: number,
  ) {
    super("EVENT.BETWEEN_ROUNDS");
  }
}
