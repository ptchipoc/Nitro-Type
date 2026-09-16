"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Award, Coins, Crown, Medal as MedalIcon, Sparkles } from "lucide-react";
import {
  EventMedal,
  MedalType,
} from "@/lib/api/endpoints/events/event.type";
import { cn } from "@/lib/utils";

type EventRewardsShowcaseProps = {
  baseXp: number;
  medals: EventMedal[];
  isPublic: boolean;
};

const medalMeta: Record<
  MedalType,
  {
    label: string;
    accent: string;
    glow: string;
    icon: ReactNode;
  }
> = {
  GOLD: {
    label: "Gold",
    accent: "text-amber-300",
    glow: "from-amber-500/30 via-amber-400/10 to-transparent",
    icon: <Crown className="h-5 w-5" />,
  },
  SILVER: {
    label: "Silver",
    accent: "text-slate-300",
    glow: "from-slate-400/25 via-slate-300/10 to-transparent",
    icon: <MedalIcon className="h-5 w-5" />,
  },
  BRONZE: {
    label: "Bronze",
    accent: "text-orange-300",
    glow: "from-orange-500/25 via-orange-400/10 to-transparent",
    icon: <Award className="h-5 w-5" />,
  },
};

function formatXp(value: number) {
  return new Intl.NumberFormat("pt-PT").format(value);
}

export function EventRewardsShowcase({
  baseXp,
  medals,
  isPublic,
}: EventRewardsShowcaseProps) {
  if (!isPublic) {
    return null;
  }

  const sortedMedals = [...medals].sort((a, b) => a.rankPosition - b.rankPosition);
  const totalXp = sortedMedals.reduce((sum, medal) => sum + (medal.baseXp || 0), 0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-sm border border-primary/20 bg-card/50 glass p-6 md:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent" />

      <div className="relative flex items-start justify-between gap-4 mb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Recompensas Públicas
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-black uppercase tracking-tight">
              Medalhas e XP em Jogo
            </h3>
            <p className="mt-1 max-w-2xl text-xs md:text-sm text-muted-foreground">
              Evento público com prémios visíveis antes de entrar na arena.
              Vês aqui o que está em disputa e quanto XP está disponível.
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 rounded-sm border border-primary/20 bg-background/40 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-primary">
          <Coins className="h-3.5 w-3.5" />
          {formatXp(totalXp + baseXp)} XP Total
        </div>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          {sortedMedals.length > 0 ? (
            sortedMedals.map((medal) => {
              const meta = medalMeta[medal.medalType];

              return (
                <article
                  key={medal.id}
                  className={cn(
                    "relative overflow-hidden rounded-sm border border-border bg-card/40 p-4",
                    "shadow-[0_0_0_1px_rgba(255,255,255,0.02)]",
                  )}
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 bg-linear-to-br opacity-70",
                      meta.glow,
                    )}
                  />
                  <div className="relative flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <div className={cn("inline-flex items-center gap-2 text-sm font-black uppercase", meta.accent)}>
                        {meta.icon}
                        {meta.label}
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                          Lugar #{medal.rankPosition}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Medalha reservada para quem terminar em {medal.rankPosition}º lugar.
                        </p>
                      </div>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/70 text-sm font-black text-foreground">
                      {medal.rankPosition}
                    </div>
                  </div>

                  <div className="relative mt-4 flex items-center justify-between rounded-sm border border-border/60 bg-background/60 px-3 py-2 text-[10px] font-black uppercase tracking-widest">
                    <span>Base XP</span>
                    <span className="text-primary">+{formatXp(medal.baseXp)} XP</span>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="md:col-span-3 rounded-sm border border-dashed border-border bg-background/30 p-6 text-sm text-muted-foreground">
              Este evento público ainda não tem medalhas configuradas.
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}