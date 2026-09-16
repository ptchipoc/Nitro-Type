"use client";

import { History } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityRow } from "./TypingUI";
import { useRouter } from "next/navigation";
import { Labels } from "./constants";

interface RecentActivityProps {
  labels: Labels;
  results: any[] | undefined;
  isLoadingResults: boolean;
}

export function RecentActivity({
  labels,
  results,
  isLoadingResults,
}: RecentActivityProps) {
  const router = useRouter();

  return (
    <div className="rounded-sm border border-border bg-card/40 p-6 glass">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {labels.recentActivity}
        </h3>
        <History className="h-3.5 w-3.5 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        {isLoadingResults ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full bg-muted/20" />
          ))
        ) : results && results.length > 0 ? (
          results
            .slice(0, 5)
            .map((session) => (
              <ActivityRow
                key={session.id}
                title={`${labels.seccion} #${session.id.slice(0, 4)}`}
                stats={`${session.wpm} WPM • ${session.accuracy}% • ${session.durationSeconds}s`}
                xp={`+${session.xpEarned} XP`}
                onClick={() => router.push(`/typing/results/${session.id}`)}
              />
            ))
        ) : (
          <div className="text-center py-8 text-xs text-muted-foreground uppercase tracking-widest opacity-50">
            {labels.noRecentActivity}
          </div>
        )}
      </div>
    </div>
  );
}
