import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateEventInput } from "../../presentation/inputs/create-event.input";
import { EventEntity } from "../../domain/entities/event.entity";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { EventType } from "@modules/events/domain/entities/enums/event-type";
import { EventRepository } from "../../domain/repository/event.repo";
import { EventParticipantEntity } from "@modules/events/domain/entities/event-participant.entity";
import { ParticipantStatus } from "@modules/events/domain/entities/enums/participant-status";

@Injectable()
export class CreateEventUseCase {
  constructor(
    private readonly eventRepo: EventRepository,
    private readonly userRepo: UserRepository,
  ) {}

  /**
   * Cria um novo evento.
   * - PUBLIC → só a plataforma pode criar (isAdmin check)
   * - PRIVATE → qualquer utilizador autenticado
   */
  async execute(input: CreateEventInput, creatorId: string) {
    const user = await this.userRepo.findById(creatorId);
    if (!user) throw new UnauthorizedException("Utilizador nao encontrado");

    if (input.type === EventType.PUBLIC && !user.isAdmin()) {
      throw new UnauthorizedException(
        "So administradores podem criar eventos publicos",
      );
    }

    const baseXp = input.baseXp && input.type === EventType.PUBLIC ? input.baseXp : 0;
    const event = EventEntity.create({
      creatorId,
      name: input.name,
      description: input.description,
      type: input.type,
      scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
      betweenRoundsDelay: input.betweenRoundsDelay,
      category: input.category,
      baseXp: baseXp,
      difficulty: input.difficulty,
      maxParticipants: input.maxParticipants,
      roundsCount: input.roundsCount,
    });

    const participant = EventParticipantEntity.create({
      eventId: event.id,
      userId: creatorId,
      status: ParticipantStatus.ACCEPTED,
    });

    if (!user.isAdmin()) event.addParticipant(participant);
    user.progress?.addEvent();
    await Promise.all([this.userRepo.save(user), this.eventRepo.save(event)]);
    return event.publicData();
  }
}
