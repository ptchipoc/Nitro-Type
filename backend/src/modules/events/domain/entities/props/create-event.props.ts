import { EventCategory, EventDifficulty } from "../enums/event-status";
import { EventType } from "../enums/event-type";

export interface CreateEventProps {
  creatorId: string;
  name: string;
  description?: string;
  type: EventType;
  category: EventCategory;
  difficulty: EventDifficulty;
  roundsCount: number;
  baseXp: number;
  maxParticipants?: number;
  scheduledAt?: Date;
  betweenRoundsDelay?: number; // default: 30s
}
