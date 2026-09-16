"use client";
import { CursorGlow } from "@/components/cursor-glow";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight, Loader2, Share2 } from "lucide-react";
import { EventHeader } from "../components/details/EventHeader";
import { EventRewardsShowcase } from "../components/details/EventRewardsShowcase";
import { JoinCard } from "../components/details/JoinCard";
import { InviteSection } from "../components/details/InviteSection";
import { ParticipantsLobby } from "../components/details/ParticipantsLobby";
import { RoundsList } from "../components/details/RoundsList";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { useEvent } from "@/features/events/hooks/use-event";
import { useScheduleEvent } from "@/features/events/hooks/use-schedule-event";
import { useStartEvent } from "@/features/events/hooks/use-start-event";
import { useInviteToEvent } from "@/features/events/hooks/use-invite-to-event";
import { useAcceptInvite } from "@/features/events/hooks/use-accept-invite";
import { ApiClientError } from "@/features/apiClient";
import { toast } from "sonner";
import {
  EventStatus,
  EventType,
  ParticipantStatus,
} from "@/features/events/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { labelsByLocale } from "../components/details/constants";
import { EventArenaPage } from "./arena/EventArenaPage";
import {
  RoundResultPayload,
  SendProgressInput,
  useEventSocket,
} from "@/features/events/hooks/use-event-socket";
import { RoundFinishResults } from "./result/RoundFinishResults";
import { BetweenRounds } from "./arena/BetweenRounds";
import EventFinishResults from "./result/EventFinishResults";
import { useSubmitRoundResults } from "@/features/events/hooks/use-submit-round-results";

function handleApiError(error: unknown) {
  if (error instanceof ApiClientError) {
    toast.error(error.getMessage());
  } else {
    toast.error("Ocorreu um erro inesperado.");
  }
}

export interface EventStateProgress {
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  typedChars: number;
}

