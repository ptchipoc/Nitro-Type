import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { EventController } from "./presentation/controllers/event.controller";
import { EventService } from "./app/services/event.service";
import { CreateEventUseCase } from "./app/use-case/create-event.use-case";
import { AddEventRoundUseCase } from "./app/use-case/add-event-round.use-case";
import { ScheduleEventUseCase } from "./app/use-case/schedule-event.use-case";
import { StartEventUseCase } from "./app/use-case/start-event.use-case";
import { InviteParticipantUseCase } from "./app/use-case/invite-participant.use-case";
import { AcceptInviteUseCase } from "./app/use-case/accept-invite.use-case";
import { GetEventUseCase } from "./app/use-case/get-event.use-case";
import { GetPublicEventsUseCase } from "./app/use-case/get-public-events.use-case";
import { GetEventRankingUseCase } from "./app/use-case/get-event-ranking.use-case";
import { FinishEventUseCase } from "./app/use-case/finish-event.use-case";
import { StartRoundUseCase } from "./app/use-case/start-round.use-case";
import { EventRepository } from "./domain/repository/event.repo";
import { EventRepositoryImpl } from "./infra/repo/prisma-event.repo";
import { EventRoundResultRepositoryImpl } from "./infra/repo/prisma-event-round-result.repo";
import { EventRoundResultRepository } from "./app/repo/event-round-result.repo";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { EventBusAdapter } from "@shared/adapters/event-bus/event-bus.adapter";
import { EventGateway } from "./presentation/gateways/event.gateway";
import { EventListener } from "./infra/listeners/event.listener";
import { EventScheduler } from "./infra/cron/event.scheduler";
import { UserModule } from "@modules/user/user.module";
import { GetEventsUseCase } from "./app/use-case/get-events.use-case";
import { SubmitRoundResultsUseCase } from "./app/use-case/submit-round-results.use-case";
import { TextPoolModule } from "@shared/modules/text-pool/text-pool.module";
import { GetUserEventXpTransactionsUseCase } from "./app/use-case/get-user-event-xp-transactions.use-case";
import { GetUserEventWinsUseCase } from "./app/use-case/get-user-event-wins.use-case";
import { CloseRoundUseCase } from "./app/use-case/close-round.use-case";
import { CloseRoundProcessor } from "./infra/jobs/close-round.processor";

@Module({
  imports: [TextPoolModule, BullModule.registerQueue({ name: "events" })],
  controllers: [EventController],
  providers: [
    EventService,
    EventGateway,
    EventListener,
    EventScheduler,
    CreateEventUseCase,
    AddEventRoundUseCase,
    ScheduleEventUseCase,
    StartEventUseCase,
    InviteParticipantUseCase,
    SubmitRoundResultsUseCase,
    AcceptInviteUseCase,
    GetEventUseCase,
    GetPublicEventsUseCase,
    GetEventRankingUseCase,
    FinishEventUseCase,
    StartRoundUseCase,
    CloseRoundUseCase,
    CloseRoundProcessor,
    GetEventsUseCase,
    GetUserEventXpTransactionsUseCase,
    GetUserEventWinsUseCase,
    {
      provide: EventRepository,
      useClass: EventRepositoryImpl,
    },
    {
      provide: EventRoundResultRepository,
      useClass: EventRoundResultRepositoryImpl,
    },
  ],
  exports: [EventRepository],
})
export class EventModule {}
