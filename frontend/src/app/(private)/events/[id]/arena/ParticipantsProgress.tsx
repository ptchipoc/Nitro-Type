import { ParticipantProgressPayload } from "@/features/events/hooks/use-event-socket";
import { TypingEvent } from "@/features/events/types";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { labelsByLocale } from "../../components/details/constants";

interface ArenaHeaderProps {
  userId: string;
  event: TypingEvent;
  participantsProgress: Record<string, ParticipantProgressPayload>;
}

export function ParticipantsProgress({
  userId,
  event,
  participantsProgress,
}: ArenaHeaderProps) {
  const { locale } = useTranslation();
  const labels = labelsByLocale[locale as keyof typeof labelsByLocale];
  const myProgress = participantsProgress[userId]?.progress ?? 0;

  const otherParticipants = event.participants.filter(
    (p) => p.userId !== userId,
  );
  return (
    <div className="min-w-[400px] mx-auto fixed right-4 lg:right-12 xl:right-24 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-8 text-[10px] font-mono text-muted-foreground/40 font-bold uppercase tracking-widest bg-card/20 glass p-8 rounded-2xl border border-border/10">
      {otherParticipants.map((participant) => {
        const progress =
          participantsProgress[participant.userId]?.progress ?? 0;

        return (
          <div key={participant.id} className="space-y-1">
            <div className="flex justify-between text-[10px] items-center font-mono uppercase opacity-60">
              <span>{participant.user.name}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1 bg-border/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary/40"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        );
      })}

      {/* O teu próprio progresso */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] items-center font-mono uppercase text-primary font-bold">
          <span>{labels.you}</span>
          <span>{Math.round(myProgress)}%</span>
        </div>
        <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${myProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}
