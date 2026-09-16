"use client";

import { Zap, Target, Layout, ShieldCheck } from "lucide-react";
import { StatBox } from "./ResultsUI";
import {
  TypingSessionResult,
  TypingSessionStatus,
} from "@/lib/api/endpoints/typing/typing.type";
import { cn } from "@/lib/utils";
import { StatusTheme } from "./config";
import { useTranslation } from "@/hooks/use-translation";
import { TypingSessionResultById } from "@/features/typing/type";

interface PrimaryStatsProps {
  result: TypingSessionResultById;
  theme: StatusTheme;
}

export function PrimaryStats({ result, theme }: PrimaryStatsProps) {
  const t = useTranslation();

  return (
    <div className="lg:col-span-7  grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatBox
        label={t.averageSpeed}
        value={result.wpm.toString()}
        unit="WPM"
        icon={<Zap className={cn("h-5 w-5", theme.color)} />}
        description={t.averageSpeedDescription}
        accent={true}
        colorClass={theme.statColor}
      /> 
      <StatBox
        label={t.globalAccuracy}
        value={result.accuracy.toString()}
        unit="%"
        icon={<Target className={cn("h-5 w-5", theme.color)} />}
        description={t.globalAccuracyDescription}
        accent={true}
        colorClass={theme.statColor}
      />
      <StatBox
        label={t.charactersTyped}
        value={result.typedChars.toString()}
        unit={`/ ${result.totalChars}`}
        icon={<Layout className={cn("h-5 w-5", theme.color)} />}
        description={t.charactersTypedDescription}
        accent={true}
        colorClass={theme.statColor}
      />
      <StatBox
        label={t.sessionIntegrity}
        value={result.completionRate.toString()}
        unit="%"
        icon={<ShieldCheck className={cn("h-5 w-5", theme.color)} />}
        description={t.sessionIntegrityDescription}
        accent={true}
        colorClass={theme.statColor}
      />
    </div>
  );
}
