import { Injectable, NotFoundException } from "@nestjs/common";
import { EventRepository } from "../../domain/repository/event.repo";

@Injectable()
export class GetEventUseCase {
  constructor(private readonly eventRepo: EventRepository) {}

  /** Retorna os dados públicos de um evento pelo ID */
  async execute(eventId: string) {
    const event = await this.eventRepo.findById(eventId);
    if (!event) throw new NotFoundException("Evento nao encontrado");
    return event.publicData();
  }
}
