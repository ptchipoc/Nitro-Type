import { motion } from "framer-motion";
import { Layers } from "lucide-react";

interface RoundsListProps {
  roundsCount: number;
  currentRound: number;
  category: string;
  difficulty: string;
  labels: {
    rounds: string;
  };
}

/**
 * Component to display the list of event rounds.
 * Shows round details like category, difficulty, and number.
 */
export function RoundsList({
  roundsCount,
  currentRound,
  category,
  difficulty,
  labels,
}: RoundsListProps) {
  // Create an array of round numbers from 1 up to roundsCount
  const rounds = Array.from({ length: roundsCount }, (_, i) => i + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="p-8 rounded-sm border border-border bg-card/20 space-y-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-primary" />
        <h3 className="text-xs font-mono font-bold uppercase tracking-[0.2em]">
          {labels.rounds}
        </h3>
      </div>

      <div className="grid gap-4">
        {roundsCount === 0 ? (
          <div className="py-8 text-center opacity-30 text-xs uppercase tracking-widest border border-dashed border-border rounded-sm">
            Nenhuma ronda configurada
          </div>
        ) : (
          rounds.map((roundNumber) => {
            const isFinished = roundNumber < currentRound;
            const isActive = roundNumber === currentRound;
            const isUpcoming = roundNumber > currentRound;

            return (
              <div
                key={roundNumber}
                className={cn(
                  "flex items-center justify-between p-4 bg-background/40 border rounded-sm transition-all",
                  isActive
                    ? "border-primary shadow-glow bg-primary/10"
                    : "border-border/50",
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-sm border flex items-center justify-center font-bold text-xs",
                      isFinished
                        ? "bg-primary/20 border-primary/50 text-primary"
                        : isActive
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-muted/10 border-border/30 text-muted-foreground",
                    )}
                  >
                    {roundNumber}
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase">{category}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">
                      Dificuldade: {difficulty}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground uppercase">
                    Status
                  </p>
                  <p
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-tighter",
                      isFinished
                        ? "text-primary/60"
                        : isActive
                          ? "text-primary animate-pulse"
                          : "text-muted-foreground/40",
                    )}
                  >
                    {isFinished
                      ? "Terminado"
                      : isActive
                        ? "A Decorrer"
                        : "Agendado"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}

// Utility function (inline if not imported)
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
