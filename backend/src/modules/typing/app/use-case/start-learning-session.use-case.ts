import { Injectable } from "@nestjs/common";
import { TypingSessionRepository } from "@modules/typing/domain/repo/typing-session.repository";
import { TypingLearningRepository } from "@modules/typing/domain/repo/typing-learning.repository";
import { TypingLearningEntity } from "@modules/typing/domain/entities/typing-learning";
import { TypingSessionEntity } from "@modules/typing/domain/entities/typing-session";
import { TextPoolService } from "@shared/modules/text-pool/text-pool.service";
import { TypingCategory } from "@modules/typing/domain/entities/enums/typing-category";
import { DifficultyLevel } from "@shared/entities/enums/difficulty-level";

@Injectable()
export class StartLearningSessionUseCase {
  constructor(
    private readonly sessionRepo: TypingSessionRepository,
    private readonly learningRepo: TypingLearningRepository,
    private readonly textPool: TextPoolService,
  ) {}

  async execute(userId: string) {
    let learning = await this.learningRepo.findByUserId(userId);
    if (!learning) {
      learning = TypingLearningEntity.create({ userId });
      await this.learningRepo.save(learning);
    }

    const text = await this.textPool.getLearningText(learning.currentStage);

    const session = TypingSessionEntity.create({
      creatorId: userId,
      category: TypingCategory.BEGINNER,
      difficulty: DifficultyLevel.EASY,
      textContent: text,
      timeLimit: 0,
    });

    await this.sessionRepo.save(session);
    return {
      session: session.publicData(),
      learning: learning.publicData(),
    };
  }
}
