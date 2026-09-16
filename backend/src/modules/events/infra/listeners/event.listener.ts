import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { EventStartedEvent } from "../../domain/events/event-started.event";
import { EventFinishedEvent } from "../../domain/events/event-finished.event";
import { EventInviteEvent } from "../../domain/events/event-invite.event";
import { RoundStartedEvent } from "../../domain/events/round-started.event";
import { RoundFinishedEvent } from "../../domain/events/round-finished.event";
import { BetweenRoundsEvent } from "../../domain/events/between-rounds.event";
import { ParticipantResultSubmittedEvent } from "../../domain/events/participant-result-submitted.event";
import { EventAllAbandonedEvent } from "../../domain/events/event-all-abandoned.event";
import { EventGateway } from "../../presentation/gateways/event.gateway";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { EventNotificationEvent } from "@modules/notification/domain/events/event-notification.event";
import { StartRoundUseCase } from "@modules/events/app/use-case/start-round.use-case";
import { FinishEventUseCase } from "@modules/events/app/use-case/finish-event.use-case";
import { GetEventRankingUseCase } from "@modules/events/app/use-case/get-event-ranking.use-case";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

@Injectable()
export class EventListener {
  private readonly logger = new Logger(EventListener.name);

  constructor(
    private readonly eventGateway: EventGateway,
    private readonly eventBus: EventBusPort,
    private readonly startRound: StartRoundUseCase,
    private readonly finishEvent: FinishEventUseCase,
    private readonly rankEvent: GetEventRankingUseCase,
    @InjectQueue("events") private readonly eventsQueue: Queue,
  ) {}

  // ─── Evento iniciado ─────────────────────────────────────────
  @OnEvent("EVENT.STARTED")
  async handleEventStarted(event: EventStartedEvent): Promise<void> {
    this.logger.log(`[EVENT.STARTED] eventId: ${event.eventId}`);

    this.eventGateway.emitToEvent(event.eventId, "event:started", {
      eventId: event.eventId,
      eventName: event.eventName,
    });

    await this.startRound.execute(event.eventId);
  }

  // ─── Evento finalizado ───────────────────────────────────────
  @OnEvent("EVENT.FINISHED")
  async handleEventFinished(event: EventFinishedEvent): Promise<void> {
    this.logger.log(`[EVENT.FINISHED] eventId: ${event.eventId}`);

    const ranking = await this.rankEvent.execute(event.eventId);
    this.eventGateway.emitToEvent(event.eventId, "event:finished", {
      eventId: event.eventId,
      eventName: event.eventName,
      ranking,
    });

    this.logger.log("RANKING", ranking);
  }

  // ─── Convite enviado ─────────────────────────────────────────
  @OnEvent("EVENT.INVITE")
  async handleEventInvite(event: EventInviteEvent): Promise<void> {
    this.logger.log(
      `[EVENT.INVITE] recipientId: ${event.recipientId} | eventId: ${event.eventId}`,
    );

    await this.eventBus.publish([
      new EventNotificationEvent(
        event.recipientId,
        "EVENT_INVITE",
        event.eventId,
        event.eventName,
      ),
    ]);
  }

  // ─── Rodada iniciada ─────────────────────────────────────────
  @OnEvent("EVENT.ROUND_STARTED")
  async handleRoundStarted(event: RoundStartedEvent): Promise<void> {
    this.logger.log(
      `[EVENT.ROUND_STARTED] eventId: ${event.eventId} | round: ${event.roundNumber}`,
    );

    // Timer automático — quando o tempo acabar, fecha a rodada
    await this.eventsQueue.add(
      "close-round",
      {
        eventId: event.eventId,
        roundNumber: event.roundNumber,
      },
      {
        delay: event.timeLimitSeconds * 1000,
        jobId: `round-${event.eventId}-${event.roundNumber}`,
        removeOnComplete: true,
      },
    );

    this.eventGateway.emitToEvent(event.eventId, "round:started", {
      eventId: event.eventId,
      text: event.text,
      wordCount: event.wordCount,
      category: event.category,
      difficulty: event.difficulty,
      roundNumber: event.roundNumber,
      timeLimit: event.timeLimitSeconds,
    });
  }

  // ─── Rodada finalizada ───────────────────────────────────────
  @OnEvent("EVENT.ROUND_FINISHED")
  async handleRoundFinished(event: RoundFinishedEvent): Promise<void> {
    this.logger.log(
      `[EVENT.ROUND_FINISHED] eventId: ${event.eventId} | round: ${event.roundNumber}`,
    );

    this.eventGateway.emitToEvent(event.eventId, "round:finished", {
      eventId: event.eventId,
      roundNumber: event.roundNumber,
    });
  }

  // ─── Entre rodadas ───────────────────────────────────────────
  @OnEvent("EVENT.BETWEEN_ROUNDS")
  async handleBetweenRounds(event: BetweenRoundsEvent): Promise<void> {
    this.logger.log(
      `[EVENT.BETWEEN_ROUNDS] eventId: ${event.eventId} | next: ${event.nextRoundNumber} | delay: ${event.delaySeconds}s`,
    );

    // Avisa o frontend para mostrar countdown
    this.eventGateway.emitToEvent(event.eventId, "round:between", {
      eventId: event.eventId,
      delaySeconds: event.delaySeconds,
      nextRoundNumber: event.nextRoundNumber,
    });

    // Aguarda o delay e inicia a próxima rodada
    setTimeout(async () => {
      await this.startRound.execute(event.eventId);
    }, event.delaySeconds * 1000);
  }

  // ─── Resultado submetido por participante ────────────────────
  @OnEvent("EVENT.RESULT_SUBMITTED")
  handleResultSubmitted(event: ParticipantResultSubmittedEvent): void {
    this.logger.log(
      `[EVENT.RESULT_SUBMITTED] userId: ${event.userId} | score: ${event.score}`,
    );

    this.eventGateway.emitToEvent(event.eventId, "round:result", {
      userId: event.userId,
      roundNumber: event.roundNumber,
      score: event.score,
      wpm: event.wpm,
      accuracy: event.accuracy,
      completionRate: event.completionRate,
      errorRate: event.errorRate,
      completionTime: event.completionTime,
    });
  }

  // ─── Todos abandonaram ───────────────────────────────────────
  @OnEvent("EVENT.ALL_ABANDONED")
  async handleAllAbandoned(event: EventAllAbandonedEvent): Promise<void> {
    this.logger.log(
      `[EVENT.ALL_ABANDONED] eventId: ${event.eventId} — finalizando evento`,
    );

    await this.finishEvent.execute(event.eventId);
  }
}
