import { DomainEvent } from "@shared/entities/domain-event.base";
import { SessionMode } from "@shared/entities/enums/session";
import { TypingCategory } from "@modules/typing/domain/entities/enums/typing-category";
import { DifficultyLevel } from "@shared/entities/enums/difficulty-level";

export class SessionCreatedEvent extends DomainEvent {
  public readonly sessionId: string;
  public readonly creatorId: string;
  public readonly category: TypingCategory;
  public readonly difficulty: DifficultyLevel;

  constructor(
    sessionId: string,
    creatorId: string,
    category: TypingCategory,
    difficulty: DifficultyLevel,
  ) {
    super("TYPING.SESSION_CREATED");
    this.sessionId = sessionId;
    this.creatorId = creatorId;
    this.category = category;
    this.difficulty = difficulty;
  }
}
