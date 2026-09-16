import { cn } from "@/lib/utils";

export function PreviewMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-sm border border-border bg-background/40 p-3">
      <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-mono text-sm font-bold text-foreground">
        {value}
      </p>
    </div>
  );
}

export function StatusCard({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit?: string;
  accent?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-mono uppercase text-muted-foreground">
        {label}
      </p>
      <p
        className={cn("text-lg font-mono font-bold", accent && "text-primary")}
      >
        {value}{" "}
        {unit ? (
          <span className="text-[10px] uppercase text-muted-foreground">
            {unit}
          </span>
        ) : null}
      </p>
    </div>
  );
}

export function ActivityRow({
  title,
  stats,
  xp,
  onClick,
}: {
  title: string;
  stats: string;
  xp: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group rounded-sm border border-border/40 bg-muted/20 p-3 transition-colors hover:border-primary/30",
        onClick && "cursor-pointer",
      )}
    >
      <div className="mb-1 flex items-start justify-between">
        <span className="truncate text-[10px] font-mono font-bold uppercase text-foreground">
          {title}
        </span>
        <span className="text-[9px] font-mono font-bold text-primary">
          {xp}
        </span>
      </div>
      <span className="text-[9px] font-mono text-muted-foreground">
        {stats}
      </span>
    </div>
  );
}

export function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("h-2 w-2 rounded-full", color)} />
      <span className="text-[9px] font-mono uppercase text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function KeyboardRow({
  keys,
  accuracies,
  indent,
  indent2,
}: {
  keys: string[];
  accuracies: number[];
  indent?: boolean;
  indent2?: boolean;
}) {
  return (
    <div className={cn("flex gap-1.5", indent && "ml-4", indent2 && "ml-8")}>
      {keys.map((key, index) => {
        const accuracy = accuracies[index];
        const isBad = accuracy < 85;
        const isMedium = accuracy >= 85 && accuracy < 93;

        return (
          <div
            key={key}
            className={cn(
              "flex aspect-square max-w-[48px] flex-1 flex-col items-center justify-center rounded-sm border p-1 transition-all hover:-translate-y-0.5",
              isBad
                ? "border-red-500/40 bg-red-500/10"
                : isMedium
                  ? "border-amber-500/40 bg-amber-500/10"
                  : "border-primary/40 bg-primary/10",
            )}
          >
            <span
              className={cn(
                "text-[10px] font-mono font-bold",
                isBad
                  ? "text-red-400"
                  : isMedium
                    ? "text-amber-400"
                    : "text-primary",
              )}
            >
              {key}
            </span>
            <span className="mt-0.5 text-[8px] font-mono opacity-60">
              {accuracy}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
