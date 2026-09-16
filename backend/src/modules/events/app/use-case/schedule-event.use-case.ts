import { EventRepository } from "@modules/events/domain/repository/event.repo";
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class ScheduleEventUseCase {
  constructor(private readonly eventRepo: EventRepository) {}

  /**
   * Move o evento de DRAFT → SCHEDULED.
   * Valida que tem pelo menos uma rodada.
   * Só o criador pode fazer isso.
   */
  async execute(eventId: string, userId: string) {
    const event = await this.eventRepo.findById(eventId);
    if (!event) throw new NotFoundException("Evento nao encontrado");

    if (!event.isCreator(userId)) {
      throw new UnauthorizedException("So o criador pode agendar o evento");
    }

    event.schedule();
    await this.eventRepo.save(event);

    return event.publicData();
  }
}
