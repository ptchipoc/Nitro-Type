import { Module } from "@nestjs/common";
import { NotificationController } from "./presentation/controllers/notification.controller";
import { NotificationsService } from "./app/services/notifications.service";
import { NotificationGateway } from "./presentation/gateways/notification.gateway";
import { NotificationRepository } from "./domain/repo/notification.repository";
import { NotificationRepositoryImpl } from "./infra/repo/notification.repository";
import { NotificationListener } from "./infra/listeners/notification.listener";
import { ListNotificationsUseCase } from "./app/use-case/list-notifications.use-case";
import { MarkAsReadUseCase } from "./app/use-case/mark-as-read.use-case";
import { MarkAllAsReadUseCase } from "./app/use-case/mark-all-as-read.use-case";
import { SendNotificationUseCase } from "./app/use-case/send-notification.use-case";
import { EventBusModule } from "@shared/modules/events/event-bus.module";

@Module({
  controllers: [NotificationController],
  providers: [
    NotificationsService,
    ListNotificationsUseCase,
    MarkAsReadUseCase,
    MarkAllAsReadUseCase,
    NotificationGateway,
    SendNotificationUseCase,
    NotificationListener,
    {
      provide: NotificationRepository,
      useClass: NotificationRepositoryImpl,
    },
  ],
  exports: [NotificationGateway, NotificationsService],
})
export class NotificationModule {}
