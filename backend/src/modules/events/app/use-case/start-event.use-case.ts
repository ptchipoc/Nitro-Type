import { EventStatus } from "@modules/events/domain/entities/enums/event-status";
import { EventStartedEvent } from "@modules/events/domain/events/event-started.event";
import { EventRepository } from "@modules/events/domain/repository/event.repo";
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";

@Injectable()
export class StartEventUseCase {
  constructor(
    private readonly eventRepo: EventRepository,
    private readonly eventBus: EventBusPort,
  ) {}

  /**
   * Inicia o evento manualmente (privado) ou via scheduler (público).
   * Move SCHEDULED → ACTIVE e começa a primeira rodada.
   */
  async execute(eventId: string, userId: string) {
    const event = await this.eventRepo.findById(eventId);
    if (!event) throw new NotFoundException("Evento nao encontrado");

    if (!event.isCreator(userId)) {
      throw new UnauthorizedException("So o criador pode iniciar o evento");
    }

    if (event.status == EventStatus.FINISHED) event.reStart();
    else event.start();
    await this.eventRepo.save(event);

    await this.eventBus.publish([new EventStartedEvent(event.id, event.name)]);

    return event.publicData();
  }
}
