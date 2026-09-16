export enum NotificationType {
  SYSTEM = "SYSTEM",
  COMMUNITY = "COMMUNITY",
  EVENT = "EVENT",
  DIRECT_MESSAGE = "DIRECT_MESSAGE",
}

export interface NotificationMetadata {
  action: "EVENT_INVITE" | "EVENT_ACCEPTED" | "EVENT_STARTED" | "EVENT_RESULT";
  eventId?: string;
  eventName?: string;
  channelId?: string;
  channelName?: string;
  senderId?: string;
  senderUsername?: string;
  reason?: string;
  [key: string]: any;
}

export interface Notification {
  id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata: NotificationMetadata;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationList {
  data: Notification[];
  unreadCount: number;
  page: number;
  limit: number;
}
