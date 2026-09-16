"use client";

import { motion } from "framer-motion";
import { MapPin, Mail, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getXpForLevel } from "@/data/mock-data";
import { useTranslation } from "@/lib/i18n";
import type { User, UserProfile } from "@/types/user";
import type { UserModuleProgress } from "@/types/progression";

const labelsByLocale = {
  pt: { since: "Desde", totalXp: "XP Total", bestModule: "Melhor módulo", sessions: "Sessões", level: "Nível" },
  en: { since: "Since", totalXp: "Total XP", bestModule: "Best module", sessions: "Sessions", level: "Level" },
  fr: { since: "Depuis", totalXp: "XP total", bestModule: "Meilleur module", sessions: "Sessions", level: "Niveau" },
};

interface HeroBannerProps {
  user: User;
  profile: UserProfile;
  totalXp: number;
  topModule: UserModuleProgress;
  totalSessions: number;
  memberSince: string;
  moduleNames: Record<string, string>;
}

function StatChip({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5 min-w-[70px]">
      <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
        {label}
      </span>
      <span
        className={`text-base font-mono font-bold leading-none ${accent ? "text-primary text-glow" : "text-foreground"}`}
      >
        {value}
      </span>
    </div>
  );
}

export function HeroBanner({
  user,
  profile,
  totalXp,
  topModule,
  totalSessions,
  memberSince,
  moduleNames,
}: HeroBannerProps) {
  const { locale } = useTranslation();
  const labels = labelsByLocale[locale];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden border-b border-border mt-20"
      style={{ minHeight: 200 }}
    >
      {/* Dark textured background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-20" />
        {/* Neon accent line across top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />
        {/* Diagonal slash decoration */}
        <div
          className="absolute right-0 top-0 w-1/3 h-full opacity-10"
          style={{
            background:
              "linear-gradient(135deg, transparent 40%, hsl(var(--primary)/0.3) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-end gap-4 p-6 pt-8">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="h-24 w-24 rounded-sm border-2 border-primary bg-card flex items-center justify-center box-glow">
            {/* Placeholder for Avatar */}
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold text-xl">
                {user?.name?.charAt(0) || "N"}
              </span>
            </div>
          </div>
          {/* Online dot */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary border-2 border-[hsl(220_20%_4%)]" />
        </div>

        {/* Identity */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-mono font-bold text-foreground tracking-tight">
              {user?.name || "Neo Coder"}
            </h1>
            <Badge className="font-mono text-[10px] bg-primary/15 text-primary border border-primary/30 rounded-sm">
              Lv.{topModule.level}
            </Badge>
            <Badge className="font-mono text-[10px] bg-[--neon-cyan]/10 text-[--neon-cyan] border border-[--neon-cyan]/30 rounded-sm">
              {topModule.rankTitle}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground font-mono mt-0.5">
            @{profile?.username || "recruta"}
          </p>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-md">
            {profile?.bio || "Carregando bio..."}
          </p>

          <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {profile?.country || "Earth"}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {user?.email || "user@NT.dev"}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {labels.since} {memberSince}
            </span>
          </div>
        </div>

        {/* Stat chips row — right side */}
        <div className="flex flex-row sm:flex-col gap-6 sm:gap-3 sm:items-end shrink-0">
          <StatChip label={labels.totalXp} value={totalXp.toLocaleString()} accent />
          <StatChip
            label={labels.bestModule}
            value={moduleNames[topModule.moduleSlug]}
          />
          <StatChip label={labels.sessions} value={String(totalSessions)} />
        </div>
      </div>

      {/* XP level bar strip at bottom of banner */}
      <div className="relative z-10 px-6 pb-4">
        <div className="flex items-center gap-3 max-w-sm">
          <span className="text-[10px] font-mono text-muted-foreground shrink-0">
            {labels.level} {topModule.level}
          </span>
          <div className="flex-1 h-[3px] bg-border/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(100, ((topModule.totalXp - getXpForLevel(topModule.level)) / (getXpForLevel(topModule.level + 1) - getXpForLevel(topModule.level))) * 100)}%`,
              }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="h-full bg-primary rounded-full"
            />
          </div>
          <span className="text-[10px] font-mono text-primary shrink-0">
            Nível {topModule.level + 1}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {profile?.languages.map((lang) => (
            <span
              key={lang}
              className="text-[10px] font-mono px-1.5 py-0.5 border border-border/60 text-muted-foreground rounded-[2px]"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
