"use client";

import { Keyboard } from "lucide-react";
import { LegendDot, KeyboardRow } from "./TypingUI";
import { Labels } from "./constants";

interface AccuracyMapProps {
  labels: Labels;
}

export function AccuracyMap({ labels }: AccuracyMapProps) {
  return (
    <div className="rounded-sm border border-border bg-card/40 p-6 glass">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-primary/20 bg-primary/10">
            <Keyboard className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-mono font-bold uppercase tracking-tight">
              {labels.accuracyMap}
            </h3>
            <p className="text-[9px] font-mono uppercase text-muted-foreground opacity-60">
              {labels.accuracySubtitle}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <LegendDot color="bg-red-500/50" label={labels.problematic} />
          <LegendDot color="bg-primary" label={labels.excellent} />
        </div>
      </div>

      <div className="mx-auto max-w-2xl space-y-2">
        <KeyboardRow
          keys={["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]}
          accuracies={[98, 92, 85, 99, 94, 91, 88, 96, 93, 90]}
        />
        <KeyboardRow
          keys={["A", "S", "D", "F", "G", "H", "J", "K", "L", ";"]}
          accuracies={[95, 97, 82, 89, 96, 94, 78, 99, 93, 91]}
          indent
        />
        <KeyboardRow
          keys={["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"]}
          accuracies={[88, 91, 99, 95, 92, 87, 85, 96, 94, 98]}
          indent2
        />
      </div>
    </div>
  );
}
