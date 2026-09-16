import { TypingCategory, TypingDifficulty } from "../typing/typing.type";

// ─── Enums ──────────────────────────────────────────────────────

export enum EventType {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export enum EventStatus {
  WAITING = "WAITING",
  SCHEDULED = "SCHEDULED",
  ACTIVE = "ACTIVE",
  BETWEEN_ROUNDS = "BETWEEN_ROUNDS",
  FINISHED = "FINISHED",
}

export enum EventRoundStatus {
  WAITING = "WAITING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

export enum ParticipantStatus {
  INVITED = "INVITED",
  ACCEPTED = "ACCEPTED",
  PLAYING = "PLAYING",
  ABANDONED = "ABANDONED",
  FINISHED = "FINISHED",
}

export enum MedalType {
  GOLD = "GOLD",
  SILVER = "SILVER",
  BRONZE = "BRONZE",
}

// ─── Types ──────────────────────────────────────────────────────
export enum EventCategory {
  ANIME = "ANIME",
  FUNCTIONS = "FUNCTIONS",
  ALGORITHMS = "ALGORITHMS",
  RANDOM = "RANDOM",
}

export enum EventDifficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
  EXPERT = "EXPERT",
  RANDOM = "RANDOM",
}

export type EventMedal = {
  id: string;
  eventId: string;
  rankPosition: number;
  baseXp: number;
  medalType: MedalType;
  createdAt: string;
};

export type EventRoundInput = {
  eventId: string;
  roundNumber: number;
  typedChars: number;
  correctChars: number;
  incorrectChars: number;
  completionTime: number;
  wordCount: number;
  timeLimit: number;
};

export type EventRoundResponse = {
  eventId: string;
  text: string;
  wordCount: number;
  category: TypingCategory;
  difficulty: TypingDifficulty;
  roundNumber: number;
  timeLimit: number;
};

type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

export type TypingEvent = {
  id: string;
  creatorId: string;
  name: string;
  description?: string;
  type: EventType;
  status: EventStatus;
  roundsCount: number;
  currentRound: number;
  category: EventCategory;
  difficulty: EventDifficulty;
  scheduledAt?: string;
  betweenRoundsDelay: number;
  startedAt?: string;
  finishedAt?: string;
  participants: EventParticipant[];
  medals: EventMedal[];
  maxParticipants?: number;
  createdAt: string;
  updatedAt?: string;
};

export type EventParticipant = {
  id: string;
  eventId: string;
  userId: string;
  status: ParticipantStatus;
  totalScore: number;
  joinedAt: string;
  createdAt: string;
  updatedAt?: string;
  user: User;
};

export type EventInvite = {
  id: string;
  eventId: string;
  invitedBy: string;
  invitedUserId: string;
  code: string;
  status: ParticipantStatus;
  expiresAt?: string;
  createdAt: string;
  updatedAt?: string;
};

export type EventRankingEntry = {
  rank: number;
  userId: string;
  totalScore: number;
  medal?: MedalType;
};

export type EventRankingResponse = {
  eventId: string;
  ranking: EventRankingEntry[];
};

export type EventRoundResult = {
  id: string;
  eventId: string;
  roundNumber: number;
  userId: string;
  wpm: number;
  accuracy: number;
  score: number;
  completionRate: number;
  errorRate: number;
  completionTime: number;
  createdAt: string;
  updatedAt?: string;
};

export { TypingCategory, TypingDifficulty };
