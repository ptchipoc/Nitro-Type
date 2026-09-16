import { ParticipantStatus } from "@modules/events/domain/entities/enums/participant-status";
import { EventParticipantEntity } from "@modules/events/domain/entities/event-participant.entity";
import { EventRepository } from "@modules/events/domain/repository/event.repo";
import { EventNotificationEvent } from "@modules/notification/domain/events/event-notification.event";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";

@Injectable()
export class AcceptInviteUseCase {
  constructor(
    private readonly eventRepo: EventRepository,
    private readonly eventPort: EventBusPort,
    private readonly userRepo: UserRepository,
  ) {}

  /**
   * Utilizador aceita o convite para participar do evento.
   * Muda ParticipantStatus de INVITED → ACCEPTED.
   */
  async execute(eventId: string, userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException("Usuário não encontrado");

    const event = await this.eventRepo.findById(eventId);
    if (!event) throw new NotFoundException("Evento nao encontrado");

    const isparticipant = event.getParticipant(userId);
    if (!isparticipant) {
      if (event.isPrivate()) {
        throw new UnauthorizedException(
          "So convidados podem aceitar convite para eventos privados",
        );
      }
      const participant = EventParticipantEntity.create({
        eventId,
        userId,
      });
      participant.accept();
      user.progress?.addEvent();
      event.addParticipant(participant);
      await Promise.all([this.userRepo.save(user), this.eventRepo.save(event)]);
      return participant.publicData();
    }
    if (isparticipant.status === ParticipantStatus.ACCEPTED) {
      throw new UnauthorizedException("Convite já foi aceito");
    }
    isparticipant.accept();
    user.progress?.addEvent();
    await Promise.all([this.userRepo.save(user), this.eventRepo.save(event)]);
    const message = `O ${user.name} aceitou o convite para o evento ${event.name} - ${event.description}`;
    this.eventPort.publish([
      new EventNotificationEvent(
        event.creatorId,
        "EVENT_ACCEPTED",
        eventId,
        event.name,
        message,
        {
          receiverId: event.creatorId,
          eventId,
          action: "EVENT_ACCEPTED",
        },
      ),
    ]);
    return isparticipant.publicData();
  }
}
