"use client";

import { Star } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { PROFILE_LABELS } from "./constants";

export function RankingError() {
  const { locale } = useTranslation();
  const labels = PROFILE_LABELS[locale as keyof typeof PROFILE_LABELS] || PROFILE_LABELS.en;

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4">
        <Star className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold mb-2">{labels.RankingError.title}</h2>
      <p className="text-muted-foreground">{labels.RankingError.description}</p>
    </div>
  );
}
