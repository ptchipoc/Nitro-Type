"use client";

import { Layers } from "lucide-react";

interface NoEventsProps {
  labels: {
    noEventsTitle: string;
    noEventsDesc: string;
  };
}

export function NoEvents({ labels }: NoEventsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-full border border-dashed border-border flex items-center justify-center mb-4">
        <Layers className="h-8 w-8 text-muted-foreground opacity-20" />
      </div>
      <h3 className="font-mono text-sm font-bold text-muted-foreground mb-1">
        {labels.noEventsTitle}
      </h3>
      <p className="text-xs text-muted-foreground/60 max-w-xs">
        {labels.noEventsDesc}
      </p>
    </div>
  );
}
