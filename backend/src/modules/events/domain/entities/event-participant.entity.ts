import { randomUUID } from "crypto";
import { BadRequestException } from "@nestjs/common";
import { BaseEntity } from "@shared/entities/base.entity";
import { ParticipantStatus } from "./enums/participant-status";
import { UserEntity } from "@modules/user/domain/entities/user.entity";

interface EventParticipantProps {
  id: string;
  eventId: string;
  userId: string;
  status: ParticipantStatus;
  totalScore: number; // sum(score) de todas as rodadas
  joinedAt: Date;
  createdAt: Date;
  updatedAt?: Date;
  user?: UserEntity;
}

interface CreateEventParticipantProps {
  eventId: string;
  userId: string;
  status?: ParticipantStatus;
}

export class EventParticipantEntity extends BaseEntity {
  private props: EventParticipantProps;

  private constructor(props: EventParticipantProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this.props = props;
  }

  static create(input: CreateEventParticipantProps): EventParticipantEntity {
    return new EventParticipantEntity({
      id: randomUUID(),
      status: ParticipantStatus.INVITED,
      totalScore: 0,
      joinedAt: new Date(),
      createdAt: new Date(),
      ...input,
    });
  }

  static reconstitute(props: EventParticipantProps): EventParticipantEntity {
    return new EventParticipantEntity(props);
  }

  // ─── Getters ────────────────────────────────────────────────
  get eventId() {
    return this.props.eventId;
  }
  get userId() {
    return this.props.userId;
  }
  get status() {
    return this.props.status;
  }
  get totalScore() {
    return this.props.totalScore;
  }
  get joinedAt() {
    return this.props.joinedAt;
  }

  // ─── Métodos de negócio ─────────────────────────────────────

  accept(): void {
    if (this.props.status !== ParticipantStatus.INVITED) {
      throw new BadRequestException(
        "So um participante convidado pode aceitar",
      );
    }
    this.props.status = ParticipantStatus.ACCEPTED;
    this.touch();
  }

  // Quando o participante decide jogar
  markPlaying(): void {
    if (this.props.status !== ParticipantStatus.ACCEPTED) {
      throw new BadRequestException(
        "Participante tem que ter aceitado para jogar",
      );
    }
    this.props.status = ParticipantStatus.PLAYING;
    this.touch();
  }

  abandon(): void {
    if (this.props.status === ParticipantStatus.FINISHED) {
      throw new BadRequestException("Participante ja terminou");
    }
    this.props.status = ParticipantStatus.ABANDONED;
    this.touch();
  }

  finish(): void {
    this.props.status = ParticipantStatus.FINISHED;
    this.touch();
  }

  isFinished(): boolean {
    return this.props.status === ParticipantStatus.FINISHED;
  }

  // Chamado após cada rodada — acumula o score
  addScore(score: number): void {
    if (score < 0) throw new BadRequestException("Score nao pode ser negativo");
    this.props.totalScore = parseFloat(
      (this.props.totalScore + score).toFixed(4),
    );
    this.touch();
  }

  isActive(): boolean {
    return (
      this.props.status === ParticipantStatus.PLAYING ||
      this.props.status === ParticipantStatus.ACCEPTED
    );
  }

  publicData() {
    return {
      id: this.id,
      eventId: this.eventId,
      userId: this.userId,
      status: this.status,
      user: this.props.user
        ? {
            id: this.props.user.id,
            name: this.props.user.name,
            email: this.props.user.email,
            avatarUrl: this.props.user.avatarUrl,
          }
        : undefined,
      totalScore: this.totalScore,
      joinedAt: this.joinedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
