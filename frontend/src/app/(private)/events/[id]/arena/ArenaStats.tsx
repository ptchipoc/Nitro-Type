import { useTranslation } from "@/lib/i18n";
import { labelsByLocale } from "../../components/details/constants";

interface ArenaStatsProps {
  wpm: number;
  errors: number;
  charsLeft: number;
}

export const ArenaStats = ({ wpm, errors, charsLeft }: ArenaStatsProps) => {
  const { locale } = useTranslation();
  const labels = labelsByLocale[locale as keyof typeof labelsByLocale];

  return (
    <div className="fixed left-4 lg:left-12 xl:left-24 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-8 text-[10px] font-mono text-muted-foreground/40 font-bold uppercase tracking-widest bg-card/20 glass p-8 rounded-2xl border border-border/10">
      <div>
        <p className="mb-1">{labels.wpm}</p>
        <p className="text-4xl text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.3)]">
          {wpm}
        </p>
      </div>
      <div>
        <p className="mb-1">{labels.errors}</p>
        <p
          className={`text-4xl ${errors > 0 ? "text-destructive" : "text-foreground/40"}`}
        >
          {errors}
        </p>
      </div>
      <div>
        <p className="mb-1">{labels.remaining}</p>
        <p className="text-4xl text-foreground/80">{charsLeft}</p>
      </div>
    </div>
  );
};
