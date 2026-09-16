"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Props {
  targetDate: string;
  className?: string;
  onEnd?: () => void;
  variant?: "urgent" | "normal";
}

export function CountdownTimer({
  targetDate,
  className,
  onEnd,
  variant = "normal",
}: Props) {
  const [timeLeft, setTimeLeft] = useState<{
    d: number;
    h: number;
    m: number;
    s: number;
  } | null>(null);

  useEffect(() => {
    // console.log("targetDate", targetDate);
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft(null);
        onEnd?.();
        return;
      }

      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onEnd]);

  if (!timeLeft) return null;

  const isUrgent =
    variant === "urgent" ||
    (timeLeft.d === 0 && timeLeft.h === 0 && timeLeft.m < 5);

  return (
    <div className={cn("flex gap-3 font-mono", className)}>
      {timeLeft.d > 0 && (
        <TimeUnit value={timeLeft.d} label="d" isUrgent={isUrgent} />
      )}
      <TimeUnit value={timeLeft.h} label="h" isUrgent={isUrgent} />
      <TimeUnit value={timeLeft.m} label="m" isUrgent={isUrgent} />
      <TimeUnit value={timeLeft.s} label="s" isUrgent={isUrgent} />
    </div>
  );
}

function TimeUnit({
  value,
  label,
  isUrgent,
}: {
  value: number;
  label: string;
  isUrgent: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "text-2xl font-bold tabular-nums transition-colors duration-500",
          isUrgent ? "text-red-500 animate-pulse" : "text-foreground",
        )}
      >
        {value.toString().padStart(2, "0")}
      </div>
      <div className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest -mt-1">
        {label}
      </div>
    </div>
  );
}
