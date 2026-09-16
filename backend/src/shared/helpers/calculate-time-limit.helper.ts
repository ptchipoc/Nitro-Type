import { TypingCategory } from "@modules/typing/domain/entities/enums/typing-category";
import { DifficultyLevel } from "@shared/entities/enums/difficulty-level";

// CPM = Characters Per Minute (inclui espaços, pontuação, tudo)
// Equivalência aproximada: 1 palavra média ≈ 5 chars
// EASY:200cpm ≈ 40wpm | MEDIUM:300cpm ≈ 60wpm | HARD:450cpm ≈ 90wpm | EXTREME:300cpm ≈ 60wpm
const BASE_CPM: Record<DifficultyLevel, number> = {
  [DifficultyLevel.EASY]: 200,
  [DifficultyLevel.MEDIUM]: 300,
  [DifficultyLevel.HARD]: 450,
  [DifficultyLevel.EXTREME]: 300,
};

const BASE_BUFFER: Record<DifficultyLevel, number> = {
  [DifficultyLevel.EASY]: 15,
  [DifficultyLevel.MEDIUM]: 10,
  [DifficultyLevel.HARD]: 5,
  [DifficultyLevel.EXTREME]: 2,
};

// PER_CHAR_BUFFER: buffer extra por cada caractere do texto
// Mantém proporcionalidade mas escala suave (chars >> words)
const PER_CHAR_BUFFER: Record<DifficultyLevel, number> = {
  [DifficultyLevel.EASY]: 0.05,
  [DifficultyLevel.MEDIUM]: 0.03,
  [DifficultyLevel.HARD]: 0.01,
  [DifficultyLevel.EXTREME]: 0.01,
};

export function calculateTimeLimit(
  category: TypingCategory,
  difficulty: DifficultyLevel,
  textContent: { text: string; wordCount: number },
): number {
  // BEGINNER fica igual — usa wordCount, ritmo fixo de 20wpm + 30s
  if (category === TypingCategory.BEGINNER) {
    return Math.ceil((textContent.wordCount / 20) * 60) + 30;
  }

  const charCount = textContent.text.length;

  const baseSeconds = Math.ceil((charCount / BASE_CPM[difficulty]) * 60);
  const bufferSeconds =
    BASE_BUFFER[difficulty] + charCount * PER_CHAR_BUFFER[difficulty];

  return baseSeconds + Math.ceil(bufferSeconds);
}

// --- Versão Event (sem enum, string pura) ---

const BASE_CPM_EVENT: Record<string, number> = {
  EASY: 150,
  MEDIUM: 225,
  HARD: 275,
  EXTREME: 200,
};

const BASE_BUFFER_EVENT: Record<string, number> = {
  EASY: 30,
  MEDIUM: 25,
  HARD: 20,
  EXTREME: 15,
};

const PER_CHAR_BUFFER_EVENT: Record<string, number> = {
  EASY: 0.4,
  MEDIUM: 0.3,
  HARD: 0.2,
  EXTREME: 0.2,
};

export function calculateTimeLimitEvent(
  difficulty: string,
  textContent: { text: string; wordCount: number },
): number {
  const charCount = textContent.text.length;

  const baseSeconds = Math.ceil((charCount / BASE_CPM_EVENT[difficulty]) * 60);
  const bufferSeconds =
    BASE_BUFFER_EVENT[difficulty] +
    charCount * PER_CHAR_BUFFER_EVENT[difficulty];

  return baseSeconds + Math.ceil(bufferSeconds);
}
