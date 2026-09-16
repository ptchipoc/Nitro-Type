"use client";

import { useState, useEffect } from "react";
import { X, Mail, Calendar, MapPin, Badge as BadgeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import type { ApiUser } from "@/features/users/type";
import { useTranslation } from "@/lib/i18n";
import { FRIENDS_LABEL } from "./constants";

interface UserProfileModalProps {
  user: ApiUser | null;
  isOpen: boolean;
  onClose: () => void;
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
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
        {label}
      </span>
      <span
        className={`text-base font-mono font-bold leading-none ${
          accent ? "text-primary text-glow" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function UserProfileModal({
  user,
  isOpen,
  onClose,
}: UserProfileModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const profile = user?.profile;
  const progress = user?.progress;
  const { locale } = useTranslation();
    const labels = FRIENDS_LABEL[locale as keyof typeof FRIENDS_LABEL] || FRIENDS_LABEL.pt;

  const nextLevelXp = (progress?.level ?? 0) * 1000 + 1000;
  const currentLevelXp = (progress?.level ?? 0) * 1000;
  const xpInCurrentLevel = (progress?.totalXp ?? 0) - currentLevelXp;
  const progressPercent = Math.min(
    100,
    Math.max(0, (xpInCurrentLevel / (nextLevelXp - currentLevelXp)) * 100)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:py-0"
          >
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-border/50 bg-background shadow-2xl relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </button>

              {/* Content */}
              <div className="relative overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className="absolute right-0 top-0 w-1/3 h-64 opacity-10"
                    style={{
                      background:
                        "linear-gradient(135deg, transparent 40%, hsl(var(--primary)/0.3) 100%)",
                    }}
                  />
                </div>

                <div className="relative z-10 p-6 sm:p-8">
                  {/* Header Section */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 mb-6 pb-6 border-b border-border/30">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-sm border-2 border-primary/50 bg-card overflow-hidden flex items-center justify-center box-glow relative group">
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

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h1 className="text-xl sm:text-2xl font-mono font-bold text-foreground tracking-tight">
                          {user?.name || "Neo Coder"}
                        </h1>
                        {user?.role === "ADMIN" && (
                          <Badge
                            variant="outline"
                            className="text-[9px] h-4 border-primary/50 text-primary uppercase font-bold"
                          >
                            {labels.admin}
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground font-mono mb-2">
                        @{profile?.username || user?.name?.toLowerCase().replace(/\s/g, "") || "recruta"}
                      </p>

                      <div className="flex gap-2 flex-wrap">
                        <Badge className="font-mono text-[10px] bg-primary/10 text-primary border border-primary/20 rounded-sm">
                          Lv.{progress?.level || 0}
                        </Badge>
                        <Badge className="font-mono text-[10px] bg-[--neon-cyan]/10 text-[--neon-cyan] border border-[--neon-cyan]/20 rounded-sm">
                          {progress?.rankTitle || "Novato"}
                        </Badge>
                        <Badge
                          className={cn(
                            "font-mono text-[10px] rounded-sm",
                            user?.status === "ACTIVE"
                              ? "bg-green-500/10 text-green-500 border border-green-500/20"
                              : "bg-red-500/10 text-red-500 border border-red-500/20"
                          )}
                        >
                          {user?.status || "OFFLINE"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Bio Section */}
                  {profile?.bio && (
                    <div className="mb-6 pb-6 border-b border-border/30">
                      <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-2">
                        Bio
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed italic">
                        {profile.bio}
                      </p>
                    </div>
                  )}

                  {/* Contact & Info */}
                  <div className="mb-6 pb-6 border-b border-border/30">
                    <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-3">
                      {labels.informations}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                        <Mail className="h-4 w-4 text-primary/60 shrink-0" />
                        <span className="truncate">{user?.email}</span>
                      </div>

                      {profile?.country && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                          <MapPin className="h-4 w-4 text-primary/60 shrink-0" />
                          <span>{profile.country}</span>
                        </div>
                      )}

                      {profile?.languages && profile.languages.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                          <BadgeIcon className="h-4 w-4 text-primary/60 shrink-0" />
                          <span>{profile.languages.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="grid grid-cols-3 gap-4">
                    <StatChip
                      label="Total XP"
                      value={(progress?.totalXp || 0).toLocaleString()}
                      accent
                    />
                    <StatChip
                      label="Rank"
                      value={`#${user?.rankGlobal || "---"}`}
                    />
                    <StatChip
                      label="Nível"
                      value={`${progress?.level || 0}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
