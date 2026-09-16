import type { DMConversation, Message } from "./community.type";

export interface SocketChannelMessagePayload {
  channelId: string;
  message: Message;
}

export interface SocketDMMessageEnvelope {
  conversation?: DMConversation;
  message?: Message;
}

export interface SocketDMMessagePayload {
  participantId: string;
  message: Message | SocketDMMessageEnvelope;
}

export interface SocketPresencePayload {
  id?: string;
  userId: string;
  status?: string;
  lastSeenAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface SocketReactionAddedPayload {
  messageId: string;
  emoji: string;
  userId: string;
  reaction: Message;
}

export interface SocketReactionRemovedPayload {
  messageId: string;
  emoji: string;
  userId: string;
}

export interface SocketMessageEditedPayload {
  messageId: string;
  content: string;
  channelId?: string;
  dmId?: string;
}