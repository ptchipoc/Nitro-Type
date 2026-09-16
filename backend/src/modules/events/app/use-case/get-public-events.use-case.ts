import { Injectable } from "@nestjs/common";
import { EventRepository } from "../../domain/repository/event.repo";

@Injectable()
export class GetPublicEventsUseCase {
  constructor(private readonly eventRepo: EventRepository) {}

  /** Lista todos os eventos públicos disponíveis */
  async execute() {
    const events = await this.eventRepo.findAllPublic();
    return events.map((e) => e.publicData());
  }
}
