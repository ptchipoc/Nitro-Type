import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateEventRoundInput } from "../../presentation/inputs/create-event-round.input";
import { EventRepository } from "@modules/events/domain/repository/event.repo";

@Injectable()
export class AddEventRoundUseCase {
  constructor(private readonly eventRepo: EventRepository) {}

  /**
   * Adiciona uma rodada ao evento.
   * Só o criador pode adicionar e o evento tem que estar em DRAFT.
   */
  async execute(eventId: string, input: CreateEventRoundInput, userId: string) {
    const event = await this.eventRepo.findById(eventId);
    if (!event) throw new NotFoundException("Evento nao encontrado");

    if (!event.isCreator(userId)) {
      throw new UnauthorizedException("So o criador pode adicionar rodadas");
    }

    event.addRound(input.roundNumber);
    await this.eventRepo.save(event);

    return event.publicData();
  }
}
