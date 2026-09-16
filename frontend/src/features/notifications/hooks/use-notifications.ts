"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationPaginationInput } from "../inputs/input";
import { getNotifications } from "../queries/get-notifications";
import { readNotification } from "../actions/read-notification.action";
import { readAllNotifications } from "../actions/read-all-notification.action";

export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (params: NotificationPaginationInput) =>
    [...notificationKeys.lists(), params] as const,
};

export function useNotifications(
  params: NotificationPaginationInput = { page: 1, limit: 20 },
) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => getNotifications(params),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60, // 1 min
  });
}

export function useReadNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => readNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useReadAllNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => readAllNotifications(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
