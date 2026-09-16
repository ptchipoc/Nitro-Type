import { Injectable, Logger } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { EventRepository } from "@modules/events/domain/repository/event.repo";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { RoundFinishedEvent } from "../../domain/events/round-finished.event";
import { BetweenRoundsEvent } from "../../domain/events/between-rounds.event";
import { FinishEventUseCase } from "./finish-event.use-case";
import { EventStatus } from "@modules/events/domain/entities/enums/event-status";

@Injectable()
export class CloseRoundUseCase {
  private readonly logger = new Logger(CloseRoundUseCase.name);

  constructor(
    private readonly eventRepo: EventRepository,
    private readonly eventBus: EventBusPort,
    private readonly finishEvent: FinishEventUseCase,
    @InjectQueue("events") private readonly eventsQueue: Queue,
  ) {}

  async execute(eventId: string, roundNumber: number): Promise<void> {
    // Remove o job BullMQ imediatamente para evitar execução duplicada
    const closeRoundJobId = `round-${eventId}-${roundNumber}`;
    try {
      const job = await this.eventsQueue.getJob(closeRoundJobId);
      if (job) {
        const state = await job.getState();
        if (state === "waiting" || state === "delayed") {
          await job.remove();
          this.logger.log(`[CloseRound] BullMQ job ${closeRoundJobId} removed`);
        }
      }
    } catch (err) {
      this.logger.warn(`[CloseRound] Failed to remove BullMQ job: ${err}`);
    }

    const event = await this.eventRepo.findById(eventId);
    if (!event) return;

    if (
      event.status !== EventStatus.ACTIVE ||
      event.currentRound !== roundNumber
    ) {
      this.logger.log(
        `Skipping closeRound for eventId: ${eventId}, round: ${roundNumber} (Status: ${event.status}, CurrentRound: ${event.currentRound})`,
      );
      return;
    }

    event.enterBetweenRounds();
    await this.eventRepo.save(event);

    // Encerra a sessão
    await this.eventBus.publish([new RoundFinishedEvent(eventId, roundNumber)]);

    const nextRound = event.getNextRound();

    if (nextRound != undefined) {
      await this.eventRepo.save(event);
      await this.eventBus.publish([
        new BetweenRoundsEvent(eventId, event.betweenRoundsDelay, nextRound),
      ]);
    } else {
      await this.finishEvent.execute(eventId);
    }

    this.logger.log(
      `Round ${roundNumber} for eventId: ${eventId} closed successfully`,
    );
  }
}
