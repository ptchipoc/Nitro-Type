import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { RoundStartedEvent } from "../../domain/events/round-started.event";
import { EventRepository } from "@modules/events/domain/repository/event.repo";
import { EventStatus } from "@modules/events/domain/entities/enums/event-status";
import { TextPoolService } from "@shared/modules/text-pool/text-pool.service";
import { calculateTimeLimitEvent } from "@shared/helpers/calculate-time-limit.helper";
import { FinishEventUseCase } from "./finish-event.use-case";

enum EventRandomCategory {
  ANIME = "ANIME",
  FUNCTIONS = "FUNCTIONS",
  ALGORITHMS = "ALGORITHMS",
}

enum EventRandomDifficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
  EXTREME = "EXTREME",
}

@Injectable()
export class StartRoundUseCase {
  private readonly logger = new Logger(StartRoundUseCase.name);

  constructor(
    private readonly eventRepo: EventRepository,
    private readonly finishEvent: FinishEventUseCase,
    private readonly eventBus: EventBusPort,
    private readonly textPool: TextPoolService,
  ) {}

  /**
   * Inicia a próxima rodada do evento.
   * Cria uma TypingSession para a rodada e emite RoundStartedEvent.
   * Quando o tempo acaba → emite RoundFinishedEvent → BetweenRoundsEvent ou EventFinishedEvent.
   */
  async execute(eventId: string): Promise<void> {
    const event = await this.eventRepo.findById(eventId);
    if (!event) throw new NotFoundException("Evento nao encontrado");

    const nextRound = event.nextRound();

    // Sem próxima rodada → evento terminou
    if (!nextRound) {
      await Promise.all([this.finishEvent.execute(eventId)]);
      return;
    }

    // Garante que o evento está ACTIVE
    if (event.status === EventStatus.BETWEEN_ROUNDS) {
      event.resumeFromBetweenRounds();
    }

    const category = this.getCategory(event.category);
    const difficulty = this.getDifficulty(event.difficulty);

    const textContent = this.textPool.getRandomEvent(category, difficulty);

    const timeLimit = calculateTimeLimitEvent(difficulty, textContent);

    await this.eventRepo.save(event);

    await this.eventBus.publish([
      new RoundStartedEvent(
        event.id,
        nextRound,
        timeLimit,
        textContent.wordCount,
        textContent.text,
        category,
        difficulty,
      ),
    ]);

    this.logger.log(
      `[StartRound] eventId: ${eventId} | round: ${nextRound} | timeLimit: ${timeLimit}s`,
    );
  }

  private getCategory(input: string): string {
    const values = Object.values(EventRandomCategory);

    if (input === "RANDOM" || !values.includes(input as EventRandomCategory)) {
      const randomIndex = Math.floor(Math.random() * values.length);
      return values[randomIndex];
    }
    return input;
  }

  private getDifficulty(input: string): string {
    const difficulties = Object.values(EventRandomDifficulty);
    if (
      input === "RANDOM" ||
      !difficulties.includes(input as EventRandomDifficulty)
    ) {
      const randomIndex = Math.floor(Math.random() * difficulties.length);
      return difficulties[randomIndex];
    }
    return input;
  }
}