export default function EventDetailPage() {
  const eventId = useParams().id as string;
  const { locale } = useTranslation();
  const labels = labelsByLocale[locale] ?? labelsByLocale.en;
  const { data: userData, isLoading: isLoadingUser } = useUser();
  const user = userData;
  const eventSocket = useEventSocket({ eventId: eventId, autoJoin: true });
  const {
    data: eventData,
    isLoading: isLoadingEvent,
    isError,
  } = useEvent(eventId);
  const event = eventData?.data;
  const scheduleMutation = useScheduleEvent();
  const startEventMutation = useStartEvent();
  const inviteMutation = useInviteToEvent();
  const acceptInviteMutation = useAcceptInvite();
  const [inviteEmail, setInviteEmail] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const submitRound = useSubmitRoundResults();
  const submitRoundRef = useRef(submitRound);
  const [eventStateProgress, setEventStateProgress] =
    useState<EventStateProgress>({
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0,
      typedChars: 0,
    });
  const [roundResultUser, setRoundResultUser] =
    useState<RoundResultPayload | null>(null);
  const prevLastResult = useRef(eventSocket.lastResult);

  // Derive timeLimit, wordCount, & roundNumber directly (no state duplication)
  const timeLimit = eventSocket.roundStarted?.timeLimit ?? 0;
  const wordCount = eventSocket.roundStarted?.wordCount ?? 0;
  const roundNumber =
    eventSocket.roundStarted?.roundNumber ??
    eventSocket.event?.currentRound ??
    event?.currentRound ??
    1;

  // Store timeLimit, wordCount, and roundNumber in refs to preserve them when round finishes
  const timeLimitRef = useRef(timeLimit);
  const wordCountRef = useRef(wordCount);
  const roundNumberRef = useRef(roundNumber);

  useEffect(() => {
    if (eventSocket.roundStarted) {
      timeLimitRef.current = timeLimit;
      wordCountRef.current = wordCount;
      roundNumberRef.current = roundNumber;
      // Reset submission state for the new round
      setHasSubmitted(false);
      setRoundResultUser(null);
      setEventStateProgress({
        correctChars: 0,
        incorrectChars: 0,
        totalChars: eventSocket.roundStarted?.text.length ?? 0,
        typedChars: 0,
      });
    }
  }, [timeLimit, wordCount, roundNumber, eventSocket.roundStarted]);

  // Keep submitRoundRef in sync without assigning during render
  useEffect(() => {
    submitRoundRef.current = submitRound;
  }, [submitRound]);

  const handleFinish = useCallback(
    async ({ timeLeft }: { timeLeft: number }) => {
      if (hasSubmitted || !event) {
        toast.error("Round ja finalizado!");
        return;
      }
      const timeToSend =
        (eventSocket.roundStarted?.timeLimit ?? timeLimitRef.current) -
        timeLeft;
      try {
        const data = {
          eventId: event.id,
          roundNumber: roundNumberRef.current,
          typedChars: eventStateProgress.typedChars,
          correctChars: eventStateProgress.correctChars,
          totalChars: eventStateProgress.totalChars,
          incorrectChars: eventStateProgress.incorrectChars,
          completionTime: timeToSend,
          wordCount: wordCountRef.current,
          timeLimit: timeLimitRef.current,
        };
        toast.success("Round finalizado! Aguardando resultados...");

        await submitRoundRef.current.mutateAsync(
          {
            eventId: event.id,
            input: data,
          },
          {
            onSuccess: () => {
              toast.success("Resultados enviados com sucesso!");
              toast.info(`Resultados enviados! Tempo restante: ${timeLeft}s`);
              setHasSubmitted(true);
            },
          },
        );
      } catch (error) {
        toast.error("Erro ao enviar resultados!");
        handleApiError(error);
      }
    },
    [
      hasSubmitted,
      event,
      eventStateProgress,
      eventSocket.roundStarted?.timeLimit,
    ],
  );

  // Handle round results (moved from render to useEffect to prevent infinite loop)
  useEffect(() => {
    if (
      user &&
      eventSocket.lastResult &&
      eventSocket.lastResult.userId === user.id &&
      hasSubmitted &&
      eventSocket.lastResult !== prevLastResult.current &&
      !eventSocket.roundFinished
    ) {
      toast.info("Resultados do round recebidos!");

      setRoundResultUser(eventSocket.lastResult);
      prevLastResult.current = eventSocket.lastResult;
    }
  }, [user, eventSocket.lastResult, hasSubmitted]);

  // Show toast when round finishes (avoids side-effect during render)
  const prevRoundFinished = useRef(eventSocket.roundFinished);
  useEffect(() => {
    if (
      eventSocket.roundFinished &&
      eventSocket.roundFinished !== prevRoundFinished.current
    ) {
      toast.info("Round finalizado! Aguardando resultados...");
      // Force submit if not already submitted (user didn't finish in time)
      if (!hasSubmitted) {
        handleFinish({ timeLeft: 0 });
      }
      // NOTE: state reset (hasSubmitted, eventStateProgress, roundResultUser)
      // is handled by the roundStarted effect when the next round begins
    }
    prevRoundFinished.current = eventSocket.roundFinished;
  }, [eventSocket.roundFinished, hasSubmitted, handleFinish]);

  const sendProgressSocketRef = useRef(eventSocket.sendProgress);
  useEffect(() => {
    sendProgressSocketRef.current = eventSocket.sendProgress;
  }, [eventSocket.sendProgress]);

  const handleSendProgress = useCallback((data: SendProgressInput) => {
    sendProgressSocketRef.current(data);
    setEventStateProgress((prev: EventStateProgress) => ({
      ...prev,
      correctChars: data.correctTypedChars,
      incorrectChars: data.incorrectTypedChars,
      typedChars: data.typedChars,
    }));
  }, []);

  if (isLoadingEvent) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-mono">
        <div className="animate-pulse text-primary text-xs uppercase tracking-widest">
          Loading Event Data...
        </div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-mono text-red-500 text-xs text-center px-4">
        <p className="font-black mb-2 animate-bounce">[404] EVENT_NOT_FOUND</p>
        <p className="opacity-60 text-[10px] uppercase">
          Falha ao recuperar detalhes da arena ou evento inexistente.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-6 uppercase font-black text-[10px] tracking-widest"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-3 h-3 mr-2" />
          Voltar ao Lobby
        </Button>
      </div>
    );
  }

  // ── Dados derivados ───────────────────────────────────────────────────────

  const participants = event.participants ?? [];
  const participant = participants.find((p) => p.userId === user?.id);
  const isParticipant = participant?.status !== ParticipantStatus.INVITED;
  const isCreator = event.creatorId === user?.id;

  // Consider all users in the event if no one has the INVITED status
  const allUserInEvent =
    participants.length > 1 &&
    participants.every((p) => p.status !== ParticipantStatus.INVITED);

  const isPublic = event.type === EventType.PUBLIC;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    try {
      await inviteMutation.mutateAsync({
        eventId: event.id,
        input: { email: inviteEmail.trim() },
      });
      setInviteEmail("");
      toast.success("Convite enviado com sucesso!");
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleAcceptInvite = async () => {
    try {
      await acceptInviteMutation.mutateAsync(event.id);
      toast.success("Convite aceite!");
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleSchedule = async () => {
    try {
      await scheduleMutation.mutateAsync(event.id);
      toast.success("Evento agendado!");
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleStartEvent = async () => {
    try {
      await startEventMutation.mutateAsync(event.id);
      toast.success("Evento iniciado!");
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleResumeEvent = async () => {
    try {
      await startEventMutation.mutateAsync(event.id);
      toast.success("Evento retomado!");
    } catch (error) {
      handleApiError(error);
    }
  };

  if (eventSocket.roundStarted) {
    if (roundResultUser && eventSocket.lastResult) {
      return <RoundFinishResults result={roundResultUser} />;
    }

    return (
      <EventArenaPage
        event={event}
        user={user ?? null}
        roundStarted={eventSocket.roundStarted}
        roundStartTime={eventSocket.roundStartTime}
        hasSubmitted={hasSubmitted}
        onRoundFinish={handleFinish}
        participantsProgress={eventSocket.participantsProgress}
        sendProgress={handleSendProgress}
      />
    );
  }

  if (eventSocket.event?.status == EventStatus.FINISHED) {
    return <EventFinishResults eventId={eventId} />;
  }

  if (eventSocket.roundBetween) {
    return (
      <BetweenRounds
        delaySeconds={eventSocket.roundBetween.delaySeconds}
        nextRoundNumber={eventSocket.roundBetween.nextRoundNumber}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-mono text-foreground overflow-x-hidden scanlines">
      <Header />
      <CursorGlow />
      <main className="flex-1 pt-24 pb-12 px-4 md:px-8 max-w-6xl mx-auto w-full">
        {/* Navegação */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground font-mono -ml-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Eventos
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground font-mono"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Partilhar
          </Button>
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Coluna esquerda — Info & Rounds */}
          <div className="lg:col-span-2 space-y-8">
            <EventHeader
              eventData={event}
              labels={labels}
              locale={locale}
              participantsCount={participants.length}
            />
            {/* <EventRewardsShowcase
              isPublic={isPublic}
              baseXp={event.baseXp}
              medals={event.medals}
            /> */}
          </div>

          {/* Coluna direita — Acções & Participantes */}
          <div className="lg:col-span-1 space-y-6">
            <JoinCard
              eventData={event}
              isParticipant={isParticipant}
              isCreator={isCreator}
              labels={labels}
              onSchedule={handleSchedule}
              isScheduling={scheduleMutation.isPending}
            />

            {isCreator && event.status === EventStatus.WAITING && (
              <InviteSection
                inviteEmail={inviteEmail}
                setInviteEmail={setInviteEmail}
                onInvite={handleInvite}
                isInviting={inviteMutation.isPending}
                labels={labels}
              />
            )}

            {!isCreator && !isParticipant && (
              <Button
                className="w-full h-12 font-mono font-bold bg-primary hover:bg-primary/90 text-primary-foreground group"
                onClick={handleAcceptInvite}
                disabled={acceptInviteMutation.isPending}
              >
                {acceptInviteMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                )}
                {labels.acceptInvite}
              </Button>
            )}

            {isCreator &&
              event.status === EventStatus.WAITING &&
              allUserInEvent && (
                <Button
                  className="w-full h-12 font-mono font-bold bg-primary hover:bg-primary/90 text-primary-foreground group"
                  onClick={handleStartEvent}
                  disabled={startEventMutation.isPending}
                >
                  {startEventMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  )}
                  {labels.startEvent}
                </Button>
              )}

            {isCreator && event.status === EventStatus.FINISHED && (
              <Button
                className="w-full h-12 font-mono font-bold bg-primary hover:bg-primary/90 text-primary-foreground group"
                onClick={handleResumeEvent}
                disabled={startEventMutation.isPending}
              >
                {startEventMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                )}
                Retomar Evento
              </Button>
            )}

            <ParticipantsLobby participants={participants} labels={labels} />

            <RoundsList
              roundsCount={event.roundsCount}
              currentRound={event.currentRound}
              category={event.category}
              difficulty={event.difficulty}
              labels={labels}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
