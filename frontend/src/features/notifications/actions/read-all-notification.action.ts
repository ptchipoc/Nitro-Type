import { apiClient } from "@/features/apiClient";
import { NotificationActionResponse } from "../response/notification.response";

export function readAllNotifications() {
  return apiClient<NotificationActionResponse>("/notifications/read-all", {
    method: "PATCH",
  });
}
