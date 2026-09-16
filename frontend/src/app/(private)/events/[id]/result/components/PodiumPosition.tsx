import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { labelsByLocale } from "../../../constants/labels.locale";
import { AnimatePresence, motion } from "framer-motion";
import { Trophy } from "lucide-react";

function PodiumPosition({
  participant,
  rank,
  height,
  delay,
  show,
  isWinner = false,
}: {
  participant: any;
  rank: number;
  height: string;
  delay: number;
  show: boolean;
  isWinner?: boolean;
}) {
  const { locale } = useTranslation();
  const labels =
    labelsByLocale[locale as keyof typeof labelsByLocale] || labelsByLocale.en;

  if (!participant) return null;
  return (
    <div className="flex flex-col items-center group w-24 md:w-40 relative">
      <AnimatePresence>
        {show && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay }}
              className="absolute bottom-full mb-6 flex flex-col items-center w-full z-30"
            >
              <div
                className={cn(
                  "w-12 h-12 md:w-16 md:h-16 rounded-full border-2 bg-card flex items-center justify-center shadow-xl mb-2",
                  isWinner
                    ? "border-amber-500"
                    : rank === 2
                      ? "border-slate-400"
                      : "border-amber-700",
                )}
              >
                <span className="text-[10px] font-mono font-bold">
                  {participant.user.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold truncate max-w-full">
                {participant.user.name.substring(0, 8)}...
              </span>
              <span className="text-[9px] font-mono text-muted-foreground uppercase mt-0.5">
                {participant.totalScore.toFixed(1)} pts
              </span>
            </motion.div>

            <motion.div
              initial={{ height: 0 }}
              animate={{ height }}
              transition={{ delay, duration: 1, ease: "easeOut" }}
              className={cn(
                "w-full bg-card border-x border-t border-border flex flex-col items-center pt-4 relative",
                isWinner
                  ? "z-20 border-amber-500/30 bg-amber-500/5 shadow-[0_-20px_40px_rgba(245,158,11,0.05)]"
                  : "z-10",
              )}
            >
              {isWinner && (
                <div className="absolute inset-0 bg-linear-to-b from-amber-500/10 to-transparent pointer-events-none" />
              )}
              <span
                className={cn(
                  "text-4xl md:text-6xl font-mono font-black italic",
                  isWinner
                    ? "text-amber-500"
                    : "text-muted-foreground opacity-20",
                )}
              >
                {rank}
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest mt-2 opacity-50">
                {labels.place}
              </span>
              {isWinner && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: delay + 1.2 }}
                  className="absolute -top-4"
                >
                  <Trophy className="h-8 w-8 text-amber-500 fill-amber-500 drop-shadow-glow" />
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PodiumPosition;