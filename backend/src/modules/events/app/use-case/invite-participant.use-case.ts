import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { EventParticipantEntity } from "../../domain/entities/event-participant.entity";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { EventRepository } from "../../domain/repository/event.repo";
import { InviteParticipantInput } from "../../presentation/inputs/invite-participant.input";
import { EventInviteEvent } from "@modules/events/domain/events/event-invite.event";

@Injectable()
export class InviteParticipantUseCase {
  constructor(
    private readonly eventRepo: EventRepository,
    private readonly userRepo: UserRepository,
    private readonly eventBus: EventBusPort,
  ) {}

  /**
   * Convida um utilizador por email para um evento privado.
   * Cria o EventParticipant com status INVITED e dispara notificação.
   */
  async execute(
    eventId: string,
    input: InviteParticipantInput,
    inviterId: string,
  ) {
    const event = await this.eventRepo.findById(eventId);
    if (!event) throw new NotFoundException("Evento nao encontrado");

    if (!event.isCreator(inviterId)) {
      throw new UnauthorizedException(
        "So o criador pode convidar participantes",
      );
    }

    const invitee = await this.userRepo.findByEmail(input.email);
    if (!invitee) throw new NotFoundException("Utilizador nao encontrado");

    const participant = EventParticipantEntity.create({
      eventId,
      userId: invitee.id,
    });

    event.addParticipant(participant);
    await this.eventRepo.save(event);

    await this.eventBus.publish([
      new EventInviteEvent(invitee.id, event.id, event.name),
    ]);

    return participant.publicData();
  }
}
