import { Notification, NotificationList } from "./notification.type";

export interface NotificationResponse {
  success: boolean;
  data: Notification;
  ts: string;
}

export interface NotificationListResponse {
  success: boolean;
  data: NotificationList;
  ts: string;
}

export interface NotificationActionResponse {
  success: boolean;
  data: { success: boolean };
  ts: string;
}
