import { BaseEntity } from "@shared/entities/base.entity";
import { TypingStage } from "@modules/typing/domain/entities/enums/typing-stage";
import { randomUUID } from "crypto";
import { BadRequestException } from "@nestjs/common";

interface TypingLearningProps {
  id: string;
  userId: string;
  currentStage: TypingStage;
  totalAccuracy: number;
  totalSessions: number;
  lastPracticedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

interface CreateTypingLearningProps {
  userId: string;
}

export class TypingLearningEntity extends BaseEntity {
  private props: TypingLearningProps;

  private constructor(props: TypingLearningProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this.props = props;
  }

  // ─── Factory ────────────────────────────────────────────────
  static create(input: CreateTypingLearningProps): TypingLearningEntity {
    if (!input.userId) {
      throw new BadRequestException("userId é obrigatório");
    }

    return new TypingLearningEntity({
      id: randomUUID(),
      userId: input.userId,
      currentStage: TypingStage.STAGE_1_HOME_ROW,
      totalAccuracy: 0,
      totalSessions: 0,
      createdAt: new Date(),
    });
  }

  static reconstitute(props: TypingLearningProps): TypingLearningEntity {
    return new TypingLearningEntity(props);
  }

  // ─── Getters ─────────────────────────────────────────────────
  get userId() {
    return this.props.userId;
  }
  get currentStage() {
    return this.props.currentStage;
  }
  get totalAccuracy() {
    return this.props.totalAccuracy;
  }
  get totalSessions() {
    return this.props.totalSessions;
  }
  get lastPracticedAt() {
    return this.props.lastPracticedAt;
  }

  // ─── Métodos de negócio ─────────────────────────────────────

  updateProgress(accuracy: number, wpm: number): void {
    if (accuracy < 0 || accuracy > 100) {
      throw new BadRequestException("Accuracy deve estar entre 0 e 100");
    }

    const currentTotal = this.props.totalAccuracy * this.props.totalSessions;
    this.props.totalSessions += 1;
    this.props.totalAccuracy =
      (currentTotal + accuracy) / this.props.totalSessions;

    this.props.lastPracticedAt = new Date();

    if (this.canAdvance(accuracy, wpm)) {
      this.nextStage();
    }

    this.touch();
  }

  private canAdvance(accuracy: number, wpm: number): boolean {
    switch (this.props.currentStage) {
      case TypingStage.STAGE_1_HOME_ROW:
        return accuracy >= 95;
      case TypingStage.STAGE_2_ROW:
        return accuracy >= 95 && wpm >= 20;
      case TypingStage.STAGE_3_WORD:
        return accuracy >= 97 && wpm >= 30;
      case TypingStage.STAGE_4_SENTENCE:
        return accuracy >= 97 && wpm >= 40;
      case TypingStage.STAGE_5_PARAGRAPH:
        return accuracy >= 98 && wpm >= 35;
      default:
        return false;
    }
  }

  private nextStage(): void {
    const stages = Object.values(TypingStage);
    const currentIndex = stages.indexOf(this.props.currentStage);

    if (currentIndex < stages.length - 1) {
      this.props.currentStage = stages[currentIndex + 1] as TypingStage;
    }
  }

  publicData() {
    return {
      id: this.id,
      userId: this.userId,
      currentStage: this.currentStage,
      totalAccuracy: this.totalAccuracy,
      totalSessions: this.totalSessions,
      lastPracticedAt: this.lastPracticedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
