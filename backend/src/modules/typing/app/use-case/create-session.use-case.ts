import { Injectable } from "@nestjs/common";
import { TypingSessionRepository } from "@modules/typing/domain/repo/typing-session.repository";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { CreateSessionInput } from "@modules/typing/presentation/inputs/create-session.input";
import { TypingSessionEntity } from "@modules/typing/domain/entities/typing-session";
import { SessionCreatedEvent } from "@modules/typing/domain/events/session-created.event";
import { TextPoolService } from "@shared/modules/text-pool/text-pool.service";
import { calculateTimeLimit } from "@shared/helpers/calculate-time-limit.helper";
import { SessionStatus } from "@shared/entities/enums/session";
import { UserRepository } from "@modules/user/domain/repository/user.repo";

@Injectable()
export class CreateSessionUseCase {
  constructor(
    private readonly sessionRepo: TypingSessionRepository,
    private readonly textPool: TextPoolService,
    private readonly userRepo: UserRepository,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(input: CreateSessionInput, creatorId: string) {
    const user = await this.userRepo.findById(creatorId);
    if (!user) {
      throw new Error("Utilizador nao encontrado");
    }
    const textData = this.textPool.getRandom(input.category, input.difficulty);
    const timeLimit = calculateTimeLimit(
      input.category,
      input.difficulty,
      textData,
    );

    const session = TypingSessionEntity.create({
      creatorId,
      category: input.category,
      difficulty: input.difficulty,
      textContent: textData,
      timeLimit: timeLimit,
      status: SessionStatus.WAITING,
    });

    await this.sessionRepo.save(session);
    await this.eventBus.publish([
      new SessionCreatedEvent(
        session.id,
        creatorId,
        input.category,
        input.difficulty,
      ),
    ]);

    return session.publicData();
  }
}
