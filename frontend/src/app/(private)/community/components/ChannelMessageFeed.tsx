"use client";

import type { RefObject } from "react";
import { Hash, Lock } from "lucide-react";
import { ChannelMessageBubble } from "./ChannelMessageBubble";
import type { RenderMessage } from "../types/channel-view.types";

interface ChannelMessageFeedProps {
  isPrivate: boolean;
  channelName: string;
  currentUserId: string;
  localMessages: RenderMessage[];
  emptyLabel: string;
  emptyHintLabel: string;
  bottomRef: RefObject<HTMLDivElement | null>;
  onEditMessage?: (messageId: string, content: string) => Promise<void> | void;
  onDeleteMessage?: (messageId: string) => Promise<void> | void;
  onAddReaction?: (messageId: string, emoji: string) => Promise<void> | void;
  onRemoveReaction?: (messageId: string, emoji: string) => Promise<void> | void;
}

export function ChannelMessageFeed({
  isPrivate,
  channelName,
  currentUserId,
  localMessages,
  emptyLabel,
  emptyHintLabel,
  bottomRef,
  onEditMessage,
  onDeleteMessage,
  onAddReaction,
  onRemoveReaction,
}: ChannelMessageFeedProps) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-hide px-4 py-4 space-y-4">
      {localMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-12 h-12 rounded-sm border border-border bg-card flex items-center justify-center mb-3">
            {isPrivate ? (
              <Lock className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Hash className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <p className="font-mono text-sm text-muted-foreground">
            {emptyLabel}
          </p>
          <p className="text-xs text-muted-foreground/50 font-mono mt-1">
            {emptyHintLabel} #{channelName}
          </p>
        </div>
      ) : (
        localMessages.map((msg) => (
          <ChannelMessageBubble
            key={msg.id}
            msg={msg}
            isOwn={msg.authorId === currentUserId}
            onEdit={onEditMessage}
            onDelete={onDeleteMessage}
            onAddReaction={onAddReaction}
            onRemoveReaction={onRemoveReaction}
          />
        ))
      )}
      <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/50 h-4" />
      <div ref={bottomRef} />
    </div>
  );
}
