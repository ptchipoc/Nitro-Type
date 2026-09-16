import { BaseEntity } from "@shared/entities/base.entity";
import { randomUUID } from "crypto";
import { BadRequestException } from "@nestjs/common";
import { XpCalculator } from "@modules/user/domain/helpers/xp-calculator.helper";

type ResultStatus = "COMPLETED" | "TIMEOUT" | "ABANDONED";

interface SessionResultProps {
  id: string;
  sessionId: string;
  userId: string;

  // snapshot da sessão
  totalChars: number;

  // métricas
  wpm: number;
  accuracy: number;
  errorRate: number;
  completionRate: number;

  typedChars: number;
  correctTypedChars: number;
  incorrectTypedChars: number;

  durationSeconds: number;
  status: ResultStatus;

  completedAt: Date;

  xpEarned: number;
  score: number;

  createdAt: Date;
  updatedAt?: Date;
}

interface CreateSessionResultProps {
  sessionId: string;
  userId: string;

  wordCount: number;
  totalChars: number;

  typedChars: number;
  correctTypedChars: number;
  incorrectTypedChars: number;

  durationSeconds: number;

  timeLimit?: number;
}

export class TypingSessionResultEntity extends BaseEntity {
  private props: SessionResultProps;

  private constructor(props: SessionResultProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this.props = props;
  }

  // ─── Factory ───────────────────────────────────────────────
  static create(input: CreateSessionResultProps): TypingSessionResultEntity {
    if (!input.sessionId) {
      throw new BadRequestException("sessionId é obrigatorio");
    }

    if (!input.userId) {
      throw new BadRequestException("userId é obrigatorio");
    }

    if (input.durationSeconds <= 0) {
      throw new BadRequestException(
        "durationSeconds tem que ser maior que zero",
      );
    }

    if (input.wordCount <= 0) {
      throw new BadRequestException("wordCount invalido");
    }

    if (input.totalChars <= 0) {
      throw new BadRequestException("totalChars invalido");
    }

    if (
      input.typedChars < 0 ||
      input.correctTypedChars < 0 ||
      input.incorrectTypedChars < 0
    ) {
      throw new BadRequestException("keystrokes nao podem ser negativos");
    }

    if (
      input.correctTypedChars + input.incorrectTypedChars !==
      input.typedChars
    ) {
      throw new BadRequestException(
        "correct + incorrect deve ser igual ao total",
      );
    }

    const maxAllowed = input.totalChars * 1.1;

    if (input.typedChars > maxAllowed) {
      throw new BadRequestException(
        "Input suspeito (total de caracteres digitados excedido)",
      );
    }

    // clamp (segurança extra)
    const safeTyped = Math.min(input.typedChars, input.totalChars); // Impede que o usuário digite mais caracteres do que o texto original

    const accuracy = this.calcAccuracy(
      input.correctTypedChars,
      input.typedChars,
    );

    const errorRate = this.calcErrorRate(
      input.incorrectTypedChars,
      input.typedChars,
    );

    const wpm = this.calcRealWpm(
      input.totalChars,
      input.durationSeconds,
      input.incorrectTypedChars,
    );

    console.log(`input.totalChars: ${input.totalChars}`);
    console.log(`input.durationSeconds: ${input.durationSeconds}`);
    console.log(`input.incorrectTypedChars: ${input.incorrectTypedChars}`);
    console.log(`wpm: ${wpm}`);

    const completionRate = this.calcCompletionRate(safeTyped, input.totalChars);

    const status = this.determineStatus({
      typedChars: safeTyped,
      totalChars: input.totalChars,
      durationSeconds: input.durationSeconds,
      timeLimit: input.timeLimit,
    });

    const score = TypingSessionResultEntity.calcScore(
      wpm,
      accuracy,
      completionRate,
      input.durationSeconds,
      input.timeLimit ?? 0,
    );
    return new TypingSessionResultEntity({
      id: randomUUID(),
      sessionId: input.sessionId,
      userId: input.userId,

      totalChars: input.totalChars,

      typedChars: input.typedChars,
      correctTypedChars: input.correctTypedChars,
      incorrectTypedChars: input.incorrectTypedChars,

      durationSeconds: input.durationSeconds,

      wpm,
      accuracy,
      errorRate,
      completionRate,
      status,

      xpEarned: 0,
      score,

      completedAt: new Date(),
      createdAt: new Date(),
    });
  }

  static reconstitute(props: SessionResultProps) {
    return new TypingSessionResultEntity(props);
  }

  // ─── Getters ───────────────────────────────────────────────
  get sessionId() {
    return this.props.sessionId;
  }
  get userId() {
    return this.props.userId;
  }
  get wpm() {
    return this.props.wpm;
  }
  get accuracy() {
    return this.props.accuracy;
  }
  get errorRate() {
    return this.props.errorRate;
  }
  get completionRate() {
    return this.props.completionRate;
  }
  get status() {
    return this.props.status;
  }
  get totalChars() {
    return this.props.totalChars;
  }
  get typedChars() {
    return this.props.typedChars;
  }
  get correctTypedChars() {
    return this.props.correctTypedChars;
  }
  get incorrectTypedChars() {
    return this.props.incorrectTypedChars;
  }
  get durationSeconds() {
    return this.props.durationSeconds;
  }
  get xpEarned() {
    return this.props.xpEarned;
  }
  get score() {
    return this.props.score;
  }
  get completedAt() {
    return this.props.completedAt;
  }

  // ─── Métodos de negócio ─────────────────────────────────────

  assignXp(difficulty: string, level: number): void {
    const xpEarned = XpCalculator.calculateTypingXp({
      wpm: this.wpm,
      accuracy: this.accuracy,
      difficulty: difficulty as any,
      level,
    });

    this.props.xpEarned = xpEarned;
    this.touch();
  }

  private static determineStatus(params: {
    typedChars: number;
    totalChars: number;
    durationSeconds: number;
    timeLimit?: number;
  }): ResultStatus {
    const { typedChars, totalChars, durationSeconds, timeLimit } = params;

    const isTimeout =
      timeLimit !== undefined && timeLimit > 0 && durationSeconds >= timeLimit;

    if (isTimeout) return "TIMEOUT";

    if (typedChars >= totalChars) return "COMPLETED";

    return "ABANDONED";
  }

  // ─── Cálculos ───────────────────────────────────────────────

  private static calcRealWpm(
    totalChars: number,
    durationSeconds: number,
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

  // ─── Serialização ───────────────────────────────────────────
  publicData() {
    return {
      id: this.id,
      sessionId: this.sessionId,
      userId: this.userId,

      wpm: this.wpm,
      accuracy: this.accuracy,
      errorRate: this.errorRate,
      completionRate: this.completionRate,
      status: this.status,

      totalChars: this.totalChars,

      typedChars: this.typedChars,
      correctTypedChars: this.correctTypedChars,
      incorrectTypedChars: this.incorrectTypedChars,

      durationSeconds: this.durationSeconds,

      xpEarned: this.xpEarned,
      score: this.score,

      completedAt: this.completedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
