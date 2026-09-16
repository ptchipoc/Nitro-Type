import { TypingEvent } from "@/features/events/types";
import { Timer } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { labelsByLocale } from "../../components/details/constants";

interface ArenaHeaderProps {
  event: TypingEvent;
  roundNumber: number;
  timeLeft: number;
}

export function ArenaHeader({ event, roundNumber, timeLeft }: ArenaHeaderProps) {
  const { locale } = useTranslation();
  const labels = labelsByLocale[locale as keyof typeof labelsByLocale];

  return (
    <div className="w-full max-w-4xl mb-12 text-center mt-6">
      <h3 className="text-3xl leading-4 font-bold my-4">{event.name}</h3>

      <p className="text-[10px] font-mono uppercase tracking-[0.3em] mb-2">
        <span>
          {labels.category}
          <span className="text-primary/60"> {event.category}</span>
        </span>
        {" / "}
        <span>
          {labels.difficulty}
          <span className="text-primary/60"> {event.difficulty}</span>
        </span>
      </p>

      <h1 className="text-3xl font-bold mb-4 font-mono uppercase tracking-tighter">
        {labels.round} #<span className="opacity-50">{roundNumber}</span>
      </h1>

      <div className="pt-4 border-t border-border/10 flex items-center gap-2 justify-center">
        <Timer className="h-10 w-10 text-amber-500" />
        <span className="text-amber-500 font-bold">
          {getTimeLeft(timeLeft, labels)}
        </span>
      </div>
    </div>
  );
}

interface TimeLabels {
  timesUp: string;
}

const getTimeLeft = (timeLeft: number, labels: TimeLabels) => {
  if (timeLeft <= 0) return labels.timesUp;
  if (timeLeft > 60) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}m ${seconds}s`;
  }
  return `${timeLeft}s`;
};
