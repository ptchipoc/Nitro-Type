import { randomUUID } from "crypto";
import { BadRequestException } from "@nestjs/common";
import { BaseEntity } from "@shared/entities/base.entity";
import { TypingCategory } from "@modules/typing/domain/entities/enums/typing-category";
import { DifficultyLevel } from "@shared/entities/enums/difficulty-level";
import { EventRoundStatus } from "./enums/event-round-status";

interface TextContent {
  text: string;
  wordCount: number;
}

interface EventRoundProps {
  id: string;
  eventId: string;
  roundNumber: number; // posição da rodada no evento (1, 2, 3...)
  category: TypingCategory;
  difficulty: DifficultyLevel;
  text: string;
  wordCount: number;
  timeLimit: number;

  status: EventRoundStatus;
  startedAt?: Date;
  finishedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

interface CreateEventRoundProps {
  eventId: string;
  roundNumber: number;
  category: TypingCategory;
  difficulty: DifficultyLevel;
  timeLimit: number;
  textContent: TextContent;
}

export class EventRoundEntity extends BaseEntity {
  private props: EventRoundProps;

  private constructor(props: EventRoundProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this.props = props;
  }

  static create(input: CreateEventRoundProps): EventRoundEntity {
    if (input.roundNumber <= 0) {
      throw new BadRequestException("roundNumber tem que ser maior que zero");
    }

    if (input.timeLimit <= 0) {
      throw new BadRequestException("timeLimit tem que ser maior que zero");
    }

    if (!input.textContent.text || input.textContent.text.trim().length === 0) {
      throw new BadRequestException("textContent tem que ter texto");
    }

    if (input.textContent.wordCount <= 0) {
      throw new BadRequestException("wordCount tem que ser maior que zero");
    }

    return new EventRoundEntity({
      id: randomUUID(),
      status: EventRoundStatus.WAITING,
      createdAt: new Date(),
      ...input,
      text: input.textContent.text,
      wordCount: input.textContent.wordCount,
    });
  }

  static reconstitute(props: EventRoundProps): EventRoundEntity {
    return new EventRoundEntity(props);
  }

  // ─── Getters ────────────────────────────────────────────────
  get eventId() {
    return this.props.eventId;
  }
  get roundNumber() {
    return this.props.roundNumber;
  }
  get category() {
    return this.props.category;
  }
  get difficulty() {
    return this.props.difficulty;
  }
  get text() {
    return this.props.text;
  }
  get wordCount() {
    return this.props.wordCount;
  }
  get timeLimit() {
    return this.props.timeLimit;
  }
  get status() {
    return this.props.status;
  }
  get startedAt() {
    return this.props.startedAt;
  }
  get finishedAt() {
    return this.props.finishedAt;
  }

  // ─── Métodos de negócio ─────────────────────────────────────

  // Quando a rodada começa → linkamos a TypingSession criada
  activate(): void {
    if (this.props.status !== EventRoundStatus.WAITING) {
      throw new BadRequestException(
        "Round tem que estar em WAITING para ativar",
      );
    }
    this.props.status = EventRoundStatus.ACTIVE;
    this.props.startedAt = new Date();
    this.touch();
  }

  finish(): void {
    if (this.props.status !== EventRoundStatus.ACTIVE) {
      throw new BadRequestException(
        "Round tem que estar ACTIVE para finalizar",
      );
    }
    this.props.status = EventRoundStatus.FINISHED;
    this.props.finishedAt = new Date();
    this.touch();
  }

  isActive(): boolean {
    return this.props.status === EventRoundStatus.ACTIVE;
  }

  publicData() {
    return {
      id: this.id,
      eventId: this.eventId,
      roundNumber: this.roundNumber,
      category: this.category,
      difficulty: this.difficulty,
      status: this.status,
      text: this.text,
      wordCount: this.wordCount,
      timeLimit: this.timeLimit,
      startedAt: this.startedAt,
      finishedAt: this.finishedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
