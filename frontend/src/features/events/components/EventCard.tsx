"use client";

import { motion } from "framer-motion";
import { Users, Lock, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import {
  EventStatus,
  EventType,
  TypingEvent,
} from "@/lib/api/endpoints/events/event.type";
import { EventBadge } from "@/components/events/EventBadge";
import { useRouter } from "next/navigation";
import { eventCardLabelsByLocale } from "./constants";

interface Props {
  event: TypingEvent;
  index: number;
}

export function EventCard({ event, index }: Props) {
  const { locale } = useTranslation();
  const router = useRouter();
  const labels = eventCardLabelsByLocale[locale as keyof typeof eventCardLabelsByLocale] || eventCardLabelsByLocale.en;
  const isPublic = event.type === EventType.PUBLIC;
  const isScheduled = event.status === EventStatus.SCHEDULED;
  const isFinished = event.status === EventStatus.FINISHED;

  let participantPercentage = event.participants.length;
  if (event.maxParticipants) {
    participantPercentage =
      (event.participants.length / event.maxParticipants) * 100;
  }
  const onClick = () => {
    router.push(`/events/${event.id}`);
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className={cn(
        "group relative flex flex-col rounded-sm border bg-card/40 glass overflow-hidden transition-all cursor-pointer",
        isPublic
          ? "border-primary/20 hover:border-primary/40"
          : "border-border hover:border-border/80",
      )}
      onClick={onClick}
    >
      {/* Official Gold Stamp */}
      {isPublic && (
        <div className="absolute top-0 right-0 px-2 py-1 bg-primary border-b border-l border-primary/20 rounded-bl-sm flex items-center gap-1 z-10">
          <ShieldCheck className="h-3 w-3 text-white" />
          <span className="text-[9px] font-mono font-bold text-white uppercase tracking-tighter">
            {labels.official}
          </span>
        </div>
      )}
      {!isPublic && (
        <div className="absolute top-0 right-0 px-2 py-1 bg-primary/10 border-b border-l border-primary/20 rounded-bl-sm flex items-center gap-1 z-10">
          <Lock className="h-3 w-3 text-muted-foreground/60" />
          <span className="text-[9px] font-mono font-bold text-primary uppercase tracking-tighter">
            {labels.event}
          </span>
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col">
        {/* Modality & Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <EventBadge value={event.status} />
          </div>
        </div>

        {/* Title & Description */}
        <div className="block mb-2 group-hover:text-primary transition-colors">
          <h3 className="font-mono text-sm font-bold leading-tight">
            {event.name}
          </h3>
        </div>
        <p className="text-[11px] text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {event.description}
        </p>

        {/* Participants */}
        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Users className="h-3 w-3" />
              <span>
                {event.participants.length}
                {event.maxParticipants
                  ? ` / ${event.maxParticipants}`
                  : ""}{" "}
                {labels.participating}
              </span>
            </div>
            {event.maxParticipants && (
              <span>
                {Math.round(participantPercentage)}% {labels.full}
              </span>
            )}
          </div>
          {event.maxParticipants && (
            <Progress
              value={participantPercentage}
              className="h-1 bg-muted/30"
            />
          )}
        </div>
      </div>

      {/* Rewards / Info Footer */}
      <div
        className={cn(
          "px-4 py-3 border-t bg-muted/10 flex items-center justify-between",
          isPublic ? "border-primary/10" : "border-border/50",
        )}
      >
        {isPublic && event.medals ? (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {event.medals.slice(0, 3).map((medal, i) => (
                <div
                  key={medal.id}
                  className="w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-[10px] relative z-[i]"
                  style={{ color: getMedalColor(medal.medalType) }}
                  title={
                    medal.rankPosition ? `Rank ${medal.rankPosition}` : "Medal"
                  }
                >
                  {getMedalIcon(medal.medalType)}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1 ml-1 text-[10px] font-mono font-bold text-primary">
              <Zap className="h-3 w-3" />
              <span>{labels.xpActive}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground italic">
            <Zap className="h-3 w-3 opacity-30" />
            <span>{labels.casualPersonal}</span>
          </div>
        )}

        <div className="text-[10px] font-mono text-muted-foreground/80">
          {isScheduled ? (
            <span className="text-green-500">{labels.ongoing}</span>
          ) : isFinished ? (
            <span>{labels.finished}</span>
          ) : (
            <span>
              {labels.starts}{" "}
              {new Date(event.scheduledAt ?? "").toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function getMedalColor(medalType: string) {
  switch (medalType) {
    case "GOLD":
      return "#FFD700";
    case "SILVER":
      return "#C0C0C0";
    case "BRONZE":
      return "#CD7F32";
    default:
      return "#FFFFFF";
  }
}

function getMedalIcon(medalType: string) {
  switch (medalType) {
    case "GOLD":
      return "🥇";
    case "SILVER":
      return "🥈";
    case "BRONZE":
      return "🥉";
    default:
      return "🏅";
  }
}

function getMedalLabel(medalType: string, labels: any) {
  switch (medalType) {
    case "GOLD":
      return labels.goldMedal;
    case "SILVER":
      return labels.silverMedal;
    case "BRONZE":
      return labels.bronzeMedal;
    default:
      return labels.medal;
  }
}
