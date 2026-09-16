import { Injectable } from "@nestjs/common";
import { EventRepository } from "@modules/events/domain/repository/event.repo";
import { EventStatus } from "@modules/events/domain/entities/enums/event-status";
import { EventType } from "@modules/events/domain/entities/enums/event-type";

@Injectable()
export class GetEventsUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(userId: string, status?: EventStatus, type?: EventType) {
    const events = await this.eventRepository.findAllByUserId(
      userId,
      status,
      type,
    );
    return events.map((e) => e.publicData());
  }
}
