import { randomUUID } from "crypto";
import { BaseEntity } from "@shared/entities/base.entity";
import { ConflictException } from "@nestjs/common";

interface EventRoundResultProps {
  id: string;
  eventId: string;
  userId: string;
  roundNumber: number;
  wpm: number;
  accuracy: number;
  score: number;
  completionRate: number;
  errorRate: number;
  completionTime: number; // em segundos, opcional se não terminou
  createdAt: Date;
  updatedAt?: Date;
}

interface CreateEventRoundResultProps {
  eventId: string;
  userId: string;
  typedChars: number;
  totalChars: number;
  roundNumber: number;
  correctChars: number;
  incorrectChars: number;
  completionTime: number;
  wordCount: number;
  timeLimit: number;
}

export class EventRoundResultEntity extends BaseEntity {
  private props: EventRoundResultProps;

  private constructor(props: EventRoundResultProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this.props = props;
  }

  static create(input: CreateEventRoundResultProps): EventRoundResultEntity {
    const accuracy = this.calcAccuracy(input.correctChars, input.typedChars);

    if (input.totalChars <= 0) {
      throw new ConflictException(
        "Caracteres do texto deve ser maior que zero",
      );
    }

    if (input.correctChars + input.incorrectChars !== input.typedChars) {
      throw new ConflictException(
        "A soma de caracteres corretos e incorretos deve ser igual a caracteres digitados",
      );
    }

    const errorRate = this.calcErrorRate(
      input.incorrectChars,
      input.typedChars,
    );

    if (input.completionTime <= 0) {
      throw new ConflictException("Tempo de conclusão deve ser maior que zero");
    }

    if (input.wordCount <= 0) {
      throw new ConflictException(
        "Contagem de palavras deve ser maior que zero",
      );
    }

    if (input.timeLimit <= 0) {
      throw new ConflictException("Tempo limite deve ser maior que zero");
    }

    const wpm = this.calcRealWpm(
      input.completionTime,
      input.totalChars,
      input.incorrectChars,
    );

    const safeTyped = Math.min(input.typedChars, input.typedChars); // Impede que o usuário digite mais caracteres do que o texto original
    const completionRate = this.calcCompletionRate(safeTyped, input.typedChars);
    const score = this.calcScore(
      wpm,
      accuracy,
      completionRate,
      input.completionTime,
      input.timeLimit,
    );

    return new EventRoundResultEntity({
      id: randomUUID(),
      createdAt: new Date(),
      eventId: input.eventId,
      userId: input.userId,
      roundNumber: input.roundNumber,
      wpm,
      accuracy,
      score,
      completionRate,
      errorRate,
      completionTime: input.completionTime,
    });
  }

  static reconstitute(props: EventRoundResultProps): EventRoundResultEntity {
    return new EventRoundResultEntity(props);
  }

  // ─── Getters ────────────────────────────────────────────────
  get eventId() {
    return this.props.eventId;
  }

  get userId() {
    return this.props.userId;
  }
  get roundNumber() {
    return this.props.roundNumber;
  }
  get wpm() {
    return this.props.wpm;
  }
  get accuracy() {
    return this.props.accuracy;
  }
  get score() {
    return this.props.score;
  }
  get completionRate() {
    return this.props.completionRate;
  }
  get errorRate() {
    return this.props.errorRate;
  }
  get completionTime() {
    return this.props.completionTime;
  }

  // ─── Cálculos ───────────────────────────────────────────────

  private static calcRealWpm(
    durationSeconds: number,
    totalChars: number,
    errors: number,
  ): number {
    const minutes = durationSeconds / 60;
    const correctChars = totalChars - errors;
    return parseFloat((correctChars / 5 / minutes).toFixed(2));
  }

  private static calcAccuracy(correct: number, total: number): number {
    if (total === 0) return 0;
    return parseFloat(((correct / total) * 100).toFixed(2));
  }

  private static calcErrorRate(errors: number, total: number): number {
    if (total === 0) return 0;
    return parseFloat(((errors / total) * 100).toFixed(2));
  }

  private static calcCompletionRate(typed: number, total: number): number {
    if (total === 0) return 0;
    return parseFloat((Math.min(typed / total, 1) * 100).toFixed(2));
  }

  private static calcScore(
    wpm: number,
    accuracy: number,
    completionRate: number,
    durationSeconds: number,
    timeLimit: number,
  ): number {
    // base = wpm ponderado pela accuracy
    // se tens 100 WPM mas 50% accuracy, não vale o mesmo que 80 WPM com 95%
    const base = wpm * (accuracy / 100);

    // bónus de completion — completou o texto todo?
    const completionBonus = completionRate * 0.5;

    // bónus de velocidade — terminou antes do tempo limite?
    const timeBonus =
      timeLimit > 0
        ? Math.max(0, ((timeLimit - durationSeconds) / timeLimit) * 20)
        : 0;

    return parseFloat((base + completionBonus + timeBonus).toFixed(4));
  }

  publicData() {
    return {
      id: this.id,
      eventId: this.props.eventId,
      userId: this.userId,
      roundNumber: this.roundNumber,
      wpm: this.wpm,
      accuracy: this.accuracy,
      score: this.score,
      completionRate: this.completionRate,
      errorRate: this.errorRate,
      completionTime: this.completionTime,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
