"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  io,
  type Socket,
} from "socket.io-client";

import { getSocketConfig } from "@/features/config";

import type {
  CommunitySocketHandlers,
} from "./socket-handlers.types";

import {
  registerSocketListeners,
} from "./register-socket-listeners";

interface UseCommunitySocketOptions {
  userId?: string;

  enabled?: boolean;

  handlers?: CommunitySocketHandlers;
}

export function useCommunitySocket({
  userId,
  enabled = true,
  handlers,
}: UseCommunitySocketOptions) {
  const socketRef = useRef<Socket | null>(
    null,
  );

  const handlersRef =
    useRef<CommunitySocketHandlers>({});

  const [connected, setConnected] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    handlersRef.current = handlers ?? {};
  }, [handlers]);

  useEffect(() => {
    if (!enabled || !userId) {
      return;
    }

    const { origin, path } =
      getSocketConfig();

    const socket = io(
      `${origin}/community`,
      {
        path,

        auth: {
          userId,
        },

        transports: ["websocket"],

        withCredentials: true,

        autoConnect: true,

        reconnection: true,

        reconnectionAttempts: 5,

        reconnectionDelay: 1000,

        reconnectionDelayMax: 5000,
      },
    );

    socketRef.current = socket;

    registerSocketListeners({
      socket,

      handlersRef,

      setConnected,

      setError,
    });

    return () => {
      socket.disconnect();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }

      setConnected(false);
    };
  }, [enabled, userId]);

  const emit = useCallback(
    (
      event: string,
      payload?: Record<string, unknown>,
    ) => {
      socketRef.current?.emit(
        event,
        payload,
      );
    },
    [],
  );

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();

    socketRef.current = null;

    setConnected(false);
  }, []);

  return {
    connected,

    error,

    emit,

    disconnect,
  };
}