import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { SessionCreatedEvent } from "@modules/typing/domain/events/session-created.event";
import { SessionStartedEvent } from "@modules/typing/domain/events/session-started.event";
import { SessionFinishedEvent } from "@modules/typing/domain/events/session-finished.event";
import { ResultSubmittedEvent } from "@modules/typing/domain/events/result-submitted.event";
import { UserClientService } from "@modules/user/app/services/user-client.service";
import { TypingSessionResultRepository } from "@modules/typing/domain/repo/typing-session-result.repository";

@Injectable()
export class OnSessionListener {
  private readonly logger = new Logger(OnSessionListener.name);

  constructor(
    private readonly userService: UserClientService,
    private readonly resultRepo: TypingSessionResultRepository,
  ) {}

  @OnEvent("TYPING.SESSION_CREATED")
  async handleCreated(event: SessionCreatedEvent): Promise<void> {
    this.logger.log(
      `[Event] SESSION_CREATED — session: ${event.sessionId} | creator: ${event.creatorId}`,
    );

    // Por agora só loga — futuramente:
    // → notificar sala via WebSocket (multiplayer)
    // → indexar sessão para busca
  }

  @OnEvent("TYPING.SESSION_STARTED")
  async handleStarted(event: SessionStartedEvent): Promise<void> {
    this.logger.log(
      `[Event] SESSION_STARTED — session: ${event.sessionId} | tempo limite: ${event.timeLimitSeconds}s`,
    );

    // Futuramente:
    // → emitir countdown via WebSocket para todos na sala
    // → iniciar timer no gateway
  }

  @OnEvent("TYPING.SESSION_FINISHED")
  async handleFinished(event: SessionFinishedEvent): Promise<void> {
    this.logger.log(
      `[Event] SESSION_FINISHED — session: ${event.sessionId} | mode: ${event.mode}`,
    );

    // Futuramente:
    // → notificar sala que o jogo acabou via WebSocket
    // → calcular ranking final (multiplayer)
  }

  @OnEvent("TYPING.RESULT_SUBMITTED")
  async handleResultSubmitted(event: ResultSubmittedEvent): Promise<void> {
    this.logger.log(
      `[Event] RESULT_SUBMITTED — user: ${event.userId} | wpm: ${event.wpm} | accuracy: ${event.accuracy}%`,
    );
    // const result = await this.userService.updateUserProgress(event.userId, {
    //   wpm: event.wpm,
    //   accuracy: event.accuracy,
    //   difficulty: event.difficulty,
    //   resultId: event.resultId,
    //   activityDesc: `Prática de Digitação - ${event.difficulty}`,
    // });

    // → notificar sala do resultado via WebSocket (multiplayer)
    // this.logger.log(
    //   `User ${event.userId} total XP: ${result.totalXp} | level: ${result.level} | rank: ${result.rank}`,
    // );
  }
}
