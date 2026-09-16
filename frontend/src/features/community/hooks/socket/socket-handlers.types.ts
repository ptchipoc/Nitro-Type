import type { Socket } from "socket.io-client";

import type {
  SocketChannelMessagePayload,
  SocketDMMessagePayload,
  SocketMessageEditedPayload,
  SocketPresencePayload,
  SocketReactionAddedPayload,
  SocketReactionRemovedPayload,
} from "@/features/community/types/socket.types";

export interface CommunitySocketHandlers {
  onConnect?: (socket: Socket) => void;

  onDisconnect?: (reason: string) => void;

  onConnectError?: (message: string) => void;

  onError?: (payload: unknown) => void;

  onChannelMessage?: (
    payload: SocketChannelMessagePayload,
  ) => void;

  onDMMessage?: (
    payload: SocketDMMessagePayload,
  ) => void;

  onUserOnline?: (
    payload: { userId: string },
  ) => void;

  onUserOffline?: (
    payload: { userId: string },
  ) => void;

  onPresenceUpdated?: (
    payload: SocketPresencePayload,
  ) => void;

  onPresenceStatus?: (
    payload: SocketPresencePayload,
  ) => void;

  onReactionAdded?: (
    payload: SocketReactionAddedPayload,
  ) => void;

  onReactionRemoved?: (
    payload: SocketReactionRemovedPayload,
  ) => void;

  onMessageEdited?: (
    payload: SocketMessageEditedPayload,
  ) => void;
}