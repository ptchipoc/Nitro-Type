import {
  EventCategory,
  EventDifficulty,
  EventStatus,
} from "../enums/event-status";
import { EventType } from "../enums/event-type";
import { EventParticipantEntity } from "../event-participant.entity";

export interface EventProps {
  id: string;
  creatorId: string;
  name: string;
  description?: string;
  roundsCount: number;
  currentRound: number;
  baseXp: number;
  type: EventType;
  status: EventStatus;
  category: EventCategory;
  difficulty: EventDifficulty;
  scheduledAt?: Date; // data de início (público obrigatório, privado opcional)
  betweenRoundsDelay: number; // segundos de intervalo entre rodadas
  startedAt?: Date;
  maxParticipants?: number;
  finishedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;

  // agregados carregados em memória
  participants: EventParticipantEntity[];
}
