import { TypingSessionEntity } from "@modules/typing/domain/entities/typing-session";

export abstract class TypingSessionRepository {
  abstract save(session: TypingSessionEntity): Promise<void>;
  abstract findById(id: string): Promise<TypingSessionEntity | null>;
  abstract findByCreatorId(creatorId: string): Promise<TypingSessionEntity[]>;
}
