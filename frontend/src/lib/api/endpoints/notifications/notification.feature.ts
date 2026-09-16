import { apiFetch } from "../../client";
import {
  NotificationListResponse,
  NotificationResponse,
  NotificationActionResponse,
} from "./notification.response";
import { NotificationPaginationInput } from "./notification.input";

export function getNotifications(params: NotificationPaginationInput) {
  const query = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
  }).toString();
  return apiFetch<NotificationListResponse>(`/notifications?${query}`);
}

export function readNotification(id: string) {
  return apiFetch<NotificationResponse>(`/notifications/${id}/read`, {
    method: "GET", // Backend says POST or GET? The user said /{id}/read
  });
}

export function readAllNotifications() {
  return apiFetch<NotificationActionResponse>("/notifications/read-all", {
    method: "GET",
  });
}
