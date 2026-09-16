"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { PROFILE_LABELS } from "./constants";

interface RankingTableProps {
  remaining: any[];
}

export function RankingTable({ remaining }: RankingTableProps) {
  const { locale } = useTranslation();
  const labels = PROFILE_LABELS[locale as keyof typeof PROFILE_LABELS] || PROFILE_LABELS.en;

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-12 px-6 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
        <div className="col-span-1">{labels.RankingTable.rankingHeader}</div>
        <div className="col-span-5 md:col-span-6">{labels.RankingTable.programmerHeader}</div>
        <div className="col-span-3 md:col-span-2 text-right">{labels.RankingTable.levelHeader}</div>
        <div className="col-span-3 text-right">{labels.RankingTable.xpTotalHeader}</div>
      </div>

      <div className="space-y-2">
        {remaining.map((user) => (
          <motion.div
            key={user.id}
            variants={itemVariants}
            whileHover={{ x: 4 }}
            className="grid grid-cols-12 items-center px-6 py-4 rounded-xl border border-border/50 bg-card/20 hover:bg-card/40 transition-all group"
          >
            <div className="col-span-1 font-mono text-xs font-bold text-muted-foreground">
              {user.rankGlobal}
            </div>

            <div className="col-span-5 md:col-span-6 flex items-center gap-4">
              <Avatar className="h-10 w-10 border border-border group-hover:border-primary/50 transition-colors">
                <AvatarImage src={user.avatarUrl || "/default-image.png"} alt={user.name} />
                <AvatarFallback className="bg-muted text-[10px]">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h3 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{user.name}</h3>
                <p className="text-[10px] text-muted-foreground uppercase">{user.progress?.rankTitle || labels.RankingTable.novice}</p>
              </div>
            </div>

            <div className="col-span-3 md:col-span-2 text-right">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-mono text-[10px]">
                LVL {user.progress?.level || 1}
              </Badge>
            </div>

            <div className="col-span-3 text-right flex flex-col items-end">
              <span className="text-sm font-bold tabular-nums">
                {user.progress?.totalXp.toLocaleString()}
              </span>
              <span className="text-[9px] text-muted-foreground tracking-widest">{labels.RankingTable.xpSuffix}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
