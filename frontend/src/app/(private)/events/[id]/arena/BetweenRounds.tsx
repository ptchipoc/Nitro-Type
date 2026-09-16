"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { labelsByLocale } from "../../components/details/constants";

interface BetweenRoundsProps {
  delaySeconds: number;
  nextRoundNumber: number;
}

export function BetweenRounds({
  delaySeconds,
  nextRoundNumber,
}: BetweenRoundsProps) {
  const { locale } = useTranslation();
  const labels = labelsByLocale[locale as keyof typeof labelsByLocale];
  const [timeLeft, setTimeLeft] = useState(delaySeconds);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center font-mono scanlines">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-8 text-center max-w-md mx-auto p-12 border border-primary/20 bg-primary/5 glass rounded-sm"
      >
        <div className="text-primary animate-pulse text-xs uppercase tracking-[0.3em] font-bold">
          {labels.getReady}
        </div>

        <div className="relative">
          <div className="text-8xl font-black text-foreground tabular-nums filter drop-shadow-[0_0_10px_rgba(var(--primary),0.3)]">
            {timeLeft}s
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-32 h-32 border-4 border-primary rounded-full animate-ping" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold uppercase tracking-tight">
            {labels.nextRound}: #{nextRoundNumber}
          </h2>
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: delaySeconds, ease: "linear" }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
            {labels.autoStart}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
