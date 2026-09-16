import { DomainEvent } from "@shared/entities/domain-event.base";
import { NotificationEntity } from "../entities/notification.entity";

export class NotificationCreatedEvent extends DomainEvent {
  constructor(public readonly notification: NotificationEntity) {
    super("notification.created");
  }
}
