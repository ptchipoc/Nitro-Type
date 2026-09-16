"use client";

import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { StatusCard } from "./TypingUI";
import { Labels } from "./constants";

interface ModuleStatusProps {
  labels: Labels;
  totalUserXp: number;
  userRank: number;
  lastSessionWpm: number;
  lastSessionAccuracy: number;
  sessionsToday: string;
  currentLevel: number;
  rankTitle: string;
  totalXp: number;
}

export function ModuleStatus({
  labels,
  totalUserXp,
  userRank,
  lastSessionWpm,
  lastSessionAccuracy,
  sessionsToday,
  currentLevel,
  rankTitle,
  totalXp,
}: ModuleStatusProps) {
  return (
    <div className="rounded-sm border border-border bg-card/40 p-6 glass relative overflow-hidden">
      <div className="absolute right-0 top-0 flex h-16 w-16 items-center justify-center rounded-bl-full bg-primary/5">
        <Target className="h-6 w-6 text-primary/40" />
      </div>
      <h3 className="mb-8 text-xs font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground">
        {labels.moduleStatus}
      </h3>

      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <StatusCard
            label={labels.totalUserXp}
            value={`${totalUserXp}`}
            unit="XP"
          />
          <StatusCard
            label={labels.userRank}
            value={`#${userRank}`}
            unit=""
          />
          <StatusCard
            label={labels.sessionsToday}
            value={sessionsToday}
            unit="solo"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-mono font-bold text-primary">
              LVL {currentLevel}
            </p>
            <p className="mt-1 text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
              {labels.globalProgress}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono font-bold uppercase">{rankTitle}</p>
            <p className="mt-1 text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
              {labels.rankLabel}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min((totalXp / 5000) * 100, 100)}%`,
              }}
              className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-4">
          <StatusCard label={labels.lastSessionWpm} value={`${lastSessionWpm}`} unit="WPM" />
          <StatusCard label={labels.lastSessionAccuracy} value={`${lastSessionAccuracy}`} unit="%" accent />
        </div>
      </div>
    </div>
  );
}
