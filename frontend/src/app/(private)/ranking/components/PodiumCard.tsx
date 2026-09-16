"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { PROFILE_LABELS } from "./constants";

interface PodiumCardProps {
  user: any;
  position: number;
}

export function PodiumCard({ user, position }: PodiumCardProps) {
  const { locale } = useTranslation();
  const labels = PROFILE_LABELS[locale as keyof typeof PROFILE_LABELS] || PROFILE_LABELS.en;

  const configs = {
    1: {
      color: "from-yellow-400 to-yellow-600",
      shadow: "shadow-yellow-500/20",
      border: "border-yellow-500/50",
      bg: "bg-yellow-500/5"
    },
    2: {
      color: "from-slate-300 to-slate-500",
      shadow: "shadow-slate-400/20",
      border: "border-slate-400/50",
      bg: "bg-slate-400/5"
    },
    3: {
      color: "from-amber-600 to-amber-800",
      shadow: "shadow-amber-700/20",
      border: "border-amber-700/50",
      bg: "bg-amber-700/5"
    }
  }[position as 1 | 2 | 3];

  return (
    <Card className={cn(
      "border-2 transition-all duration-500 hover:scale-[1.02]",
      configs.border,
      configs.shadow,
      configs.bg,
      "overflow-hidden relative group"
    )}>
      <div className={cn("h-1.5 w-full bg-gradient-to-r", configs.color)} />

      <CardContent className="pt-8 pb-6 text-center">
        <div className="relative inline-block mb-4">
          <div className={cn(
            "absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs z-10 shadow-lg",
            configs.color === "from-yellow-400 to-yellow-600" ? "bg-yellow-500" :
              configs.color === "from-slate-300 to-slate-500" ? "bg-slate-400" : "bg-amber-600"
          )}>
            {position}
          </div>
          <Avatar className={cn(
            "h-24 w-24 border-2 transition-transform duration-500 group-hover:rotate-3",
            configs.border
          )}>
            <AvatarImage src={user.avatarUrl || "/default-image.png"} alt={user.name} />
            <AvatarFallback className="bg-muted text-lg">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>

        <h3 className="text-lg font-black tracking-tighter truncate px-2 mb-1 group-hover:text-primary transition-colors">
          {user.name}
        </h3>

        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-4">
          {user.progress?.rankTitle || labels.PodiumCard.novice}
        </p>

        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border/50">
          <div className="text-left">
            <p className="text-[8px] uppercase text-muted-foreground font-bold">{labels.PodiumCard.level}</p>
            <p className="text-sm font-black text-primary">LVL {user.progress?.level || 1}</p>
          </div>
          <div className="text-right">
            <p className="text-[8px] uppercase text-muted-foreground font-bold">{labels.PodiumCard.xpTotal}</p>
            <p className="text-sm font-black tabular-nums">{user.progress?.totalXp.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-2 justify-center">
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-[8px] uppercase font-bold text-muted-foreground">{user.progress?.totalEvents || 0} {labels.PodiumCard.events}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
              <Trophy className="w-4 h-4" />
            </div>
            <span className="text-[8px] uppercase font-bold text-muted-foreground">{user.progress?.eventsWon || 0} {labels.PodiumCard.victories}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
