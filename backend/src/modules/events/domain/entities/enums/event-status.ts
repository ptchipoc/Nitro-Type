export enum EventStatus {
  WAITING = "WAITING", // aguardando participantes
  SCHEDULED = "SCHEDULED", // agendado, aguarda data
  ACTIVE = "ACTIVE", // rodada a decorrer
  BETWEEN_ROUNDS = "BETWEEN_ROUNDS", // intervalo entre rodadas
  FINISHED = "FINISHED", // terminado
}

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
  EXTREME = "EXTREME",
}
