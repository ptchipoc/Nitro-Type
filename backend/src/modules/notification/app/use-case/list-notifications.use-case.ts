import { NotificationRepository } from "@modules/notification/domain/repo/notification.repository";
import { Injectable } from "@nestjs/common";
import { ListNotificationsInput } from "../../presentation/inputs/list-motifications.input";

@Injectable()
export class ListNotificationsUseCase {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  async execute(input: ListNotificationsInput, userId: string) {
    const { page, limit } = input;

    const [notifications, unreadCount] = await Promise.all([
      this.notificationRepo.findByRecipient(userId, page, limit),
      this.notificationRepo.countUnread(userId),
    ]);

    return {
      data: notifications.map((n) => n.publicData()),
      unreadCount,
      page,
      limit,
    };
  }
}
