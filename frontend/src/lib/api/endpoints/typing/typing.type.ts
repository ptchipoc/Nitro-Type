export enum TypingCategory {
  ANIME = "ANIME",
  FUNCTIONS = "FUNCTIONS",
  ALGORITHMS = "ALGORITHMS",
  // BEGINNER = "BEGINNER",
}

export enum TypingDifficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
  EXTREME = "EXTREME",
}

export enum TypingMode {
  SOLO = "SOLO",
  EVENT = "EVENT",
}

export enum TypingStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export type TypingSection = {
  id: string;
  creatorId: string;
  category: TypingCategory;
  difficulty: TypingDifficulty;
  textContent: {
    text: string;
    wordCount: number;
  };
  timeLimit: number;
  mode: TypingMode;
  status: TypingStatus;
  createdAt: string;
  updatedAt: string;
};

export type TypingSubmitSession = {
  sessionId: string;
  totalKeystrokes: number;
  correctKeystrokes: number;
  incorrectKeystrokes: number;
  durationSeconds: number;
};

export enum TypingSessionStatus {
  COMPLETED = "COMPLETED",
  TIMEOUT = "TIMEOUT",
  ABANDONED = "ABANDONED",
}

export type TypingSessionResult = {
  id: string;
  sessionId: string;
  userId: string;
  wpm: number;
  accuracy: number;
  errorRate: number;
  completionRate: number;
  status: TypingSessionStatus;
  totalChars: number;
  typedChars: number;
  correctTypedChars: number;
  incorrectTypedChars: number;
  durationSeconds: number;
  xpEarned: number;
  score: number;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
};
