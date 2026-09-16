"use client";

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { PROFILE_LABELS } from "./constants";

export function RankingHero() {
  const { locale } = useTranslation();
  const labels = PROFILE_LABELS[locale as keyof typeof PROFILE_LABELS] || PROFILE_LABELS.en;

  return (
    <div className="text-center mb-16 relative">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-block"
      >
        <Badge variant="outline" className="mb-4 border-primary/30 text-primary uppercase tracking-[0.2em] px-4 py-1">
          {labels.RankingHero.hallOfFame}
        </Badge>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4"
      >
        <span className="text-primary italic">{labels.RankingHero.title}</span>
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base"
      >
        {labels.RankingHero.description}
      </motion.p>

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] pointer-events-none opacity-10 bg-[radial-gradient(circle,var(--primary)_0%,transparent_70%)] blur-3xl -z-10" />
    </div>
  );
}
