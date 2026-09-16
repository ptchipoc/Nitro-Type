"use client";

import { Zap, Trophy, Award, Calendar } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { EVENTS_LABELS } from "./constants";

export interface EventsShowcaseProps {
  totalXp: number;
  rank: number;
  totalEvents: number;
  eventsWon: number;
}

export function EventsShowcase({ totalXp, rank, totalEvents, eventsWon }: EventsShowcaseProps) {
  const { locale } = useTranslation();
  const labels = EVENTS_LABELS[locale];
  return (
    <div className="space-y-8">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ProfileStat
          label={labels.events}
          value={totalEvents.toString()}
          icon={<Calendar className="h-3 w-3" />}
        />
        <ProfileStat
          label={labels.wins}
          value={eventsWon.toString()}
          icon={<Trophy className="h-3 w-3 text-amber-500" />}
        />
        <ProfileStat
          label={labels.totalXp}
          value={totalXp.toString()}
          icon={<Zap className="h-3 w-3 text-primary" />}
        />
        <ProfileStat
          label={labels.currentRank}
          value={rank.toString()}
          icon={<Award className="h-3 w-3 text-purple-400" />}
        />
      </div>
    </div>
  );
}

function ProfileStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-sm border border-border bg-card/40 flex flex-col justify-between">
      <div className="flex items-center gap-1.5 mb-2">
        {icon}
        <span className="text-[9px] font-mono text-muted-foreground uppercase leading-none">
          {label}
        </span>
      </div>
      <div className="text-xl font-mono font-bold tracking-tight">{value}</div>
    </div>
  );
}


