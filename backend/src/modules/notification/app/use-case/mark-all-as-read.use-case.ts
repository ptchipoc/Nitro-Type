import { NotificationRepository } from "@modules/notification/domain/repo/notification.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MarkAllAsReadUseCase {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  async execute(recipientId: string): Promise<void> {
    await this.notificationRepo.markAllAsRead(recipientId);
  }
}
