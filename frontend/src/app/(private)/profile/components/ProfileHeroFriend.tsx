"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Calendar, Mail} from "lucide-react";
import type { ApiUser } from "@/features/users/type";
import { ProfileEditModal } from "./ProfileEditModal";
import { PROFILE_LABELS } from "./constants";

export interface ProfileHeroProps {
  user: ApiUser | undefined;
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
    <div className="flex flex-col gap-0.5 min-w-17.5">
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

export function ProfileHero({
  user,
  memberSince,
  moduleNames,
}: ProfileHeroProps) {
  const { locale } = useTranslation();
  const labels = PROFILE_LABELS[locale as keyof typeof PROFILE_LABELS] || PROFILE_LABELS.pt;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const profile = user?.profile;
  const progress = user?.progress;
  


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden border-b border-border mt-20 relative"
      style={{ minHeight: 200 }}
    >
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
      />
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute right-0 top-0 w-1/3 h-full opacity-10"
          style={{
            background:
              "linear-gradient(135deg, transparent 40%, hsl(var(--primary)/0.3) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-end gap-6 p-6 pt-8">
        <div className="relative shrink-0">
          <div className="h-28 w-28 rounded-sm border-2 border-primary/50 bg-card overflow-hidden flex items-center justify-center box-glow relative group">
            {user?.avatarUrl ? (
              <Image
                alt={profile?.username || user?.name || "user"}
                src={user.avatarUrl}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <Image
                alt="default avatar"
                src="/default-image.png"
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background bg-primary box-glow-sm" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-2xl font-mono font-bold text-foreground tracking-tight flex items-center gap-2">
              {user?.name || "Neo Coder"}
              {user?.role === "ADMIN" && (
                <Badge variant="outline" className="text-[9px] h-4 border-primary/50 text-primary uppercase font-bold">Admin</Badge>
              )}
            </h1>
            <div className="flex items-center gap-2">
              <Badge className="font-mono text-[10px] bg-primary/10 text-primary border border-primary/20 rounded-sm">
                Lv.{progress?.level || 0}
              </Badge>
              <Badge className="font-mono text-[10px] bg-[--neon-cyan]/10 text-[--neon-cyan] border border-[--neon-cyan]/20 rounded-sm">
                {progress?.rankTitle || "Novato"}
              </Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-mono">
            @{profile?.username || user?.name?.toLowerCase().replace(/\s/g, "") || "recruta"}
          </p>

          <div className="mt-3 max-w-md h-10 overflow-hidden relative">
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              {profile?.bio || "O código é a única verdade. Decifrando a Matrix..."}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mt-4 text-[11px] text-muted-foreground font-mono">
            <span className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-default">
              <Mail className="h-3.5 w-3.5 text-primary/60" />
              {user?.email || "user@deep.io"}
            </span>
            <span className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-default">
              <Calendar className="h-3.5 w-3.5 text-primary/60" />
              {labels.activeSince} {memberSince}
            </span>
          </div>
        </div>

        <div className="flex flex-row sm:flex-col gap-8 sm:gap-4 sm:items-end shrink-0 border-l border-border/40 pl-6 h-full">
          <StatChip label={labels.totalXp} value={(progress?.totalXp || 0).toLocaleString()} accent />
          <StatChip label={labels.rank} value={`# ${user?.rankGlobal || "---"}`} />
          <StatChip label={labels.status} value={user?.status || "OFFLINE"} />
        </div>
      </div>
    </motion.div>
  );
}
