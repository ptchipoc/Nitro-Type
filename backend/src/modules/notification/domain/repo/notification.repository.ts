import { NotificationEntity } from "../entities/notification.entity";

export abstract class NotificationRepository {
  abstract save(notification: NotificationEntity): Promise<void>;
  abstract findById(id: string): Promise<NotificationEntity | null>;
  abstract findByRecipient(
    recipientId: string,
    page: number,
    limit: number,
  ): Promise<NotificationEntity[]>;
  abstract countUnread(recipientId: string): Promise<number>;
  abstract markAsRead(id: string): Promise<void>;
  abstract markAllAsRead(recipientId: string): Promise<void>;
}
