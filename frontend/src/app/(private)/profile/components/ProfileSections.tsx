"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, Trophy, Zap, Star } from "lucide-react";
import type { ApiUser } from "@/features/users/type";
import type { TypingSessionResult } from "@/lib/api/endpoints/typing/typing.type";
import { moduleIcons, moduleColors, PROFILE_LABELS } from "./constants";
import { useGetRecentXpTransations } from "@/features/users/hooks/user-get-recent-xp-transations.hook";

// ─── Sub-components ───────────────────────────────────────────────────────────

function SkillRadar({ labels }: { labels: string[] }) {
  const values = [0.78, 0.35, 0.92, 0.55, 0.68, 0.82];
  const cx = 90, cy = 90, r = 70;
  const n = labels.length;

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i: number, ratio: number) => ({
    x: cx + r * ratio * Math.cos(angle(i)),
    y: cy + r * ratio * Math.sin(angle(i)),
  });

  const fillPoints = values.map((v, i) => point(i, v));
  const fillD = fillPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + "Z";

  return (
    <svg viewBox="0 0 180 180" className="w-full max-w-45 mx-auto">
      {[0.25, 0.5, 0.75, 1].map((lvl) => (
        <path key={lvl} d={Array.from({ length: n }, (_, i) => point(i, lvl)).map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + "Z"} fill="none" stroke="rgba(0, 255, 0, 0.2)" strokeWidth="0.5" />
      ))}
      <path d={fillD} fill="hsl(var(--primary) / 0.15)" stroke="rgba(0, 255, 0, 0.4)" strokeWidth="1" />
      {labels.map((lbl, i) => {
        const p = point(i, 1.25);
        return <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize="7" fill="rgba(0, 255, 0, 0.4)" fontFamily="monospace">{lbl}</text>
      })}
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export interface ProfileSectionsProps {
  locale: "pt" | "en" | "fr";
  user: ApiUser | undefined;
  results: TypingSessionResult[] | undefined;
  moduleNames: Record<string, string>;
}

export function ProfileSections({
  locale,
  user,
  results,
  moduleNames,
}: ProfileSectionsProps) {
  const labels = PROFILE_LABELS[locale] || PROFILE_LABELS.pt;
  const profile = user?.profile;
  const progress = user?.progress;
  const { data } = useGetRecentXpTransations();
  const maxWpm = Math.max(...(results?.map(r => r.wpm) || [0])) === -Infinity ? 0 : Math.max(...(results?.map(r => r.wpm) || [0]));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 max-w-6xl mx-auto">
      <div className="space-y-8">
        {/* Módulos Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{labels.moduleActivity}</span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Typing Module Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card/40 glass border border-border/50 rounded-sm p-5 relative overflow-hidden group hover:border-primary/30 transition-all"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(0,255,0,0.3)]" />
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-sm">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold font-mono">{labels.typingSpeed}</h3>
                    <p className="text-[10px] text-muted-foreground font-mono">{labels.lastSession}: {results?.[0] ? new Date(results[0].createdAt).toLocaleDateString(locale) : '---'}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[10px] font-mono bg-primary/10 text-primary border-none">Lv.{progress?.level || 0}</Badge>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-muted-foreground">{labels.accuracy}</span>
                  <span className="text-foreground">{((results?.reduce((acc, r) => acc + r.accuracy, 0) ?? 0) / (results?.length || 1)).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-muted-foreground">{labels.maxWpm}</span>
                  <span className="text-foreground">{maxWpm}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* History Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{labels.recentHistory}</span>
            <div className="flex-1 h-px bg-border/50" />
          </div>
          <div className="bg-card/30 border border-border/50 rounded-sm divide-y divide-border/30">
            {data?.data?.slice(0, 5).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 hover:bg-primary/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-10">
                    <div className="text-[10px] font-mono text-muted-foreground uppercase">{new Date(session.createdAt).toLocaleDateString(locale, { month: 'short' })}</div>
                    <div className="text-sm font-mono font-bold">{new Date(session.createdAt).getDate()}</div>
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold group-hover:text-primary transition-colors">{labels.typingSession}</div>
                    {/* <div className="text-[10px] font-mono text-muted-foreground">{session.wpm} WPM • {session.accuracy}% Acc</div> */}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-primary">+{session.amount} XP</div>
                  <div className="text-[9px] font-mono text-muted-foreground tracking-tighter uppercase whitespace-nowrap">{labels.completed}</div>
                </div>
              </div>
            ))}
            {(!data || data.data.length === 0) && (
              <div className="p-8 text-center text-xs font-mono text-muted-foreground">{labels.noActivity}</div>
            )}
          </div>
        </section>
      </div>

      {/* Sidebar */}
      <div className="space-y-8">
        {/* Stats Summary */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{labels.statistics}</span>
            <div className="flex-1 h-px bg-border/50" />
          </div>
          <div className="bg-card/30 border border-border/50 rounded-sm divide-y divide-border/30 overflow-hidden font-mono">
            {[
              { icon: Zap, label: labels.totalSessions, value: results?.length || 0 },
              { icon: Target, label: labels.accuracy, value: `${((results?.reduce((acc, r) => acc + r.accuracy, 0) ?? 0) / (results?.length || 1)).toFixed(1)}%` },
              { icon: Clock, label: labels.lastActive, value: user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString(locale) : '---' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex justify-between items-center p-3.5 px-4 h-12">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-[10px] uppercase">{label}</span>
                </div>
                <span className="text-xs font-bold text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Info List */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{labels.account}</span>
            <div className="flex-1 h-px bg-border/50" />
          </div>
          <div className="bg-card/30 border border-border/50 rounded-sm px-4 font-mono text-[10px] divide-y divide-border/20">
            <div className="flex justify-between py-2.5">
              <span className="text-muted-foreground">{labels.role}</span>
              <span className="text-primary italic font-bold">{user?.role}</span>
            </div>
            {profile?.socialLinks?.map((link, i) => (
              <div key={i} className="flex justify-between py-2.5">
                <span className="text-muted-foreground uppercase">{link.platform}</span>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary hover:underline transition-colors truncate max-w-[120px]"
                >
                  {link.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
