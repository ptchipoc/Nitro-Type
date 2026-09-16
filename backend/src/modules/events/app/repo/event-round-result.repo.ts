import { EventRoundResultEntity } from "../../domain/entities/event-round-result.entity";

export abstract class EventRoundResultRepository {
  abstract save(result: EventRoundResultEntity): Promise<void>;
  abstract findByEventAndUser(
    eventId: string,
    userId: string,
  ): Promise<EventRoundResultEntity[]>;
  abstract findByEvent(eventId: string): Promise<EventRoundResultEntity[]>;
  abstract findByRoundNumber(
    roundNumber: number,
    eventId: string,
  ): Promise<EventRoundResultEntity[]>;
  abstract findByRoundNumberAndUser(
    roundNumber: number,
    userId: string,
    eventId: string,
  ): Promise<EventRoundResultEntity | null>;
}
