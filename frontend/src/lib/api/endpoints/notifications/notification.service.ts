import {
  getNotifications,
  readNotification,
  readAllNotifications,
} from "./notification.feature";
import { NotificationPaginationInput } from "./notification.input";

export async function fetchNotifications(params: NotificationPaginationInput) {
  const response = await getNotifications(params);
  if (!response.success) {
    throw new Error("Failed to fetch notifications");
  }
  return response.data;
}

export async function fetchReadNotification(id: string) {
  const response = await readNotification(id);
  if (!response.success) {
    throw new Error("Failed to mark notification as read");
  }
  return response.data;
}

export async function fetchReadAllNotifications() {
  const response = await readAllNotifications();
  if (!response.success) {
    throw new Error("Failed to mark all notifications as read");
  }
  return response.data;
}
