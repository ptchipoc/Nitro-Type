import { randomUUID } from "crypto";
import { BadRequestException } from "@nestjs/common";
import { BaseEntity } from "@shared/entities/base.entity";
import { EventParticipantEntity } from "./event-participant.entity";
import { CreateEventProps } from "./props/create-event.props";
import { EventProps } from "./props/event.props";
import { EventType } from "./enums/event-type";
import { EventStatus } from "./enums/event-status";
import { ParticipantStatus } from "./enums/participant-status";
import { MedalType } from "./enums/medal-type";

const MAX_PRIVATE_ROUNDS = 42;
const MAX_PRIVATE_PARTICIPANTS = 42;

export class EventEntity extends BaseEntity {
  private props: EventProps;

  private constructor(props: EventProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this.props = props;
  }

  static create(input: CreateEventProps): EventEntity {
    if (!input.name || input.name.trim().length === 0) {
      throw new BadRequestException("name é obrigatorio");
    }

    if (input.type === EventType.PUBLIC && !input.scheduledAt) {
      throw new BadRequestException(
        "Evento público precisa de uma data agendada",
      );
    }

    if (input.scheduledAt && input.scheduledAt <= new Date()) {
      throw new BadRequestException("scheduledAt tem que ser no futuro");
    }

    if (input.baseXp < 0) {
      throw new BadRequestException("baseXp não pode ser negativo");
    }

    if (
      input.type === EventType.PRIVATE &&
      input.roundsCount > MAX_PRIVATE_ROUNDS
    ) {
      throw new BadRequestException(
        `Evento privado tem limite de ${MAX_PRIVATE_ROUNDS} rodadas`,
      );
    }

    if (
      input.type === EventType.PRIVATE &&
      input.maxParticipants &&
      input.maxParticipants > MAX_PRIVATE_PARTICIPANTS
    ) {
      throw new BadRequestException(
        `Evento privado tem limite de ${MAX_PRIVATE_PARTICIPANTS} participantes`,
      );
    }

    return new EventEntity({
      id: randomUUID(),
      status: input.scheduledAt ? EventStatus.SCHEDULED : EventStatus.WAITING,
      betweenRoundsDelay: input.betweenRoundsDelay ?? 30, // 30 segundos
      createdAt: new Date(),
      participants: [],
      currentRound: 0,
      ...input,
    });
  }

  static reconstitute(props: EventProps): EventEntity {
    return new EventEntity(props);
  }

  // ─── Getters ────────────────────────────────────────────────
  get creatorId() {
    return this.props.creatorId;
  }
  get name() {
    return this.props.name;
  }
  get description() {
    return this.props.description;
  }
  get type() {
    return this.props.type;
  }
  get status() {
    return this.props.status;
  }
  get scheduledAt() {
    return this.props.scheduledAt;
  }
  get betweenRoundsDelay() {
    return this.props.betweenRoundsDelay;
  }
  get startedAt() {
    return this.props.startedAt;
  }
  get finishedAt() {
    return this.props.finishedAt;
  }
  get participants() {
    return this.props.participants;
  }
  get currentRound() {
    return this.props.currentRound;
  }
  get roundsCount() {
    return this.props.roundsCount;
  }
  get category() {
    return this.props.category;
  }
  get difficulty() {
    return this.props.difficulty;
  }
  get maxParticipants() {
    return this.props.maxParticipants;
  }

  get baseXp() {
    return this.props.baseXp;
  }
  // ─── Métodos de negócio ─────────────────────────────────────

  isCreator(userId: string): boolean {
    return this.props.creatorId === userId;
  }

  isPublic(): boolean {
    return this.props.type === EventType.PUBLIC;
  }

  isPrivate(): boolean {
    return this.props.type === EventType.PRIVATE;
  }

  // ─── Rodadas ─────────────────────────────────────────────────

  addRound(roundNumber: number): void {
    if (this.props.status !== EventStatus.ACTIVE) {
      throw new BadRequestException(
        "Rodadas so podem ser adicionadas enquanto o evento esta em ACTIVE",
      );
    }

    if (
      this.isPrivate() &&
      this.props.roundsCount + roundNumber > MAX_PRIVATE_ROUNDS
    ) {
      throw new BadRequestException(
        `Evento privado tem limite de ${MAX_PRIVATE_ROUNDS} rodadas`,
      );
    }

    this.props.roundsCount += roundNumber;
    this.touch();
  }

  nextRound(): number | undefined {
    const nextRound = this.props.currentRound + 1;
    if (nextRound > this.props.roundsCount) {
      return undefined;
    }

    this.props.currentRound = nextRound;
    this.touch();
    return nextRound;
  }

  getNextRound(): number | undefined {
    const nextRound = this.props.currentRound + 1;
    if (nextRound > this.props.roundsCount) {
      return undefined;
    }
    return nextRound;
  }

  resetCurrentRound(): void {
    this.props.currentRound = 0;
    this.touch();
  }

  // ─── Participantes ───────────────────────────────────────────

