"use client";

import { cn } from "@/lib/utils";
import {
  Notification,
  NotificationType,
} from "@/lib/api/endpoints/notifications/notification.type";
import {
  Bell,
  Calendar,
  MessageSquare,
  ShieldAlert,
  Users,
  ChevronRight,
  Circle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReadNotification } from "../hooks/use-notifications";
import { useTranslation } from "@/lib/i18n";
import { NOTIFICATION_LABELS } from "./constants";

interface NotificationItemProps {
  notification: Notification;
  onClose?: () => void;
}

export function NotificationItem({
  notification,
  onClose,
}: NotificationItemProps) {
  const readMutation = useReadNotification();

  const { locale } = useTranslation();
  const labels = NOTIFICATION_LABELS[locale as keyof typeof NOTIFICATION_LABELS] || NOTIFICATION_LABELS["en"];

  const router = useRouter();

  const getIcon = () => {
    switch (notification.type) {
      case NotificationType.EVENT:
        return <Calendar className="h-4 w-4 text-amber-500" />;
      case NotificationType.COMMUNITY:
        return <Users className="h-4 w-4 text-blue-500" />;
      case NotificationType.SYSTEM:
        return <ShieldAlert className="h-4 w-4 text-red-500" />;
      case NotificationType.DIRECT_MESSAGE:
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleRead = () => {
    if (!notification.isRead) {
      readMutation.mutate(notification.id);
    }
    onClose?.();

    // Redirect logic for community and DM notifications
    if (
      notification.type === NotificationType.COMMUNITY ||
      notification.type === NotificationType.DIRECT_MESSAGE
    ) {
      if (notification.metadata?.channelId) {
        // Pre-select the channel if the user has access to it
        try {
          localStorage.setItem(
            "community_selected_id",
            notification.metadata.channelId
          );
        } catch (e) { }
      }
      router.push("/community");
    }
  };

  const isInvite = notification.metadata?.action === "EVENT_INVITE";
  const eventId = notification.metadata?.eventId;
  const friendRequest = notification.metadata?.action === "FRIEND_REQUEST";

  return (
    <div
      className={cn(
        "group p-4 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors relative font-mono cursor-pointer",
        !notification.isRead && "bg-primary/5",
      )}
      onClick={handleRead}
    >
      {!notification.isRead && (
        <div className="absolute top-4 right-4 animate-pulse">
          <Circle className="h-2 w-2 fill-primary text-primary" />
        </div>
      )}

      <div className="flex gap-4">
        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card">
          {getIcon()}
        </div>

        <div className="flex-1 space-y-1">
          <p className="text-xs font-bold leading-none tracking-tight">
            {notification.title}
          </p>
          <p className="text-[10px] text-muted-foreground line-clamp-2">
            {notification.message}
          </p>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[9px] text-muted-foreground/60 uppercase tracking-widest">
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
                locale: ptBR,
              })}
            </span>

            {isInvite && eventId && (
              <Link
                href={`/events/${eventId}`}
                className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline group/btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRead();
                }}
              >
                {labels.see_event}
                <ChevronRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
              </Link>
            )}
            {friendRequest && (
              <Link
                href={`/friends/${notification.metadata?.senderId}`}
                className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline group/btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRead();
                }}
              >
                {labels.see_user}
                <ChevronRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
