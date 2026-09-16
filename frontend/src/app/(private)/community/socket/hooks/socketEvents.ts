"use client";

import {
  useCommunitySocket,
} from "@/features/community/hooks/socket/community-socket";

import {
  createCommunitySocketHandlers,
} from "../factories/create-community-socket-handlers";

import type {
  SocketContext,
} from "../types/socket-context.types";

export function useSocketEvents(
  context: SocketContext,
) {
  const handlers =
    createCommunitySocketHandlers(
      context,
    );

  const {
    connected,
    emit,
  } = useCommunitySocket({
    userId:
      context.resolvedCurrentUserId,

    handlers: {
      onConnect:
        handlers.handleConnect,

      onDisconnect:
        handlers.handleDisconnect,

      onChannelMessage:
        handlers.handleSocketChannelMessage,

      onDMMessage:
        handlers.handleSocketDMMessage,

      onReactionAdded:
        handlers.handleSocketReactionAdded,

      onReactionRemoved:
        handlers.handleSocketReactionRemoved,

      onMessageEdited:
        handlers.handleSocketMessageEdited,

      onPresenceUpdated:
        handlers.handleSocketPresence,

      onPresenceStatus:
        handlers.handleSocketPresence,

      onError:
        handlers.handleSocketError,
    },
  });

  return {
    communitySocketConnected:
      connected,

    emitCommunityEvent:
      emit,
  };
}