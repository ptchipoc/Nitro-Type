import { NotificationType } from "../enums/notification-type";

export interface CreateNotificationProps {
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
}
