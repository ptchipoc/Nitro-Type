"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { getXpForLevel } from "@/data/mock-data";
import { moduleIcons, moduleColors, moduleNames } from "./constants";
import type { UserModuleProgress } from "@/types/progression";

interface ModuleProgressProps {
  mockProgress: UserModuleProgress[];
}

export function ModuleProgress({ mockProgress }: ModuleProgressProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          Módulos
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {mockProgress.map((prog, i) => {
          const Icon = moduleIcons[prog.moduleSlug];
          const col = moduleColors[prog.moduleSlug];
          const xpNext = getXpForLevel(prog.level + 1);
          const xpCurr = getXpForLevel(prog.level);
          const pct = Math.min(
            100,
            ((prog.totalXp - xpCurr) / (xpNext - xpCurr)) * 100,
          );

          return (
            <motion.div
              key={prog.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className={`relative bg-card border border-border rounded-sm p-4 overflow-hidden group hover:border-primary/40 transition-colors duration-200 ${col.glow}`}
            >
              {/* Accent bar left edge */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-[3px] ${col.bar}`}
              />

              <div className="flex items-start justify-between mb-3 pl-2">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${col.text}`} />
                  <span className="font-mono text-xs font-bold text-foreground">
                    {moduleNames[prog.moduleSlug]}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                  <Star className="h-3 w-3" />
                  Rank {prog.rank}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pl-2 mb-3">
                <div>
                  <div className="text-[9px] text-muted-foreground uppercase font-mono">
                    Nível
                  </div>
                  <div
                    className={`text-xl font-mono font-bold leading-none mt-0.5 ${col.text}`}
                  >
                    {prog.level}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-muted-foreground uppercase font-mono">
                    XP
                  </div>
                  <div className="text-sm font-mono font-bold leading-none mt-0.5">
                    {prog.totalXp.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-muted-foreground uppercase font-mono">
                    Próximo
                  </div>
                  <div className="text-sm font-mono font-bold leading-none mt-0.5 text-muted-foreground">
                    {xpNext.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="pl-2">
                <div className="h-[2px] bg-border/60 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{
                      duration: 0.7,
                      delay: 0.2 + i * 0.06,
                    }}
                    className={`h-full ${col.bar}`}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] font-mono text-muted-foreground">
                    {prog.rankTitle}
                  </span>
                  <span className="text-[9px] font-mono text-muted-foreground">
                    {pct.toFixed(0)}%
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
