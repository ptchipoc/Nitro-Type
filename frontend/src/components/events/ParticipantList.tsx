"use client";

import { EventParticipant, ParticipantStatus } from "@/features/events/types";
import { cn } from "@/lib/utils";
import { Check, Clock } from "lucide-react";
import Image from "next/image";
import { labelsByLocale } from "@/app/(private)/events/components/details/constants";
// import { labelsByLocale } from "@/app/(private)/events/constants/labels.locale";
import { useTranslation } from "@/lib/i18n";

interface Props {
  participants: EventParticipant[];
  className?: string;
  maxDisplay?: number;
}

export function ParticipantList({
  participants,
  className,
  maxDisplay = 10,
}: Props) {
  const visible = participants.slice(0, maxDisplay);
  const remaining = participants.length - maxDisplay;
  const { locale } = useTranslation();
  const labels = labelsByLocale[locale as keyof typeof labelsByLocale] ?? labelsByLocale.pt;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {labels.participants} ({participants.length})
        </h3>
      </div>

      <div className="space-y-2">
        {visible.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between p-2 rounded-sm border border-border/50 bg-card/20 hover:bg-card/40 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-border bg-muted/30 flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                {p.user.avatarUrl ? (
                  <Image
                    width={100}
                    height={100}
                    src={p.user.avatarUrl}
                    alt={p.user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  (p.user.name || p.userId)[0].toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs font-bold truncate group-hover:text-primary transition-colors">
                  {p.user.name}
                </p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest">
                  {/* {p.rank || "Novato"} */}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {p.status != ParticipantStatus.INVITED ? (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500">
                  <Check className="h-3 w-3" />
                  <span className="text-[8px] font-bold uppercase tabular-nums">
                    {labels.inEvent}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-muted/30 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span className="text-[8px] font-bold uppercase tabular-nums">
                    {labels.pending}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {remaining > 0 && (
          <div className="py-2 text-center text-[10px] font-mono text-muted-foreground/60 border-t border-dashed border-border mt-4">
            + {remaining} {labels.otherProgrammers}
          </div>
        )}
      </div>
    </div>
  );
}
