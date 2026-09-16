"use client";

import { CursorGlow } from "@/components/cursor-glow";
import { ArenaHeader } from "./ArenaHeader";
import { EventRoundResponse, TypingEvent } from "@/features/events/types";
import {
  ParticipantProgressPayload,
  SendProgressInput,
} from "@/features/events/hooks/use-event-socket";
import { ApiUser } from "@/lib/api/endpoints/user/user.type";
import { useCallback, useEffect, useRef, useState } from "react";
import { TypingArenaContent } from "@/features/typing/components/TypingArenaContent";
import { ParticipantsProgress } from "./ParticipantsProgress";
import { Header } from "@/components/header";
import { useTranslation } from "@/lib/i18n";
import { labelsByLocale } from "../../components/details/constants";

interface EventArenaPageProps {
  event: TypingEvent;
  roundStarted: EventRoundResponse;
  sendProgress: (data: SendProgressInput) => void;
  onRoundFinish: ({ timeLeft }: { timeLeft: number }) => void;
  hasSubmitted: boolean;
  participantsProgress: Record<string, ParticipantProgressPayload>;
  user: ApiUser | null;
  roundStartTime: number | null;
}

export function EventArenaPage({
  event,
  user,
  roundStarted,
  participantsProgress,
  onRoundFinish,
  hasSubmitted,
  sendProgress,
  roundStartTime,
}: EventArenaPageProps) {
  const { locale } = useTranslation();
  const labels = labelsByLocale[locale as keyof typeof labelsByLocale];
  const [timeLeft, setTimeLeft] = useState<number>(roundStarted.timeLimit);

  // Use refs to keep handleFinish stable (avoid new ref every timer tick)
  const timeLeftRef = useRef(timeLeft);
  const onRoundFinishRef = useRef(onRoundFinish);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    onRoundFinishRef.current = onRoundFinish;
  }, [onRoundFinish]);

  const handleFinish = useCallback(() => {
    onRoundFinishRef.current({ timeLeft: timeLeftRef.current });
  }, []);

  useEffect(() => {
    // Definimos o instante de início real ou fazemos fallback
    const startedAt = roundStartTime || Date.now();
    const timeLimitS = roundStarted.timeLimit;

    // Configura o valor inicial imediato
    const initialElapsedS = Math.floor((Date.now() - startedAt) / 1000);
    const initialRemaining = Math.max(0, timeLimitS - initialElapsedS);
    setTimeLeft(initialRemaining);

    const timer = setInterval(() => {
      const elapsedS = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = Math.max(0, timeLimitS - elapsedS);

      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 500);

    return () => clearInterval(timer);
  }, [roundStartTime, roundStarted.timeLimit]);

  if (!user) {
    return <div className="p-4 text-center">{labels.loadingUser}</div>;
  }

  if (!roundStarted) {
    return (
      <div className="p-4 text-center">{labels.waitingEventStart}</div>
    );
  }

  const roundNumber = roundStarted.roundNumber ?? 0;
  const text = roundStarted.text ?? "";

  return (
    <div className="max-w-6xl mx-auto flex flex-col items-center pt-10 pb-32">
      <Header />
      <CursorGlow />
      <ArenaHeader
        event={event}
        roundNumber={roundNumber}
        timeLeft={timeLeft}
      />
      <ParticipantsProgress
        userId={user.id}
        event={event}
        participantsProgress={participantsProgress}
      />
      <div className="flex flex-col items-center w-full max-w-4xl relative">
        <TypingArenaContent
          eventId={event.id}
          roundNumber={roundNumber}
          currentText={text}
          wordCount={roundStarted.wordCount}
          hasSubmitted={hasSubmitted}
          onFinish={handleFinish}
          sendProgress={sendProgress}
          timeLeft={timeLeft}
        />
      </div>
    </div>
  );
}
