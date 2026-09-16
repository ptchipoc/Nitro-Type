import { apiClient } from "@/features/apiClient";
import { NotificationResponse } from "../response/notification.response";

export function readNotification(id: string) {
  return apiClient<NotificationResponse>(`/notifications/${id}/read`, {
    method: "PATCH",
  });
}

