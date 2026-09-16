export type TypingSessionResultById = {
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
}

export enum TypingSessionCategory {
    ANIME = "ANIME",
    FUNCTIONS = "FUNCTIONS",
    ALGORITHMS = "ALGORITHMS",
}

export enum TypingSessionDifficulty {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD",
}

export enum TypingSessionStatus {
    COMPLETED = "COMPLETED",
    TIMEOUT = "TIMEOUT",
    ABANDONED = "ABANDONED",
}

export type TypingSessionById = {
    id: string;
    creatorId: string;
    category: TypingSessionCategory;
    difficulty: TypingSessionDifficulty;
    textContent: {
        text: string;
        wordCount: number;
    };
    timeLimit: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}