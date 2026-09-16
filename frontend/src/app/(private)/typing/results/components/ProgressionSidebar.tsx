import { motion } from "framer-motion";
import { Trophy, RotateCcw, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { MetricRow } from "./ResultsUI";
import { useRouter } from "next/navigation";
import { TypingSessionStatus } from "@/features/typing/type";
import { StatusTheme } from "./config";
import { useTranslation } from "@/hooks/use-translation";
import { TypingSessionResultById } from "@/features/typing/type";
import { useTypingCreateSession } from "@/features/typing/hooks/typing-create-session.hook";
import { useTypingGetSessionById } from "@/features/typing/hooks/typing-get-setionId.hook";

interface ProgressionSidebarProps {
  result: TypingSessionResultById;
  theme: StatusTheme;
}

export function ProgressionSidebar({ result, theme }: ProgressionSidebarProps) {
  const router = useRouter();
  const t = useTranslation();

  const { data: sessionData, isLoading: isSessionLoading } = useTypingGetSessionById(result.sessionId);
  const { mutate: createSession, isPending: isRepeating } = useTypingCreateSession();

  const handleRepeat = () => {
    if (isRepeating || isSessionLoading || !sessionData?.data) return;

    const { category, difficulty } = sessionData.data;

    createSession(
      { category, difficulty },
      {
        onSuccess: (response) => {
          router.push(`/typing/arena?sectionId=${response.data.id}`);
        },
        onError: (error) => {
          console.error("[createSession] Error:", error);
          router.push("/typing");
        },
      }
    );
  };

  return (
    <div className="lg:col-span-4 space-y-6">
      <div className="bg-card/20 glass border border-border/10 rounded-sm p-8 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Trophy className="h-32 w-32" />
        </div>

        {/* Rewards Header */}
        <div className="relative z-10">
          <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest mb-6">
            {t.experienceAndScore}
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className={cn("text-4xl font-bold", theme.color)}>
                  +{result.xpEarned}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">
                  {t.experienceXp}
                </span>
              </div>
              <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(result.completionRate, 100)}%`,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={cn(
                    "h-full",
                    result.status === TypingSessionStatus.COMPLETED
                      ? "bg-primary"
                      : "bg-muted-foreground/30",
                  )}
                />
              </div>
            </div>

            
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          <button
            onClick={() => router.push("/typing")}
            className={cn(
              "w-full py-4 rounded-sm font-mono font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 group shadow-lg bg-primary",
            )}
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-3 transition-transform" />
            {t.back}
          </button>

          <button
            onClick={handleRepeat}
            disabled={isRepeating || isSessionLoading}
            className={cn(
              "text-foreground w-full py-4 rounded-sm font-mono font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 group border border-border/40 text-foreground border-primary hover:bg-primary/10",
              (isRepeating || isSessionLoading) && "opacity-50 cursor-not-allowed"
            )}
          >
            <RotateCcw className={cn("h-4 w-4 group-hover:rotate-180 transition-transform", (isRepeating || isSessionLoading) && "animate-spin")} />
            {isRepeating ? t.creating : isSessionLoading ? "..." : t.repeat}
          </button>
        </div>
      </div>

      {/* Character Details */}
      <div className="bg-card/20 glass border border-border/10 rounded-sm p-6">
        <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-4">
          {t.detailedBreakdown}
        </h3>
        <div className="space-y-3">
          <MetricRow label={t.correctChars} value={result.correctTypedChars} />
          <MetricRow
            label={t.errorCount}
            value={result.incorrectTypedChars}
            color="text-destructive"
          />
          <MetricRow label={t.duration} value={`${result.durationSeconds}s`} />
        </div>
      </div>
    </div>
  );
}
