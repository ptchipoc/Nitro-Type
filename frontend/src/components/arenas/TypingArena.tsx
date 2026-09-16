"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Zap, Timer, Target, ChevronRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";

const labelsByLocale = {
  pt: {
    wpm: "WPM",
    accuracy: "Precisão",
    time: "Tempo",
    errors: "Erros",
    progress: "Progresso",
    liveRanking: "Ranking ao vivo",
    viewFinal: "Ver Ranking Final",
    review: "Rever Sessão",
    challengeComplete: "Challenge Completo!",
    processed: "Os teus resultados mock foram processados nesta sessão local.",
    lineFocus: "Linha atual",
    keyStats: "Teclas Críticas",
    hits: "Acertos",
  },
  en: {
    wpm: "WPM",
    accuracy: "Accuracy",
    time: "Time",
    errors: "Errors",
    progress: "Progress",
    liveRanking: "Live Ranking",
    viewFinal: "View Final Ranking",
    review: "Review Session",
    challengeComplete: "Challenge Complete!",
    processed: "Your mock results were processed in this local session.",
    lineFocus: "Current line",
    keyStats: "Critical Keys",
    hits: "Hits",
  },
  fr: {
    wpm: "WPM",
    accuracy: "Précision",
    time: "Temps",
    errors: "Erreurs",
    progress: "Progression",
    liveRanking: "Classement en direct",
    viewFinal: "Voir le classement final",
    review: "Revoir la session",
    challengeComplete: "Défi terminé !",
    processed:
      "Vos résultats simulés ont été traités dans cette session locale.",
    lineFocus: "Ligne actuelle",
    keyStats: "Touches critiques",
    hits: "Frappes",
  },
};

interface Props {
  code: string;
  onFinish: (stats: {
    wpm: number;
    accuracy: number;
    durationSeconds: number;
    totalKeystrokes: number;
    correctKeystrokes: number;
    incorrectKeystrokes: number;
  }) => void;
  showLiveRanking?: boolean;
  isTimeUp?: boolean;
}

