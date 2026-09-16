"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { StatusTheme } from "./config";

interface StatusHeroProps {
  theme: StatusTheme;
  id: string;
  completedAt: string | Date;
  labels: {
    performance: string;
    summary: string;
    session: string;
  };
}

export function StatusHero({ theme, id, completedAt, labels }: StatusHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl text-center mb-16 space-y-4"
    >
      <div
        className={cn(
          "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-4 transition-colors",
          theme.bgColor,
          theme.borderColor,
          theme.color,
        )}
      >
        {theme.icon} {theme.label}
      </div>

      

      <h1 className="text-5xl font-bold font-mono tracking-tighter uppercase sm:text-7xl">
        {labels.performance}{" "}
        <span className={cn("shadow-glow", theme.color)}>{labels.summary}</span>
      </h1>
      <p className="text-muted-foreground font-mono text-xs uppercase tracking-[0.4em] max-w-lg mx-auto leading-relaxed">
        {theme.subtitle}
        <br />
        <span className="opacity-40">
          {labels.session} {id.slice(0, 8)} •{" "}
          {new Date(completedAt).toLocaleTimeString()}
        </span>
      </p>
    </motion.div>
  );
}
