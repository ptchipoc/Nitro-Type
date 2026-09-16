import { TypingSessionResultEntity } from "@modules/typing/domain/entities/typing-session-result";

export abstract class TypingSessionResultRepository {
  abstract save(result: TypingSessionResultEntity): Promise<void>;
  abstract findById(id: string): Promise<TypingSessionResultEntity | null>;
  abstract findBySessionId(
    sessionId: string,
  ): Promise<TypingSessionResultEntity[]>;
  abstract findByUserId(userId: string): Promise<TypingSessionResultEntity[]>;
  abstract findBySessionAndUser(
    sessionId: string,
    userId: string,
  ): Promise<TypingSessionResultEntity | null>;
}
