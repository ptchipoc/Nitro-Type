import { TypingLearningEntity } from "@modules/typing/domain/entities/typing-learning";

export abstract class TypingLearningRepository {
  abstract findByUserId(userId: string): Promise<TypingLearningEntity | null>;
  abstract save(entity: TypingLearningEntity): Promise<void>;
}
