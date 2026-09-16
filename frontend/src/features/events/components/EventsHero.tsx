"use client";

import { motion } from "framer-motion";
import { Trophy, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/events/CountdownTimer";
import { useRouter } from "next/navigation";
import { TypingEvent } from "../types";


interface EventsHeroProps {
  event: TypingEvent | null | undefined;
  labels: {
    featuredOfficial: string;
    basePrize: string;
    legendaryReward: string;
    participants: string;
    startsIn: string;
    xpValid: string;
    joinNow: string;
    viewDetails: string;
  };
}

export function EventsHero({ event, labels }: EventsHeroProps) {
  const router = useRouter();

  if (!event) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mb-12 p-8 rounded-sm border border-primary/30 bg-card/60 glass overflow-hidden"
    >
      {/* Background Accent */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-primary text-primary-foreground text-[10px] font-mono font-bold uppercase tracking-widest">
              <Trophy className="h-3 w-3" />
              {labels.featuredOfficial}
            </div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              ppppppppppp
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-mono font-bold mb-4 leading-tight tracking-tight">
            {event.name}
          </h1>

          <p className="text-muted-foreground mb-6 max-w-xl leading-relaxed italic">
            &quot;{event.description}&quot;
          </p>

          <div className="flex items-center gap-6 mb-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
                {labels.basePrize}
              </span>
              <div className="flex items-center gap-2 text-primary font-mono font-bold">
                <Zap className="h-4 w-4" />
                <span>{labels.legendaryReward}</span>
              </div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
                {labels.participants}
              </span>
              <div className="font-mono font-bold text-foreground">
                {event.participants.length}
                {event.maxParticipants && ` / ${event.maxParticipants}`}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/80 text-primary-foreground font-mono font-bold h-12 px-8"
              onClick={() => router.push(`/events/${event.id}`)}
            >
              {labels.joinNow}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 font-mono"
              onClick={() => router.push(`/events/${event.id}`)}
            >
              {labels.viewDetails}
            </Button>
          </div>
        </div>

        {/* Countdown */}
        <div className="flex flex-col items-center p-6 rounded-sm border border-border bg-card/40 min-w-[240px]">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] mb-4">
            {labels.startsIn}
          </span>
          <CountdownTimer targetDate={event.scheduledAt ?? ""} />
          <div className="mt-6 flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-primary" />
            {labels.xpValid}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
