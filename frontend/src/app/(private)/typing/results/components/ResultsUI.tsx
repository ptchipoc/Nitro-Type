import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatBox({
  label,
  value,
  unit,
  icon,
  description,
  trend,
  accent,
  colorClass,
}: {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  description: string;
  trend?: string;
  accent?: boolean;
  colorClass?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, borderColor: "rgba(var(--primary), 0.3)" }}
      className={cn(
        "bg-card/20 glass border border-border/10 rounded-sm p-8 transition-all relative overflow-hidden group",
        accent &&
          "border-primary/40 bg-primary/5 ",
      )}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-card/40 rounded-sm border border-border/10 group-hover:bg-primary/5 transition-colors">
          {icon}
        </div>
        {trend && (
          <span className="text-[9px] font-mono text-green-500 font-bold uppercase tracking-tighter flex items-center gap-1 opacity-60">
            <TrendingUp className="h-3 w-3" /> {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "text-5xl font-bold font-mono tracking-tighter",
              colorClass,
            )}
          >
            {value}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground uppercase opacity-40">
            {unit}
          </span>
        </div>
        <p className="mt-4 text-[10px] leading-relaxed text-muted-foreground opacity-40 uppercase tracking-tight">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export function MetricRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="flex justify-between items-center text-[10px] font-mono border-b border-border/5 pb-2 last:border-0">
      <span className="text-muted-foreground uppercase tracking-[0.15em]">
        {label}
      </span>
      <span className={cn("font-bold", color || "text-foreground")}>
        {value}
      </span>
    </div>
  );
}
