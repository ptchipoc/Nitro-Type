import { Injectable, NotFoundException } from "@nestjs/common";
import { TypingSessionRepository } from "@modules/typing/domain/repo/typing-session.repository";
import { TypingSessionResultRepository } from "@modules/typing/domain/repo/typing-session-result.repository";
import { TypingLearningRepository } from "@modules/typing/domain/repo/typing-learning.repository";
import { SubmitResultInput } from "@modules/typing/presentation/inputs/submit-result.input";
import { TypingSessionResultEntity } from "@modules/typing/domain/entities/typing-session-result";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { ResultSubmittedEvent } from "@modules/typing/domain/events/result-submitted.event";
import { SessionMode } from "@shared/entities/enums/session";
import { DifficultyLevel } from "@shared/entities/enums/difficulty-level";

@Injectable()
export class SubmitLearningResultUseCase {
  constructor(
    private readonly sessionRepo: TypingSessionRepository,
    private readonly resultRepo: TypingSessionResultRepository,
    private readonly learningRepo: TypingLearningRepository,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(input: SubmitResultInput, userId: string) {
    const session = await this.sessionRepo.findById(input.sessionId);
    if (!session) throw new NotFoundException("Sessao nao encontrada");

    let learning = await this.learningRepo.findByUserId(userId);
    if (!learning)
      throw new NotFoundException("Perfil de aprendizado nao encontrado");

    const durationSeconds = Math.floor(
      (Date.now() - session.createdAt.getTime()) / 1000,
    );
    const totalChars = session.textContent.text.length;
    const result = TypingSessionResultEntity.create({
      ...input,
      userId,
      durationSeconds,
      totalChars,
      timeLimit: session.timeLimit,
      wordCount: session.textContent.wordCount,
    });
    await this.resultRepo.save(result);

    learning.updateProgress(result.accuracy, result.wpm);
    await this.learningRepo.save(learning);

    // Publicar evento para processamento de XP e outras reações
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

    return {
      result: result.publicData(),
      learning: learning.publicData(),
    };
  }
}