export function TypingArena({
  code,
  onFinish,
  showLiveRanking = true,
  isTimeUp = false,
}: Props) {
  const { locale } = useTranslation();
  const labels = labelsByLocale[locale];
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isErrorFlashVisible, setIsErrorFlashVisible] = useState(false);
  const [sessionCharStats, setSessionCharStats] = useState<
    Record<string, { hits: number; errors: number }>
  >({});

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const currentLineRef = useRef<HTMLDivElement>(null);

  // Stats calculation
  const stats = calculateStats(input, code, startTime, endTime, errors);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const effectiveStartTime =
      startTime ?? (val.length > 0 ? Date.now() : null);
    let nextErrors = errors;
    let nextInput = input;

    if (effectiveStartTime && !startTime) {
      setStartTime(effectiveStartTime);
    }

    if (val.length < input.length) {
      nextInput = input.slice(0, val.length);
    } else if (val.length > input.length) {
      const appended = val.slice(input.length);
      let accepted = input;
      const nextCharStats = { ...sessionCharStats };

      for (const char of appended) {
        const targetChar = code[accepted.length];
        if (char === targetChar) {
          accepted += char;
          const statsEntry = nextCharStats[targetChar] ?? {
            hits: 0,
            errors: 0,
          };
          nextCharStats[targetChar] = {
            hits: statsEntry.hits + 1,
            errors: statsEntry.errors,
          };
        } else {
          nextErrors += 1;
          const statsEntry = nextCharStats[targetChar] ?? {
            hits: 0,
            errors: 0,
          };
          nextCharStats[targetChar] = {
            hits: statsEntry.hits,
            errors: statsEntry.errors + 1,
          };
          setIsErrorFlashVisible(true);
        }
      }

      setSessionCharStats(nextCharStats);
      nextInput = accepted;
    }

    setErrors(nextErrors);
    setInput(nextInput);

    if (nextInput === code && !isFinished && effectiveStartTime) {
      const now = Date.now();
      const duration = Math.floor((now - effectiveStartTime) / 1000);
      setEndTime(now);
      setIsFinished(true);
      onFinish({
        wpm: calculateWPM(nextInput, effectiveStartTime, now),
        accuracy: calculateAccuracy(nextInput, code, nextErrors),
        durationSeconds: duration,
        totalKeystrokes: nextInput.length + nextErrors,
        correctKeystrokes: nextInput.length,
        incorrectKeystrokes: nextErrors,
      });
    }
  };

  const progress = (input.length / code.length) * 100;
  const currentLineIndex = code.slice(0, input.length).split("\n").length - 1;
  const lines = code.split("\n");
  const charStats = buildCharStats(sessionCharStats);
  const topCharStats = charStats.slice(0, 5);

  useEffect(() => {
    if (!currentLineRef.current) {
      return;
    }

    currentLineRef.current.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  }, [currentLineIndex]);

  useEffect(() => {
    if (!isErrorFlashVisible) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsErrorFlashVisible(false);
    }, 160);

    return () => window.clearTimeout(timeoutId);
  }, [isErrorFlashVisible]);

  useEffect(() => {
    if (isTimeUp && !isFinished) {
      const now = Date.now();
      const effectiveStartTime = startTime ?? now;
      const duration = Math.floor((now - effectiveStartTime) / 1000);

      setIsFinished(true);
      setEndTime(now);

      onFinish({
        wpm: calculateWPM(input, effectiveStartTime, now),
        accuracy: calculateAccuracy(input, code, errors),
        durationSeconds: duration,
        totalKeystrokes: input.length + errors,
        correctKeystrokes: input.length,
        incorrectKeystrokes: errors,
      });
    }
  }, [isTimeUp, isFinished, input, code, errors, startTime, onFinish]);

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-5 gap-4 bg-card/40 border border-border p-4 rounded-sm">
        <StatItem
          icon={<Zap className="h-4 w-4 text-teal-400" />}
          label={labels.wpm}
          value={stats.wpm}
        />
        <StatItem
          icon={<Target className="h-4 w-4 text-primary" />}
          label={labels.accuracy}
          value={stats.accuracy + "%"}
        />
        <StatItem
          icon={<Timer className="h-4 w-4 text-muted-foreground" />}
          label={labels.time}
          value={stats.time}
        />
        <StatItem
          icon={<Target className="h-4 w-4 text-rose-400" />}
          label={labels.errors}
          value={errors}
        />
        <StatItem
          icon={<Timer className="h-4 w-4 text-teal-300" />}
          label={labels.progress}
          value={`${Math.round(progress)}%`}
        />
      </div>

      {/* Arena Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-muted/20 z-10">
          <motion.div
            className="h-full bg-teal-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>

        {/* Text Display */}
        <div
          className={cn(
            "relative mt-1 flex-1 cursor-text overflow-y-auto rounded-sm border border-border bg-card/20 p-8 font-mono text-lg leading-relaxed whitespace-pre-wrap transition-colors",
            isErrorFlashVisible && "border-red-500/60 bg-red-500/5",
          )}
          onClick={() => inputRef.current?.focus()}
        >
          <div className="mb-4 flex items-center justify-between border-b border-border/40 pb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              {labels.lineFocus}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary">
              {currentLineIndex + 1}/{lines.length}
            </span>
          </div>

          <div className="space-y-1">
            {lines.map((line, lineIndex) => {
              const lineStart = lines
                .slice(0, lineIndex)
                .reduce((total, entry) => total + entry.length + 1, 0);
              const lineContent = `${line}${lineIndex < lines.length - 1 ? "\n" : ""}`;

              return (
                <div
                  key={`${lineIndex}-${line}`}
                  ref={lineIndex === currentLineIndex ? currentLineRef : null}
                  className={cn(
                    "rounded-sm px-2 py-1 transition-colors",
                    lineIndex === currentLineIndex && "bg-primary/5",
                  )}
                >
                  {lineContent.split("").map((char, offset) => {
                    const index = lineStart + offset;
                    let color = "text-muted-foreground/40";

                    if (index < input.length) {
                      color =
                        input[index] === code[index]
                          ? "text-teal-400"
                          : "text-red-500 bg-red-500/10";
                    } else if (index === input.length) {
                      color =
                        "bg-primary/20 text-foreground outline outline-1 outline-primary animate-pulse";
                    }

                    return (
                      <span
                        key={`${index}-${char}`}
                        className={cn("transition-colors", color)}
                      >
                        {char === "\n" ? "\n" : char}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <textarea
            ref={inputRef}
            className="absolute inset-0 cursor-default opacity-0"
            autoFocus
            value={input}
            onChange={handleInput}
            disabled={isFinished}
            spellCheck={false}
          />
        </div>
      </div>

      {showLiveRanking ? (
        <div className="bg-muted/5 border border-border p-4 rounded-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
              {labels.liveRanking}
            </h4>
            <span className="text-[8px] font-mono text-muted-foreground animate-pulse flex items-center gap-1">
              <Zap className="h-2 w-2 text-green-500 fill-green-500" /> LIVE
            </span>
          </div>
          <div className="space-y-2">
            <LeadItem rank={1} name="ana_f" wpm={142} />
            <LeadItem rank={2} name="plopes_42" wpm={115} />
            <LeadItem rank={3} name="m_santos" wpm={108} />
            <LeadItem rank={4} name="talves" wpm={92} />
          </div>
        </div>
      ) : null}

      {/* Finish Overlay */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full glass border border-primary/20 p-8 rounded-sm text-center"
            >
              <Trophy className="h-16 w-16 text-amber-500 mx-auto mb-6" />
              <h2 className="text-2xl font-mono font-bold mb-2 uppercase tracking-tight">
                {labels.challengeComplete}
              </h2>
              <p className="text-muted-foreground mb-8 text-sm italic">
                &quot;{labels.processed}&quot;
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-card border border-border">
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                    {labels.wpm}
                  </div>
                  <div className="text-2xl font-bold font-mono text-teal-400">
                    {stats.wpm}
                  </div>
                </div>
                <div className="p-4 bg-card border border-border">
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                    {labels.accuracy}
                  </div>
                  <div className="text-2xl font-bold font-mono text-primary">
                    {stats.accuracy}%
                  </div>
                </div>
              </div>

              <div className="mb-8 rounded-sm border border-border bg-card p-4 text-left">
                <div className="mb-3 text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                  {labels.keyStats}
                </div>
                <div className="space-y-2">
                  {topCharStats.map((entry) => (
                    <div
                      key={entry.char}
                      className="flex items-center justify-between font-mono text-[11px]"
                    >
                      <span className="rounded-sm border border-border bg-background px-2 py-1">
                        {entry.char === " " ? "space" : entry.char}
                      </span>
                      <span className="text-muted-foreground">
                        {labels.errors}: {entry.errors} • {labels.hits}:{" "}
                        {entry.hits}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-5 gap-2">
                  {topCharStats.map((entry) => {
                    const total = entry.hits + entry.errors;
                    const accuracy =
                      total > 0 ? Math.round((entry.hits / total) * 100) : 0;

                    return (
                      <div
                        key={`${entry.char}-heat`}
                        className="rounded-sm border border-border bg-background/40 p-2 text-center"
                      >
                        <div className="font-mono text-[10px] font-bold text-foreground">
                          {entry.char === " " ? "sp" : entry.char}
                        </div>
                        <div className="mt-2 h-14 rounded-sm bg-muted/20 relative overflow-hidden">
                          <div
                            className={cn(
                              "absolute inset-x-0 bottom-0",
                              accuracy >= 95
                                ? "bg-primary"
                                : accuracy >= 80
                                  ? "bg-amber-400"
                                  : "bg-red-500",
                            )}
                            style={{ height: `${Math.max(12, accuracy)}%` }}
                          />
                        </div>
                        <div className="mt-2 font-mono text-[9px] text-muted-foreground">
                          {accuracy}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button className="w-full h-12 font-mono font-bold bg-primary text-primary-foreground group">
                  {labels.viewFinal}
                  <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1" />
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground font-mono"
                >
                  {labels.review}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1.5 mb-1 opacity-50">
        {icon}
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div className="text-xl font-mono font-bold tabular-nums">{value}</div>
    </div>
  );
}

function LeadItem({
  rank,
  name,
  wpm,
}: {
  rank: number;
  name: string;
  wpm: number;
}) {
  return (
    <div className="flex items-center justify-between text-[11px] font-mono p-1 opacity-70 hover:opacity-100 transition-opacity">
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground/50 w-3">{rank}</span>
        <span className="font-bold">{name}</span>
      </div>
      <span className="text-teal-400">{wpm} WPM</span>
    </div>
  );
}

// Helpers
function calculateWPM(input: string, start: number, now: number) {
  const words = input.length / 5;
  const mins = (now - start) / 60000;
  return Math.round(words / mins) || 0;
}

function calculateAccuracy(input: string, code: string, errors: number) {
  if (input.length === 0) return 100;
  const acc = ((input.length - errors) / input.length) * 100;
  return Math.max(0, Math.round(acc));
}

function formatDuration(start: number, now: number) {
  const seconds = Math.floor((now - start) / 1000);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function calculateStats(
  input: string,
  code: string,
  start: number | null,
  end: number | null,
  errors: number,
) {
  if (!start) return { wpm: 0, accuracy: 100, time: "0:00" };
  const now = end || Date.now();
  return {
    wpm: calculateWPM(input, start, now),
    accuracy: calculateAccuracy(input, code, errors),
    time: formatDuration(start, now),
  };
}

function buildCharStats(
  sessionCharStats: Record<string, { hits: number; errors: number }>,
) {
  return Object.entries(sessionCharStats)
    .map(([char, stats]) => ({
      char,
      hits: stats.hits,
      errors: stats.errors,
    }))
    .sort(
      (left, right) => right.errors - left.errors || right.hits - left.hits,
    );
}
