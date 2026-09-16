"use client";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
import { notificationKeys } from "./use-notifications";
import { Notification, NotificationType } from "../type";
import { getSocketConfig } from "@/features/config";
import { metadata } from "@/app/layout";

let socket: Socket | null = null;

export function useNotificationSocket() {
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;

    if (!socket || !socket.connected) {
      const { origin, path } = getSocketConfig();
      socket = io(`${origin}/notifications`, {
        path,
        auth: { userId: user.id },
        transports: ["websocket"],
      });

      socket.on("connect", () => {
      });

      socket.on("disconnect", () => {
      });

      socket.on("notification", (notification: Notification) => {
        queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        if (notification.type === NotificationType.EVENT) {
          const ky = `event-${notification.metadata.eventId}`
          if (user.id == notification.metadata.receiverId) {
            queryClient.invalidateQueries({
              queryKey: [
                "events",
                "events-public",
                ky,
              ],
            });
            queryClient.refetchQueries({
              queryKey: [
                "events",
                "events-public",
                ky,
              ],
            });
          } else {
            queryClient.invalidateQueries({
              queryKey: ["events"],
            });
          }
        }
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [user?.id, queryClient]);

  return socket;
}

export function disconnectNotifications(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