  addParticipant(participant: EventParticipantEntity): void {
    if (
      this.isPrivate() &&
      this.props.participants.length >= MAX_PRIVATE_PARTICIPANTS
    ) {
      throw new BadRequestException(
        `Evento privado tem limite de ${MAX_PRIVATE_PARTICIPANTS} participantes`,
      );
    }

    if (
      this.maxParticipants &&
      this.props.participants.length >= this.maxParticipants
    ) {
      throw new BadRequestException(
        `Evento tem limite de ${this.maxParticipants} participantes`,
      );
    }

    const alreadyIn = this.props.participants.some(
      (p) => p.userId === participant.userId,
    );
    if (alreadyIn) {
      throw new BadRequestException("Utilizador ja esta no evento");
    }

    this.props.participants.push(participant);
    this.touch();
  }

  getParticipant(userId: string): EventParticipantEntity | undefined {
    return this.props.participants.find((p) => p.userId === userId);
  }

  getActiveParticipants(): EventParticipantEntity[] {
    return this.props.participants.filter((p) => p.isActive());
  }

  // Verifica se todos abandonaram → evento deve terminar
  allParticipantsGone(): boolean {
    const active = this.getActiveParticipants();
    return active.length === 0 && this.props.participants.length > 0;
  }

  // Resolve qual medalha um utilizador ganhou com base no rank final
  resolveMedalForRank(rankPosition: number): MedalType | undefined {
    if (rankPosition == 1) return MedalType.GOLD;
    if (rankPosition == 2) return MedalType.SILVER;
    if (rankPosition == 3) return MedalType.BRONZE;
    return undefined;
  }

  resolveXPForRank(rankPosition: number): number {
    if (rankPosition == 1) return this.props.baseXp * 5;
    if (rankPosition == 2) return this.props.baseXp * 3;
    if (rankPosition == 3) return this.props.baseXp * 2;
    return this.props.baseXp;
  }

  // ─── Ciclo de vida do evento ─────────────────────────────────

  schedule(): void {
    if (this.props.status !== EventStatus.WAITING) {
      throw new BadRequestException("So um evento WAITING pode ser agendado");
    }
    if (this.props.roundsCount === 0) {
      throw new BadRequestException(
        "O evento precisa de pelo menos uma rodada antes de ser agendado",
      );
    }
    this.props.status = EventStatus.SCHEDULED;
    this.touch();
  }

  // Chamado pelo scheduler ou pelo criador (privado) manualmente
  start(): void {
    if (this.scheduledAt && this.props.status !== EventStatus.SCHEDULED) {
      throw new BadRequestException(
        "O evento tem que estar agendado para começar",
      );
    }
    this.props.status = EventStatus.ACTIVE;
    this.participants.forEach((p) => {
      if (p.status === ParticipantStatus.ACCEPTED) {
        p.markPlaying();
      }
    });
    this.props.startedAt = new Date();
    this.touch();
  }

  reStart(): void {
    if (this.scheduledAt && this.props.status !== EventStatus.FINISHED) {
      throw new BadRequestException(
        "O evento tem que estar terminado para ser reiniciado",
      );
    }
    this.props.status = EventStatus.ACTIVE;
    this.participants.forEach((p) => {
      if (p.status === ParticipantStatus.ACCEPTED) {
        p.markPlaying();
      }
    });
    this.props.startedAt = new Date();
    this.touch();
  }

  // Quando o criador decide dar uma pausa no evento
  enterBetweenRounds(): void {
    if (this.props.status !== EventStatus.ACTIVE) {
      throw new BadRequestException("Evento tem que estar ACTIVE");
    }
    this.props.status = EventStatus.BETWEEN_ROUNDS;
    this.touch();
  }

  // Quando o criador decide voltar ao evento
  resumeFromBetweenRounds(): void {
    if (this.props.status !== EventStatus.BETWEEN_ROUNDS) {
      throw new BadRequestException("Evento tem que estar BETWEEN_ROUNDS");
    }
    this.props.status = EventStatus.ACTIVE;
    this.touch();
  }

  finish(): void {
    if (
      this.props.status !== EventStatus.ACTIVE &&
      this.props.status !== EventStatus.BETWEEN_ROUNDS
    ) {
      throw new BadRequestException(
        "Evento tem que estar ACTIVE ou BETWEEN_ROUNDS para terminar",
      );
    }
    this.props.status = EventStatus.FINISHED;
    this.participants.forEach((p) => p.finish());
    this.props.finishedAt = new Date();
    this.touch();
  }
  isFinishParticipants(): boolean {
    return this.props.participants.every((p) => p.isFinished());
  }

  // ─── Serialização ────────────────────────────────────────────

  publicData() {
    return {
      id: this.id,
      creatorId: this.creatorId,
      name: this.name,
      description: this.description,
      type: this.type,
      status: this.status,
      scheduledAt: this.scheduledAt,
      betweenRoundsDelay: this.betweenRoundsDelay,
      startedAt: this.startedAt,
      finishedAt: this.finishedAt,
      roundsCount: this.roundsCount,
      currentRound: this.currentRound,
      category: this.category,
      baseXp: this.baseXp,
      difficulty: this.difficulty,
      participants: this.participants.map((p) => p.publicData()),
      maxParticipants: this.maxParticipants,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
