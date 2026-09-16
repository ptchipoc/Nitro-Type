import { EventStatus } from "../entities/enums/event-status";
import { EventType } from "../entities/enums/event-type";
import { EventEntity } from "../entities/event.entity";

export abstract class EventRepository {
  abstract save(event: EventEntity): Promise<void>;
  abstract findById(id: string): Promise<EventEntity | null>;
  abstract findAllPublic(): Promise<EventEntity[]>;
  abstract findAllByUserId(
    userId: string,
    status?: EventStatus,
    type?: EventType,
  ): Promise<EventEntity[]>;
  abstract findByCreatorId(creatorId: string): Promise<EventEntity[]>;
  abstract findScheduledBefore(date: Date): Promise<EventEntity[]>; // para o scheduler
  abstract delete(id: string): Promise<void>;
}
