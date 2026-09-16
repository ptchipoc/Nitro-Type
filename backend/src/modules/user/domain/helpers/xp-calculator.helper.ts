import { DifficultyLevel } from "@shared/entities/enums/difficulty-level";

export class XpCalculator {
  /**
   * Calcula o XP ganho em uma sessão de typing.
   * Fatores: WPM, Accuracy, Dificuldade.
   */
  static calculateTypingXp(params: {
    wpm: number;
    accuracy: number;
    difficulty: DifficultyLevel;
    level: number;
  }): number {
    const { wpm, accuracy, difficulty, level } = params;

    // Base XP por dificuldade
    const difficultyMultiplier: Record<DifficultyLevel, number> = {
      [DifficultyLevel.EASY]: 1.0,
      [DifficultyLevel.MEDIUM]: 1.5,
      [DifficultyLevel.HARD]: 2.0,
      [DifficultyLevel.EXTREME]: 3.0,
    };

    const multiplier = difficultyMultiplier[difficulty] || 1.0;

    // XP base = WPM * (Accuracy / 100) * Multiplicador de dificuldade
    let xp = wpm * (accuracy / 100) * multiplier;

    // Penalização/Ajuste por nível: à medida que o nível sobe,
    // o XP de exercícios fáceis diminui proporcionalmente se o user não subir o nível do exercício.
    // Mas aqui vamos apenas calcular o XP bruto. O "sentimento" de dificuldade
    // vem da quantidade de XP necessária para subir de nível.

    return Math.ceil(xp);
  }

  /**
   * Calcula o XP ganho em um evento.
   */
  static calculateEventXp(params: {
    baseXp: number;
    medalXp?: number;
    score: number;
  }): number {
    return Math.ceil(params.baseXp + (params.medalXp || 0) + (params.score / 10));
  }

  /**
   * Retorna o XP necessário para atingir o próximo nível.
   * Fórmula: 100 * (level ^ 1.5)
   */
  static getXpForNextLevel(level: number): number {
    return Math.floor(100 * Math.pow(level, 1.5));
  }

  /**
   * Retorna o XP total necessário para atingir um determinado nível.
   */
  static getTotalXpForLevel(level: number): number {
    let total = 0;
    for (let i = 1; i < level; i++) {
      total += this.getXpForNextLevel(i);
    }
    return total;
  }
}
