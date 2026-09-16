import { apiClient } from "@/features/apiClient";
import { NotificationPaginationInput } from "../inputs/input";
import { NotificationListResponse } from "../response/notification.response";

export function getNotifications(params: NotificationPaginationInput) {
  const query = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
  }).toString();
  return apiClient<NotificationListResponse>(`/notifications?${query}`);
}
