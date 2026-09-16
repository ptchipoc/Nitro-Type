"use client";

import type { CommunityMessage, MemberRole } from "../types/message.types";
import { useMemo, useState, useRef, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { useSession } from "next-auth/react";
import { channelViewLabelsByLocale } from "../locates/channel-view.labels";
import {
  type MentionCandidate,
  type MentionTarget,
  type MessageAttachment,
  type RenderMessage,
} from "../types/channel-view.types";
import { ChannelViewHeader } from "./ChannelViewHeader";
import { ChannelMessageFeed } from "./ChannelMessageFeed";
import { ChannelComposer } from "./ChannelComposer";

interface Props {
  channelId: string;
  channelName: string;
  channelDescription: string;
  // memberCount: number;
  isPrivate: boolean;
  isPlatformManaged: boolean;
  messages: CommunityMessage[];
  currentUserRole: MemberRole;
  onToggleMemberPanel: () => void;
  memberPanelOpen: boolean;
  forceReadOnly?: boolean;
  mentionCandidates?: MentionCandidate[];
  onSendMessage?: (payload: {
    content: string;
    mentions?: string[];
    attachmentIds?: string[];
    replyToId?: string;
  }) => Promise<void> | void;
  onEditMessage?: (messageId: string, content: string) => Promise<void> | void;
  onDeleteMessage?: (messageId: string) => Promise<void> | void;
  onAddReaction?: (messageId: string, emoji: string) => Promise<void> | void;
  onRemoveReaction?: (messageId: string, emoji: string) => Promise<void> | void;
}

export function ChannelView({
  channelId,
  channelName,
  channelDescription,
  // memberCount,
  isPrivate,
  isPlatformManaged,
  messages,
  currentUserRole,
  onToggleMemberPanel,
  memberPanelOpen,
  forceReadOnly = false,
  mentionCandidates = [],
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onAddReaction,
  onRemoveReaction,
}: Props) {
  const { locale } = useTranslation();
  const { data: session } = useSession();
  const labels = channelViewLabelsByLocale[locale];
  const [input, setInput] = useState("");
  const [pendingMessages] = useState<Record<string, RenderMessage[]>>({});
  const [pendingAttachments, setPendingAttachments] = useState<
    MessageAttachment[]
  >([]);
  const [mentionTarget, setMentionTarget] = useState<MentionTarget | null>(null);
  const [activeMentionIndex, setActiveMentionIndex] = useState(0);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const attachmentCounterRef = useRef(0);
  const currentUserId = session?.user?.id ?? "u-001";

  const canSend = currentUserRole !== "GROUP_VIEWER";
  const isViewOnly = forceReadOnly || !canSend;
  const localMessages = useMemo(
    () => [...messages, ...(pendingMessages[channelId] ?? [])],
    [messages, pendingMessages, channelId],
  );

  const mentionSuggestions = useMemo(() => {
    if (!mentionTarget) return [];
    const query = mentionTarget.query.toLowerCase();
    return mentionCandidates
      .filter(
        (candidate) =>
          candidate.username.toLowerCase().includes(query) ||
          candidate.name.toLowerCase().includes(query),
      )
      .slice(0, 6);
  }, [mentionCandidates, mentionTarget]);

  const prevLengthRef = useRef(localMessages.length);
  const lastChannelIdRef = useRef(channelId);
  const feedContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isNewChannel = channelId !== lastChannelIdRef.current;
    const isNewMessage = localMessages.length > prevLengthRef.current;

    if (isNewChannel) {
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "instant",
          block: "end",
        });
      });
    } else if (isNewMessage) {
      // Only auto-scroll if user is already near the bottom
      const container = feedContainerRef.current ?? bottomRef.current?.parentElement;
      if (container) {
        const distanceFromBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight;
        if (distanceFromBottom < 200) {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      }
    }

    lastChannelIdRef.current = channelId;
    prevLengthRef.current = localMessages.length;
  }, [localMessages.length, channelId]);

  useEffect(() => {
    if (!emojiPickerOpen) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (emojiPickerRef.current?.contains(target)) return;
      if (emojiButtonRef.current?.contains(target)) return;
      setEmojiPickerOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [emojiPickerOpen]);

  const effectiveMentionIndex =
    mentionSuggestions.length > 0
      ? Math.min(activeMentionIndex, mentionSuggestions.length - 1)
      : 0;

  function refreshMentionState(value: string, caretPosition: number) {
    const textUntilCaret = value.slice(0, caretPosition);
    const mentionMatch = textUntilCaret.match(/(^|\s)@([a-zA-Z0-9_]{0,24})$/);

    if (!mentionMatch) {
      setMentionTarget(null);
      setActiveMentionIndex(0);
      return;
    }

    const query = mentionMatch[2];
    const start = caretPosition - query.length - 1;
    setMentionTarget({
      start,
      end: caretPosition,
      query,
    });
  }

  function insertMention(username: string) {
    if (!mentionTarget) return;

    const before = input.slice(0, mentionTarget.start);
    const after = input.slice(mentionTarget.end);
    const mentionText = `@${username} `;
    const nextValue = `${before}${mentionText}${after}`;
    const cursorPosition = before.length + mentionText.length;

    setInput(nextValue);
    setMentionTarget(null);
    setActiveMentionIndex(0);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(cursorPosition, cursorPosition);
    });
  }

  function insertTextAtCursor(text: string) {
    const inputElement = inputRef.current;
    const start = inputElement?.selectionStart ?? input.length;
    const end = inputElement?.selectionEnd ?? input.length;
    const nextValue = `${input.slice(0, start)}${text}${input.slice(end)}`;
    const nextCursor = start + text.length;

    setInput(nextValue);
    refreshMentionState(nextValue, nextCursor);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(nextCursor, nextCursor);
    });
  }

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const mappedFiles = files.map((file, index) => ({
      id: `${file.name}-${file.size}-${attachmentCounterRef.current + index + 1}`,
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    attachmentCounterRef.current += files.length;
    setPendingAttachments((prev) => [...prev, ...mappedFiles]);
    e.target.value = "";
  }

  async function handleSend() {
    if (isViewOnly) return;
    const text = input.trim();
    if (!text && pendingAttachments.length === 0) return;

    const mentionUsernames = Array.from(
      new Set(
        Array.from(text.matchAll(/@([a-zA-Z0-9_]+)/g)).map((match) => match[1]),
      ),
    );

    const mentionIds = mentionCandidates
      .filter((candidate) => mentionUsernames.includes(candidate.username))
      .map((candidate) => candidate.id);

    await onSendMessage?.({
      content: text,
      mentions: mentionIds.length > 0 ? mentionIds : undefined,
      attachmentIds: undefined,
    });

    setInput("");
    setPendingAttachments([]);
    setMentionTarget(null);
    setActiveMentionIndex(0);
    setEmojiPickerOpen(false);
    inputRef.current?.focus();

    // Auto-scroll to the bottom when the user sends a new message explicitly.
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (mentionTarget && mentionSuggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveMentionIndex((prev) =>
          prev + 1 >= mentionSuggestions.length ? 0 : prev + 1,
        );
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveMentionIndex((prev) =>
          prev - 1 < 0 ? mentionSuggestions.length - 1 : prev - 1,
        );
        return;
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        insertMention(mentionSuggestions[effectiveMentionIndex].username);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setMentionTarget(null);
        setActiveMentionIndex(0);
        return;
      }
    }

    if (e.key === "Escape" && emojiPickerOpen) {
      e.preventDefault();
      setEmojiPickerOpen(false);
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const hasDraft = input.trim().length > 0 || pendingAttachments.length > 0;
  const readOnlyLabel = forceReadOnly ? labels.updatesOnly : labels.readOnly;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <ChannelViewHeader
        isPrivate={isPrivate}
        channelName={channelName}
        channelDescription={channelDescription}
        isPlatformManaged={isPlatformManaged}
        officialLabel={labels.official}
        memberPanelOpen={memberPanelOpen}
        onToggleMemberPanel={onToggleMemberPanel}
      />

      <ChannelMessageFeed
        isPrivate={isPrivate}
        channelName={channelName}
        currentUserId={currentUserId}
        localMessages={localMessages}
        emptyLabel={labels.empty}
        emptyHintLabel={labels.emptyHint}
        bottomRef={bottomRef}
        onEditMessage={onEditMessage}
        onDeleteMessage={onDeleteMessage}
        onAddReaction={onAddReaction}
        onRemoveReaction={onRemoveReaction}
      />

      <ChannelComposer
        isViewOnly={isViewOnly}
        readOnlyLabel={readOnlyLabel}
        pendingAttachments={pendingAttachments}
        onRemoveAttachment={(attachmentId) =>
          setPendingAttachments((prev) =>
            prev.filter((attachment) => attachment.id !== attachmentId),
          )
        }
        fileInputRef={fileInputRef}
        inputRef={inputRef}
        emojiButtonRef={emojiButtonRef}
        emojiPickerRef={emojiPickerRef}
        onFilesSelected={handleFilesSelected}
        onOpenFilePicker={() => fileInputRef.current?.click()}
        mentionTarget={mentionTarget}
        mentionSuggestions={mentionSuggestions}
        effectiveMentionIndex={effectiveMentionIndex}
        onInsertMention={insertMention}
        input={input}
        onInputChange={(value, caretPosition) => {
          setInput(value);
          refreshMentionState(value, caretPosition);
        }}
        onInputClick={(value, caretPosition) => {
          refreshMentionState(value, caretPosition);
        }}
        onInputKeyUp={(value, caretPosition) => {
          refreshMentionState(value, caretPosition);
        }}
        onInputKeyDown={handleKeyDown}
        channelName={channelName}
        emojiPickerOpen={emojiPickerOpen}
        onToggleEmojiPicker={() => setEmojiPickerOpen((prev) => !prev)}
        onPickEmoji={(emoji) => {
          insertTextAtCursor(emoji);
          setEmojiPickerOpen(false);
        }}
        hasDraft={hasDraft}
        onSend={handleSend}
        attachFilesLabel={labels.attachFiles}
        messagePlaceholderLabel={labels.messagePlaceholder}
        pickEmojiLabel={labels.pickEmoji}
      />
    </div>
  );
}
