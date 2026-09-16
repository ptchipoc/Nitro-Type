"use client";

import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import {
  Notification,
  NotificationType,
} from "@/lib/api/endpoints/notifications/notification.type";
import { useTranslation } from "@/lib/i18n";
import { useReadNotification } from "@/features/notifications/hooks/use-notifications";

interface NotificationItemProps {
  notification: Notification;
}

const typeIcons: Record<NotificationType, string> = {
  [NotificationType.SYSTEM]: "⚡",
  [NotificationType.COMMUNITY]: "👥",
  [NotificationType.EVENT]: "🏆",
  [NotificationType.DIRECT_MESSAGE]: "💬",
};

const typeNames: Record<NotificationType, Record<string, string>> = {
  [NotificationType.SYSTEM]: { pt: "Sistema", en: "System", fr: "Système" },
  [NotificationType.COMMUNITY]: { pt: "Comunidade", en: "Community", fr: "Communauté" },
  [NotificationType.EVENT]: { pt: "Evento", en: "Event", fr: "Événement" },
  [NotificationType.DIRECT_MESSAGE]: { pt: "Mensagem", en: "Message", fr: "Message" },
};

import { useRouter } from "next/navigation";

export function NotificationItem({ notification }: NotificationItemProps) {
  const { locale } = useTranslation();
  const { mutate: readNotification } = useReadNotification();
  const router = useRouter();

  const handleRead = () => {
    if (!notification.isRead) {
      readNotification(notification.id);
    }

    // Redirect logic for community and DM notifications
    if (notification.type === NotificationType.COMMUNITY || notification.type === NotificationType.DIRECT_MESSAGE) {
      if (notification.metadata?.channelId) {
        // Pre-select the channel if the user has access to it
        try {
          localStorage.setItem("community_selected_id", notification.metadata.channelId);
        } catch (e) { }
      }
      router.push("/community");
    }
  };

  const dateLocale = locale === "pt" ? ptBR : enUS;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`relative flex items-start gap-4 p-4 transition-colors cursor-pointer hover:bg-muted/30 ${!notification.isRead
        ? "bg-muted/10 border-l-2 border-primary"
        : "opacity-80"
        }`}
      onClick={handleRead}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-lg">
        {typeIcons[notification.type]}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            {typeNames[notification.type][locale] ||
              typeNames[notification.type]["en"]}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
              locale: dateLocale,
            })}
          </span>
        </div>

        <h4
          className={`text-sm font-bold truncate ${!notification.isRead ? "text-foreground" : "text-muted-foreground"}`}
        >
          {notification.title}
        </h4>

        <p
          className={`text-xs mt-1 leading-relaxed ${!notification.isRead ? "text-foreground/80" : "text-muted-foreground/70"}`}
        >
          {notification.message}
        </p>
      </div>

      {!notification.isRead && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </div>
      )}
    </motion.div>
  );
}
