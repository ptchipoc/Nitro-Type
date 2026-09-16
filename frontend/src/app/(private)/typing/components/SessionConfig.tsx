"use client";

import { cn } from "@/lib/utils";
import { Keyboard, Settings, Zap, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TypingCategory,
  TypingDifficulty,
} from "@/lib/api/endpoints/typing/typing.type";
import { localizedCategoryNames, localizedDifficultyNames, Labels } from "./constants";
import { useRouter } from "next/navigation";

interface SessionConfigProps {
  labels: Labels;
  locale: string;
  selectedCategory: TypingCategory;
  setSelectedCategory: (category: TypingCategory) => void;
  selectedDifficulty: TypingDifficulty;
  setSelectedDifficulty: (difficulty: TypingDifficulty) => void;
  isScaling: boolean;
  startSoloGame: () => void;
}

export function SessionConfig({
  labels,
  locale,
  selectedCategory,
  setSelectedCategory,
  selectedDifficulty,
  setSelectedDifficulty,
  isScaling,
  startSoloGame,
}: SessionConfigProps) {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden rounded-sm border border-border bg-card/40 p-6 glass sm:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-primary/20 bg-primary/10">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-mono font-bold uppercase tracking-tight">
              {labels.configureSession}
            </h2>
            <p className="text-[10px] font-mono uppercase text-muted-foreground opacity-60">
              {labels.soloMode}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
            <Zap className="h-3 w-3 text-primary" />
            {labels.codeCategory}
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Object.values(TypingCategory).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "rounded-sm border px-4 py-3 font-mono text-[11px] uppercase tracking-tighter transition-all",
                  selectedCategory === category
                    ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                    : "border-border bg-secondary/10 text-muted-foreground hover:border-primary/30",
                )}
              >
                {
                  localizedCategoryNames[
                    locale as keyof typeof localizedCategoryNames
                  ][category]
                }
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
            <Target className="h-3 w-3 text-primary" />
            {labels.difficulty}
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Object.values(TypingDifficulty).map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={cn(
                  "rounded-sm border px-2 py-3 font-mono text-[11px] uppercase tracking-tighter transition-all",
                  selectedDifficulty === difficulty
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary/10 text-muted-foreground hover:border-primary/30",
                )}
              >
                {
                  localizedDifficultyNames[
                    locale as keyof typeof localizedDifficultyNames
                  ][difficulty]
                }
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
          <Button
            onClick={startSoloGame}
            disabled={isScaling}
            className="box-glow h-14 bg-primary font-mono font-bold uppercase tracking-widest text-primary-foreground"
          >
            <Zap className={cn("mr-2 h-4 w-4", isScaling && "animate-pulse")} />
            {isScaling ? "Initializing..." : labels.startSolo}
          </Button>

          <Button
            variant="outline"
            className="h-14 border-primary/30 font-mono font-bold uppercase tracking-widest text-primary hover:border-primary/60 hover:bg-primary/5"
            onClick={() => router.push("/events/create")}
          >
            <Users className="mr-2 h-4 w-4" />
            {labels.challengeFriends}
          </Button>
        </div>
      </div>
    </div>
  );
}
