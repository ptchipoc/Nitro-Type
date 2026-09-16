import { DomainEvent } from "@shared/entities/domain-event.base";
import { SessionMode } from "@shared/entities/enums/session";
import { DifficultyLevel } from "@shared/entities/enums/difficulty-level";

export class ResultSubmittedEvent extends DomainEvent {
  public readonly resultId: string;
  public readonly sessionId: string;
  public readonly userId: string;
  public readonly wpm: number;
  public readonly accuracy: number;
  public readonly mode: SessionMode;
  public readonly difficulty: DifficultyLevel;
  public readonly rank?: number;

  constructor(
    resultId: string,
    sessionId: string,
    userId: string,
    wpm: number,
    accuracy: number,
    mode: SessionMode,
    difficulty: DifficultyLevel,
    rank?: number,
  ) {
    super("TYPING.RESULT_SUBMITTED");
    this.resultId = resultId;
    this.sessionId = sessionId;
    this.userId = userId;
    this.wpm = wpm;
    this.accuracy = accuracy;
    this.mode = mode;
    this.difficulty = difficulty;
    this.rank = rank;
  }
}
