import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { TypingSessionRepository } from "@modules/typing/domain/repo/typing-session.repository";
import { TypingSessionResultRepository } from "@modules/typing/domain/repo/typing-session-result.repository";
import { SubmitResultInput } from "@modules/typing/presentation/inputs/submit-result.input";
import { TypingSessionResultEntity } from "@modules/typing/domain/entities/typing-session-result";
import { SessionMode, SessionStatus } from "@shared/entities/enums/session";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { ResultSubmittedEvent } from "@modules/typing/domain/events/result-submitted.event";
import { DifficultyLevel } from "@shared/entities/enums/difficulty-level";
import { UserRepository } from "@modules/user/domain/repository/user.repo";

@Injectable()
export class SubmitResultUseCase {
  constructor(
    private readonly sessionRepo: TypingSessionRepository,
    private readonly resultRepo: TypingSessionResultRepository,
    private readonly eventBus: EventBusPort,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(input: SubmitResultInput, userId: string) {
    const session = await this.sessionRepo.findById(input.sessionId);
    if (!session) throw new NotFoundException("Sessao nao encontrada");

    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException("Usuario nao encontrado");

    const existing = await this.resultRepo.findBySessionAndUser(
      input.sessionId,
      user.id,
    );
    if (existing) throw new ConflictException("Resultado ja submetido");

    if (session.status === SessionStatus.FINISHED)
      throw new BadRequestException("Sessao ja finalizada");
    if (!session.startedAt)
      throw new BadRequestException("Sessao nao iniciada");

    const startedAt = session.startedAt;
    const durationSeconds = Math.floor(
      (Date.now() - startedAt.getTime()) / 1000,
    );
    const totalChars = session.textContent.text.length;

    const result = TypingSessionResultEntity.create({
      ...input,
      userId: user.id,
      durationSeconds,
      totalChars,
      timeLimit: session.timeLimit,
      wordCount: session.textContent.wordCount,
    });

    result.assignXp(session.difficulty, user.progress?.level ?? 1);
    if (user.progress) {
      user.progress.addXp(result.xpEarned, `Prática de Digitação`, session.id);
    }

    await Promise.all([this.userRepo.save(user), this.resultRepo.save(result)]);
    session.finish();
    await this.sessionRepo.save(session);

    await this.eventBus.publish([
      new ResultSubmittedEvent(
        result.id,
        session.id,
        userId,
        result.wpm,
        result.accuracy,
        SessionMode.SOLO,
        session.difficulty as unknown as DifficultyLevel,
      ),
    ]);

    return result.publicData();
  }
}
