import { NotificationEntity } from "@modules/notification/domain/entities/notification.entity";
import { NotificationRepository } from "@modules/notification/domain/repo/notification.repository";
import { Injectable } from "@nestjs/common";
import { SendNotificationInput } from "../../presentation/inputs/send-notification.Input";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { NotificationCreatedEvent } from "@modules/notification/domain/events/notification-created.event";

@Injectable()
export class SendNotificationUseCase {
  constructor(
    private readonly repo: NotificationRepository,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(input: SendNotificationInput): Promise<void> {
    const notification = NotificationEntity.create(input);

    await this.repo.save(notification);

    this.eventBus.publish([new NotificationCreatedEvent(notification)]);
  }
}
