"use client";

import { motion } from "framer-motion";
import { Smile, Crown, ShieldCheck, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { MemberRole } from "../types/member.types";
import { formatMessageTime } from "../utils/format-message-time";
import {
  channelViewEmojiGroups,
  channelViewLabelsByLocale,
} from "../locates/channel-view.labels";
import type { RenderMessage } from "../types/channel-view.types";

interface ChannelMessageBubbleProps {
  msg: RenderMessage;
  isOwn: boolean;
  onEdit?: (messageId: string, content: string) => Promise<void> | void;
  onDelete?: (messageId: string) => Promise<void> | void;
  onAddReaction?: (messageId: string, emoji: string) => Promise<void> | void;
  onRemoveReaction?: (messageId: string, emoji: string) => Promise<void> | void;
}

function roleIcon(role: MemberRole) {
  switch (role) {
    case "MASTER_ADMIN":
    case "GROUP_OWNER":
      return <Crown className="h-2.5 w-2.5 text-amber-400 shrink-0" />;
    case "GROUP_ADMIN":
      return <ShieldCheck className="h-2.5 w-2.5 text-blue-400 shrink-0" />;
    default:
      return null;
  }
}

function authorColor(role: MemberRole): string {
  switch (role) {
    case "MASTER_ADMIN":
    case "GROUP_OWNER":
      return "text-amber-400";
    case "GROUP_ADMIN":
      return "text-blue-400";
    default:
      return "text-foreground";
  }
}

export function ChannelMessageBubble({
  msg,
  isOwn,
  onEdit,
  onDelete,
  onAddReaction,
  onRemoveReaction,
}: ChannelMessageBubbleProps) {
  const { locale } = useTranslation();
  const labels = channelViewLabelsByLocale[locale];
  const [reactionPickerOpen, setReactionPickerOpen] = useState(false);
  const reactionButtonRef = useRef<HTMLButtonElement>(null);
  const reactionPickerRef = useRef<HTMLDivElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(msg.content);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setDraft(msg.content);
    }
  }, [msg.content, isEditing]);

  useEffect(() => {
    if (!reactionPickerOpen) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (reactionPickerRef.current?.contains(target)) return;
      if (reactionButtonRef.current?.contains(target)) return;
      setReactionPickerOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [reactionPickerOpen]);

  // 1. Maintain what we KNOW is visually correct 100% of the time.
  const [activeEmoji, setActiveEmoji] = useState<string | null>(
    () => (msg.reactions || []).find((r) => r.reacted)?.emoji || null
  );

  // 2. Fallback to accept page refreshes/loads explicitly setting an emoji
  useEffect(() => {
    const explicitlyReacted = msg.reactions?.find((r) => r.reacted)?.emoji;
    if (explicitlyReacted && explicitlyReacted !== activeEmoji) {
      setActiveEmoji(explicitlyReacted);
    }
  }, [msg.reactions]);

  // 3. We maintain an optimistic diff registry (expires automatically)
  // This lets us "fake" counts locally while the backend catches up.
  const optimisticDiffs = useRef<Record<string, number>>({});

  const [reactions, setReactions] = useState(msg.reactions || []);

  useEffect(() => {
    let newReactions = [...(msg.reactions || [])];

    // Apply active emoji enforcement strictly
    newReactions = newReactions.map(r => ({
      ...r,
      reacted: r.emoji === activeEmoji
    }));

    // If active doesn't exist at all yet from server, inject it
    if (activeEmoji && !newReactions.find(r => r.emoji === activeEmoji)) {
      newReactions.push({ emoji: activeEmoji, count: 0, reacted: true });
    }

    // Apply our local diffs
    newReactions = newReactions.map(r => {
      let diff = optimisticDiffs.current[r.emoji] || 0;
      let c = Math.max(0, r.count + diff);
      return { ...r, count: r.reacted ? Math.max(1, c) : c };
    });

    setReactions(newReactions.filter(r => r.count > 0));
  }, [msg.reactions, activeEmoji]);

  async function handleReaction(emoji: string) {
    if (!onAddReaction && !onRemoveReaction) {
      setActiveEmoji(activeEmoji === emoji ? null : emoji);
      return;
    }

    try {
      if (activeEmoji === emoji) {
        // Toggle OFF
        setActiveEmoji(null);
        optimisticDiffs.current[emoji] = (optimisticDiffs.current[emoji] || 0) - 1;
        setReactions(r => [...r]); // force recompute

        await onRemoveReaction?.(msg.id, emoji);
        setTimeout(() => { if (optimisticDiffs.current[emoji]) optimisticDiffs.current[emoji]++; setReactions(r => [...r]) }, 1000);
        return;
      }

      const prev = activeEmoji;
      setActiveEmoji(emoji);
      optimisticDiffs.current[emoji] = (optimisticDiffs.current[emoji] || 0) + 1;

      if (prev) {
        optimisticDiffs.current[prev] = (optimisticDiffs.current[prev] || 0) - 1;
        try {
          const res = onRemoveReaction?.(msg.id, prev);
          if (res instanceof Promise) res.catch(console.error);
        } catch (e) {
          console.error(e);
        }
        setTimeout(() => { if (optimisticDiffs.current[prev]) optimisticDiffs.current[prev]++; setReactions(r => [...r]) }, 1000);
      }

      setReactions(r => [...r]); // force recompute
      await onAddReaction?.(msg.id, emoji);
      setTimeout(() => { if (optimisticDiffs.current[emoji]) optimisticDiffs.current[emoji]--; setReactions(r => [...r]) }, 1000);

    } catch (e) {
      console.error(e);
    }
  }

  async function handleEmojiReaction(emoji: string) {
    await handleReaction(emoji);
    setReactionPickerOpen(false);
  }

  const trimmedDraft = draft.trim();
  const canSaveEdit =
    trimmedDraft.length > 0 && trimmedDraft !== msg.content.trim();

  async function handleSaveEdit() {
    if (!onEdit || !canSaveEdit) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSubmittingEdit(true);
      await onEdit(msg.id, trimmedDraft);
      setIsEditing(false);
    } finally {
      setIsSubmittingEdit(false);
    }
  }

  function handleCancelEdit() {
    setDraft(msg.content);
    setIsEditing(false);
  }

  async function handleDeleteMessage() {
    if (!onDelete) return;

    const confirmed = window.confirm(labels.confirmDelete);
    if (!confirmed) return;

    await onDelete(msg.id);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "flex items-start gap-2.5 group",
        isOwn && "flex-row-reverse",
      )}
    >
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-mono font-bold border shrink-0 mt-0.5 overflow-hidden",
          msg.authorRole === "MASTER_ADMIN" || msg.authorRole === "GROUP_OWNER"
            ? "bg-amber-400/10 border-amber-400/30 text-amber-400"
            : msg.authorRole === "GROUP_ADMIN"
              ? "bg-blue-400/10 border-blue-400/30 text-blue-400"
              : "bg-card border-border text-foreground",
        )}
      >
        {msg.authorInitials}
      </div>

      <div className={cn("flex flex-col max-w-[75%]", isOwn && "items-end", "relative")}>
        {isOwn && !isEditing && (onEdit || onDelete) && (
          <div className="absolute right-0 top-0 -mt-6 flex items-center justify-end gap-1 opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 group-hover:pointer-events-auto z-10 bg-background/90 backdrop-blur-sm border border-border/50 rounded-sm p-0.5 shadow-sm">
            {onEdit && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-1.5 py-0.5 text-[9px] font-mono rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                {labels.editMessage}
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={handleDeleteMessage}
                className="px-1.5 py-0.5 text-[9px] font-mono rounded-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                {labels.deleteMessage}
              </button>
            )}
          </div>
        )}

        <div
          className={cn(
            "flex items-center gap-1.5 mb-0.5",
            isOwn && "flex-row-reverse",
          )}
        >
          <span
            className={cn(
              "text-[11px] font-mono font-bold",
              authorColor(msg.authorRole),
            )}
          >
            {msg.authorName}
          </span>
          {roleIcon(msg.authorRole)}
          <span className="text-[9px] font-mono text-muted-foreground/60">
            {formatMessageTime(msg.createdAt, locale)}
          </span>
          {msg.edited && (
            <span className="text-[8px] text-muted-foreground/40 italic">
              {labels.edited}
            </span>
          )}
        </div>

        <div
          className={cn(
            "px-3 py-2 rounded-sm text-xs font-mono leading-relaxed border relative whitespace-pre-wrap break-words",
            isOwn
              ? "bg-primary/10 border-primary/20 text-primary rounded-tr-none"
              : "bg-card border-border text-foreground rounded-tl-none",
          )}
        >
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={draft}
                maxLength={1000}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.preventDefault();
                    handleCancelEdit();
                    return;
                  }

                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void handleSaveEdit();
                  }
                }}
                rows={3}
                className={cn(
                  "w-full bg-transparent font-mono text-xs resize-none outline-none",
                  isOwn ? "text-primary" : "text-foreground",
                )}
              />
              <div className="flex justify-end gap-1">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-2 py-1 text-[10px] font-mono rounded-sm border border-border text-muted-foreground hover:text-foreground"
                >
                  {labels.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={!canSaveEdit || isSubmittingEdit}
                  className={cn(
                    "px-2 py-1 text-[10px] font-mono rounded-sm border",
                    canSaveEdit && !isSubmittingEdit
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground/50 cursor-not-allowed",
                  )}
                >
                  {labels.save}
                </button>
              </div>
            </div>
          ) : (
            <>
              {!!msg.content &&
                (msg.content.startsWith("**") ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: msg.content.replace(
                        /\*\*(.*?)\*\*/g,
                        "<strong>$1</strong>",
                      ),
                    }}
                  />
                ) : (
                  msg.content
                ))}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className={cn("space-y-1.5", !!msg.content && "mt-2")}>
                  {!msg.content && (
                    <p className="text-[10px] text-muted-foreground/70">
                      {labels.attachmentsOnly}
                    </p>
                  )}
                  {msg.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className={cn(
                        "flex items-center gap-1.5 px-2 py-1 rounded-sm border text-[10px]",
                        isOwn
                          ? "bg-primary/10 border-primary/25 text-primary"
                          : "bg-muted/20 border-border/70 text-foreground",
                      )}
                    >
                      <FileText className="h-3 w-3 shrink-0" />
                      <span className="truncate">{attachment.name}</span>
                      <span className="text-muted-foreground ml-auto shrink-0">
                        {(attachment.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="relative w-full">
          <div className="flex gap-1 mt-1.5 flex-wrap justify-end">
            {reactions.map((reaction) => (
              <button
                key={reaction.emoji}
                type="button"
                onClick={() => {
                  void handleReaction(reaction.emoji);
                }}
                className={cn(
                  "flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full border transition-colors",
                  reaction.reacted
                    ? "bg-primary/15 border-primary/30 text-primary"
                    : "bg-muted/30 border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary",
                )}
              >
                {reaction.emoji}{" "}
                <span className="font-mono font-bold">{reaction.count}</span>
              </button>
            ))}
            <button
              ref={reactionButtonRef}
              type="button"
              onClick={() => setReactionPickerOpen((prev) => !prev)}
              className={cn(
                "flex items-center justify-center w-5 h-5 rounded-full border transition-colors",
                reactionPickerOpen
                  ? "border-primary/30 text-primary bg-primary/10"
                  : "border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto",
              )}
              title={labels.addReaction}
            >
              <Smile className="h-3 w-3" />
            </button>
          </div>
          {reactionPickerOpen && (
            <div
              ref={reactionPickerRef}
              className="absolute top-full right-0 mt-1.5 p-2 border border-border rounded-sm bg-background z-20 shadow-xl w-[200px] space-y-1"
            >
              {channelViewEmojiGroups.map((group, groupIndex) => (
                <div key={`reaction-group-${groupIndex}`} className="grid grid-cols-8 gap-1">
                  {group.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        void handleEmojiReaction(emoji);
                      }}
                      className="h-6 w-6 rounded-sm hover:bg-muted/40 text-sm flex items-center justify-center transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
