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
  RANDOM = "RANDOM",
  ANIME = "ANIME",
  FUNCTIONS = "FUNCTIONS",
  ALGORITHMS = "ALGORITHMS",
}

export enum EventDifficulty {
  RANDOM = "RANDOM",
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
  EXPERT = "EXPERT",
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
  category: EventCategory;
  difficulty: EventDifficulty;
  roundNumber: number;
  timeLimit: number;
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
  baseXp: number;
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
  
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  totalScore: number;
  joinedAt: string;
  createdAt: string;
  updatedAt?: string;
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


export type TotalWinsByUser = {
  totalWin: number;
};
