import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { EventStartedEvent } from "../../domain/events/event-started.event";
import { EventRepository } from "@modules/events/domain/repository/event.repo";
import { ParticipantStatus } from "@modules/events/domain/entities/enums/participant-status";

@Injectable()
export class EventScheduler {
  private readonly logger = new Logger(EventScheduler.name);

  constructor(
    private readonly eventRepo: EventRepository,
    private readonly eventBus: EventBusPort,
  ) {}

  // Corre a cada minuto — verifica eventos agendados que já deviam ter começado
  @Cron(CronExpression.EVERY_MINUTE)
  async checkScheduledEvents(): Promise<void> {
    const now = new Date();
    const events = await this.eventRepo.findScheduledBefore(now);

    for (const event of events) {
      try {
        const participants = event.participants.filter(
          (p) => p.status === ParticipantStatus.ACCEPTED,
        );
        if (participants.length <= 1) {
          event.finish();
          await this.eventRepo.save(event);
          this.logger.warn(
            `[CronScheduler] Evento finalizado automaticamente: ${event.id}`,
          );
          continue;
        }
        event.start();
        await this.eventRepo.save(event);

        await this.eventBus.publish([
          new EventStartedEvent(event.id, event.name),
        ]);

        this.logger.log(
          `[CronScheduler] Evento iniciado automaticamente: ${event.id}`,
        );
      } catch (err) {
        this.logger.error(
          `[CronScheduler] Falha ao iniciar evento ${event.id}: ${err.message}`,
        );
      }
    }
  }
}
