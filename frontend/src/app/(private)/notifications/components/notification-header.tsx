"use client";

import { motion } from "framer-motion";

import { useTranslation } from "@/lib/i18n";
import { CheckCheck } from "lucide-react";
import { useReadAllNotifications } from "@/features/notifications/hooks/use-notifications";

export function NotificationHeader() {
  const { locale } = useTranslation();
  const { mutate: readAll, isPending } = useReadAllNotifications();

  const labels = {
    pt: {
      title: "Notificações",
      markAllRead: "Marcar todas como lidas",
    },
    en: {
      title: "Notifications",
      markAllRead: "Mark all as read",
    },
    fr: {
      title: "Notifications",
      markAllRead: "Tout marquer comme lu",
    },
  };

  const currentLabels = labels[locale as keyof typeof labels] || labels.en;

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-mono font-bold tracking-tighter text-foreground">
          {currentLabels.title.toUpperCase()}
        </h1>
        <div className="h-1 w-12 bg-primary mt-1" />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => readAll()}
        disabled={isPending}
        className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest border border-border hover:bg-muted/50 transition-colors rounded-sm disabled:opacity-50"
      >
        <CheckCheck className="w-3 h-3" />
        {isPending ? "..." : currentLabels.markAllRead}
      </motion.button>
    </div>
  );
}
