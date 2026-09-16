"use client";

import { motion } from "framer-motion";
import { EventBadge } from "./EventBadge";
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

interface Props {
  event: TypingEvent;
  index: number;
}

export function EventCard({ event, index }: Props) {
  const { locale } = useTranslation();
  const labels = {
    pt: {
      official: "Oficial",
      participating: "participando",
      full: "cheio",
      xpActive: "XP Ativo",
      casualPersonal: "Casual & Pessoal",
      ongoing: "A decorrer...",
      finished: "Terminado",
      starts: "Começa",
    },
    en: {
      official: "Official",
      participating: "participating",
      full: "full",
      xpActive: "Active XP",
      casualPersonal: "Casual & Personal",
      ongoing: "In progress...",
      finished: "Finished",
      starts: "Starts",
    },
    fr: {
      official: "Officiel",
      participating: "participants",
      full: "rempli",
      xpActive: "XP actif",
      casualPersonal: "Décontracté & Personnel",
      ongoing: "En cours...",
      finished: "Terminé",
      starts: "Commence",
    },
  }[locale];
  const isPublic = event.type === EventType.PUBLIC;
  const isScheduled = event.status === EventStatus.SCHEDULED;
  const isFinished = event.status === EventStatus.FINISHED;

  let participantPercentage = event.participants.length;
  if (event.maxParticipants) {
    participantPercentage =
      (event.participants.length / event.maxParticipants) * 100;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className={cn(
        "group relative flex flex-col rounded-sm border bg-card/40 glass overflow-hidden transition-all",
        isPublic
          ? "border-primary/20 hover:border-primary/40"
          : "border-border hover:border-border/80",
      )}
    >
      {/* Official Gold Stamp */}
      {isPublic && (
        <div className="absolute top-0 right-0 px-2 py-1 bg-primary/10 border-b border-l border-primary/20 rounded-bl-sm flex items-center gap-1 z-10">
          <ShieldCheck className="h-3 w-3 text-primary" />
          <span className="text-[9px] font-mono font-bold text-primary uppercase tracking-tighter">
            {labels.official}
          </span>
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col">
        {/* Modality & Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <EventBadge value={event.status} />
            {!isPublic && <Lock className="h-3 w-3 text-muted-foreground/60" />}
          </div>
          <EventBadge value={event.status} />
        </div>

        {/* Title & Description */}
        <Link
          href={`/events/${event.id}`}
          className="block mb-2 group-hover:text-primary transition-colors"
        >
          <h3 className="font-mono text-sm font-bold leading-tight">
            {event.name}
          </h3>
        </Link>
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
        {isPublic && event.rounds ? (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {/* TODO: Adicionar rewards */}
              {/* {event.rewards
                .filter((r) => r.type !== "XP")
                .slice(0, 3)
                .map((reward, i) => (
                  <div
                    key={reward.id}
                    className="w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-[10px] relative z-[i]"
                    style={{ color: getRarityColor(reward.rarity) }}
                    title={reward.value as string}
                  >
                    {reward.icon}
                  </div>
                ))} */}
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
