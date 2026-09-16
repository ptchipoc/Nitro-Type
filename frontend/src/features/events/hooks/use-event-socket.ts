"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import {
  EventRoundResponse,
  EventStatus,
  TypingEvent,
} from "@/features/events/types";
import { getSocketConfig } from "@/features/config";

// ─── Socket Payload Types ─────────────────────────────────────────────────────
// Estes tipos descrevem os payloads vindos do WebSocket.
// Tipos de domínio (TypingEvent, EventRoundResponse, etc.) vivem em features/events/types.ts

export interface RoundFinishedPayload {
  eventId: string;
  roundNumber: number;
}

export interface RoundBetweenPayload {
  eventId: string;
  delaySeconds: number;
  nextRoundNumber: number;
}

export interface RoundResultPayload {
  userId: string;
  roundNumber: number;
  score: number;
  wpm: number;
  accuracy: number;
  completionRate: number;
  errorRate: number;
  completionTime: number;
}

export interface ParticipantProgressPayload {
  userId: string;
  typedChars: number;
  correctTypedChars: number;
  incorrectTypedChars: number;
  progress: number;
}

export interface SendProgressInput {
  eventId: string;
  roundNumber: number;
  typedChars: number;
  correctTypedChars: number;
  incorrectTypedChars: number;
  progress: number;
  completionTime?: number;
}

// ─── Estado do Socket ─────────────────────────────────────────────────────────

interface EventSocketState {
  connected: boolean;
  event: TypingEvent | null;
  roundStarted: EventRoundResponse | null;
  roundStartTime: number | null;
  roundFinished: RoundFinishedPayload | null;
  roundBetween: RoundBetweenPayload | null;
  lastResult: RoundResultPayload | null;
  results: Record<string, RoundResultPayload[]>;
  participantsProgress: Record<string, ParticipantProgressPayload>;
}

const INITIAL_STATE: EventSocketState = {
  connected: false,
  event: null,
  roundStarted: null,
  roundStartTime: null,
  roundFinished: null,
  roundBetween: null,
  lastResult: null,
  results: {},
  participantsProgress: {},
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseEventSocketOptions {
  eventId: string;
  autoJoin?: boolean;
}

/**
 * Gere a ligação WebSocket ao namespace `/events`.
 * Deve ser instanciado UMA SÓ VEZ por página e o estado partilhado
 * via props ou context — nunca instanciar dentro de componentes filhos.
 */
export function useEventSocket({
  eventId,
  autoJoin = true,
}: UseEventSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const storageKey = `event:${eventId}`;

  const [state, setState] = useState<EventSocketState>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.event?.status !== EventStatus.FINISHED) {
            return {
              ...INITIAL_STATE,
              ...parsed,
              connected: false,
            };
          } else {
            localStorage.removeItem(storageKey);
          }
        }
      } catch (err) {
        console.error("[WS] Failed to parse stored state:", err);
      }
    }
    return INITIAL_STATE;
  });

  // Sync to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (state.event?.status === EventStatus.FINISHED) {
      localStorage.removeItem(storageKey);
    } else {
      const { connected, ...rest } = state;
      localStorage.setItem(storageKey, JSON.stringify(rest));
    }
  }, [state, storageKey]);

  const patch = useCallback((partial: Partial<EventSocketState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  // ─── Lifecycle ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const { origin, path } = getSocketConfig();
    const socket = io(`${origin}/events`, {
      path,
      transports: ["websocket"],
      autoConnect: true,
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      patch({ connected: true });
      // console.log("[WS] connect");
      if (autoJoin) socket.emit("event:join", { eventId });
    });

    socket.on("disconnect", () => patch({ connected: false }));

    socket.on("connect_error", (err) => {
      console.error("[WS] erro de ligação:", err.message);
    });

    // ── Event handlers ─────────────────────────────────────────────────────

    socket.on("event:state", (event: TypingEvent) => {
      patch({ event });
    });

    socket.on("event:started", () => {
      setState((prev) => ({
        ...prev,
        event: prev.event
          ? { ...prev.event, status: EventStatus.ACTIVE }
          : null,
      }));
    });

    socket.on("event:finished", () => {
      setState((prev) => ({
        ...prev,
        event: prev.event
          ? { ...prev.event, status: EventStatus.FINISHED }
          : null,
      }));
    });

    socket.on("round:started", (data: EventRoundResponse) => {
      patch({
        roundStarted: data,
        roundStartTime: Date.now(),
        roundFinished: null,
        roundBetween: null,
      });
    });

    socket.on("round:finished", (data: RoundFinishedPayload) => {
      patch({ roundFinished: data, roundStarted: null });
    });

    socket.on("round:between", (data: RoundBetweenPayload) => {
      patch({ roundBetween: data, roundStarted: null, roundFinished: null });
    });

    socket.on("round:result", (data: RoundResultPayload) => {
      setState((prev) => ({
        ...prev,
        lastResult: data,
        results: {
          ...prev.results,
          [data.userId]: [...(prev.results[data.userId] ?? []), data],
        },
      }));
    });

    socket.on(
      "event:participant_progress",
      (data: ParticipantProgressPayload) => {
        setState((prev) => ({
          ...prev,
          participantsProgress: {
            ...prev.participantsProgress,
            [data.userId]: data,
          },
        }));
      },
    );

    socket.on("error", (err: unknown) => {
      console.error("[WS] Erro:", err);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [eventId, autoJoin, patch]);

  // ─── Acções públicas ────────────────────────────────────────────────────────

  const join = useCallback(() => {
    socketRef.current?.emit("event:join", { eventId });
  }, [eventId]);

  const leave = useCallback(() => {
    socketRef.current?.emit("event:leave", { eventId });
  }, [eventId]);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
  }, []);

  const sendProgress = useCallback((data: SendProgressInput) => {
    socketRef.current?.emit("event:progress", data);
  }, []);

  return { ...state, join, leave, disconnect, sendProgress };
}
