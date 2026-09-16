import { DifficultyLevel } from "@shared/entities/enums/difficulty-level";
import { TypingCategory } from "@modules/typing/domain/entities/enums/typing-category";
import { SessionStatus } from "@shared/entities/enums/session";
import { BaseEntity } from "@shared/entities/base.entity";
import { randomUUID } from "crypto";
import { BadRequestException } from "@nestjs/common";

interface TextContent {
  text: string;
  wordCount: number;
}

interface TypingSessionProps {
  id: string;
  creatorId: string;
  category: TypingCategory;
  difficulty: DifficultyLevel;
  textContent: TextContent;
  timeLimit: number;
  status: SessionStatus;
  createdAt: Date;
  startedAt?: Date;
  finishedAt?: Date;
  updatedAt?: Date;
}

// DTO para o factory method
interface CreateTypingSessionProps {
  creatorId: string;
  category: TypingCategory;
  difficulty: DifficultyLevel;
  textContent: TextContent;
  timeLimit: number;
  status?: SessionStatus;
}

export class TypingSessionEntity extends BaseEntity {
  private props: Omit<TypingSessionProps, "textContent">;
  private text: string;
  private wordCount: number;

  private constructor(props: TypingSessionProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this.props = props;
    this.text = props.textContent.text;
    this.wordCount = props.textContent.wordCount;
  }

  // ─── Factory ────────────────────────────────────────────────
  static create(input: CreateTypingSessionProps): TypingSessionEntity {
    if (!input.creatorId) {
      throw new BadRequestException("creatorId é obrigatorio");
    }
    if (!input.textContent || input.textContent.text.trim().length === 0) {
      throw new BadRequestException("textContent nao pode estar vazio");
    }
    if (!input.textContent.wordCount || input.textContent.wordCount <= 0) {
      throw new BadRequestException("wordCount tem que ser maior que zero");
    }
    // TODO: Deve se alter a categoria para LEARNING e BEGINNER já não deve existir
    if (input.timeLimit <= 0 && input.category !== TypingCategory.BEGINNER) {
      throw new BadRequestException("timeLimit tem que ser maior que zero");
    }

    let status = input.status || SessionStatus.WAITING;

    return new TypingSessionEntity({
      id: randomUUID(),
      status,
      createdAt: new Date(),
      ...input,
    });
  }

  static reconstitute(props: TypingSessionProps): TypingSessionEntity {
    return new TypingSessionEntity(props);
  }

  static reconstituteFromPrisma(props: any): TypingSessionEntity {
    console.log(props);
    return new TypingSessionEntity({
      id: props.id,
      creatorId: props.creatorId,
      category: props.category,
      difficulty: props.difficulty,
      textContent: {
        text: props.text,
        wordCount: props.wordCount,
      },
      timeLimit: props.timeLimit,
      status: props.status,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  // ─── Getters ─────────────────────────────────────────────────
  get creatorId() {
    return this.props.creatorId;
  }
  get category() {
    return this.props.category;
  }
  get difficulty() {
    return this.props.difficulty;
  }
  get textContent() {
    return { text: this.text, wordCount: this.wordCount };
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

  // ─── Métodos de negócio (intenção clara) ─────────────────────

  // Sessão ativada — começa o jogo
  activate(): void {
    if (this.props.status !== SessionStatus.WAITING) {
      throw new Error("So uma sessao em WAITING pode ser ativada");
    }
    this.props.status = SessionStatus.ACTIVE;
    this.props.startedAt = new Date();
    this.touch();
  }

  // Sessão finalizada — tempo esgotou ou todos terminaram
  finish(): void {
    if (this.props.status !== SessionStatus.ACTIVE) {
      throw new BadRequestException("So uma sessao ACTIVE pode ser finalizada");
    }
    this.props.status = SessionStatus.FINISHED;
    this.props.finishedAt = new Date();
    this.touch();
  }

  // Verifica se a sessão está aberta para novos participantes
  isAcceptingParticipants(): boolean {
    return this.props.status === SessionStatus.WAITING;
  }

  // Verifica se é o criador — usado nos guards do gateway
  isCreator(userId: string): boolean {
    return this.props.creatorId === userId;
  }

  // Atualiza o texto — só permitido enquanto WAITING
  updateText(textContent: string): void {
    if (this.props.status !== SessionStatus.WAITING) {
      throw new BadRequestException(
        "Texto so pode ser alterado enquanto a sessao esta em WAITING",
      );
    }
    if (!textContent || textContent.trim().length === 0) {
      throw new BadRequestException("textContent nao pode estar vazio");
    }
    this.text = textContent;
    this.wordCount = textContent.split(" ").length;
    this.touch();
  }

  publicData() {
    return {
      id: this.id,
      creatorId: this.creatorId,
      category: this.category,
      difficulty: this.difficulty,
      textContent: this.textContent,
      timeLimit: this.timeLimit,
      status: this.status,
      startedAt: this.startedAt,
      finishedAt: this.finishedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
