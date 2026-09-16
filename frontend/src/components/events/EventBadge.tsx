"use client";

import { cn } from "@/lib/utils";
import { Zap, Clock } from "lucide-react";
import { EventStatus } from "@/lib/api/endpoints/events/event.type";
import { useTranslation } from "@/lib/i18n";
import { statusLabels } from "./eventBadge.constant";

interface BadgeProps {
  value: EventStatus;
  className?: string;
}

const statusColorConfig = {
  WAITING: {
    color: "text-gray-400 border-gray-400/30 bg-gray-400/5",
    icon: Clock,
  },
  SCHEDULED: {
    color: "text-blue-400 border-blue-400/30 bg-blue-400/5",
    icon: Clock,
  },
  BETWEEN_ROUNDS: {
    color: "text-blue-400 border-blue-400/30 bg-blue-400/5",
    icon: Clock,
  },
  ACTIVE: {
    color: "text-green-400 border-green-400/30 bg-green-400/5 pulse",
    icon: Zap,
  },
  FINISHED: {
    color: "text-muted-foreground border-border bg-muted/5",
    icon: Clock,
  },
};

export function EventBadge({ value, className }: BadgeProps) {
  const { locale } = useTranslation();
  const labels = statusLabels[locale as keyof typeof statusLabels] || statusLabels.en;
  const colorConfig = statusColorConfig[value] || statusColorConfig.FINISHED;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 py-0.5 px-2 rounded-sm border text-[10px] font-mono font-bold uppercase tracking-wider",
        colorConfig.color,
        className,
      )}
    >
      {value === "ACTIVE" && (
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      )}
      {labels[value as keyof typeof labels]}
    </div>
  );
}
