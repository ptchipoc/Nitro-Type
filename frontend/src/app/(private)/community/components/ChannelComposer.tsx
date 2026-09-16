"use client";

import type {
  ChangeEvent,
  KeyboardEvent,
  RefObject,
} from "react";
import { FileText, Lock, Paperclip, Send, Smile, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { channelViewEmojiGroups } from "../locates/channel-view.labels";
import type {
  MentionCandidate,
  MentionTarget,
  MessageAttachment,
} from "../types/channel-view.types";

interface ChannelComposerProps {
  isViewOnly: boolean;
  readOnlyLabel: string;
  pendingAttachments: MessageAttachment[];
  onRemoveAttachment: (attachmentId: string) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  emojiButtonRef: RefObject<HTMLButtonElement | null>;
  emojiPickerRef: RefObject<HTMLDivElement | null>;
  onFilesSelected: (event: ChangeEvent<HTMLInputElement>) => void;
  onOpenFilePicker: () => void;
  mentionTarget: MentionTarget | null;
  mentionSuggestions: MentionCandidate[];
  effectiveMentionIndex: number;
  onInsertMention: (username: string) => void;
  input: string;
  onInputChange: (value: string, caretPosition: number) => void;
  onInputClick: (value: string, caretPosition: number) => void;
  onInputKeyUp: (value: string, caretPosition: number) => void;
  onInputKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  channelName: string;
  emojiPickerOpen: boolean;
  onToggleEmojiPicker: () => void;
  onPickEmoji: (emoji: string) => void;
  hasDraft: boolean;
  onSend: () => void | Promise<void>;
  attachFilesLabel: string;
  messagePlaceholderLabel: string;
  pickEmojiLabel: string;
}

export function ChannelComposer({
  isViewOnly,
  readOnlyLabel,
  pendingAttachments,
  onRemoveAttachment,
  fileInputRef,
  inputRef,
  emojiButtonRef,
  emojiPickerRef,
  onFilesSelected,
  onOpenFilePicker,
  mentionTarget,
  mentionSuggestions,
  effectiveMentionIndex,
  onInsertMention,
  input,
  onInputChange,
  onInputClick,
  onInputKeyUp,
  onInputKeyDown,
  channelName,
  emojiPickerOpen,
  onToggleEmojiPicker,
  onPickEmoji,
  hasDraft,
  onSend,
  attachFilesLabel,
  messagePlaceholderLabel,
  pickEmojiLabel,
}: ChannelComposerProps) {
  if (isViewOnly) return null;

  return (
    <div className="px-4 pb-4 shrink-0">
      <div className="border border-border rounded-sm bg-card/60 glass focus-within:border-primary/40 transition-colors">
        {pendingAttachments.length > 0 && (
          <div className="px-3 pt-2 pb-1.5 flex flex-wrap gap-1.5 border-b border-border/60">
            {pendingAttachments.map((attachment) => (
              <span
                key={attachment.id}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm border border-border/80 bg-muted/20 text-[10px] font-mono"
              >
                <FileText className="h-3 w-3" />
                <span className="max-w-[180px] truncate">{attachment.name}</span>
                <button
                  onClick={() => onRemoveAttachment(attachment.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2 px-3 py-2">

          <div className="flex-1 relative">
            {mentionTarget && mentionSuggestions.length > 0 && (
              <div className="absolute bottom-full left-0 right-0 mb-1.5 border border-border rounded-sm bg-background z-20 overflow-hidden">
                {mentionSuggestions.map((candidate, index) => (
                  <button
                    key={candidate.id}
                    onClick={() => onInsertMention(candidate.username)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 text-left text-[10px] font-mono transition-colors",
                      index === effectiveMentionIndex
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted/30 text-foreground",
                    )}
                  >
                    <span className="w-5 h-5 rounded-full bg-card border border-border flex items-center justify-center text-[9px]">
                      {candidate.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                    <span className="truncate">{candidate.name}</span>
                    <span className="text-muted-foreground ml-auto">
                      @{candidate.username}
                    </span>
                  </button>
                ))}
              </div>
            )}
            <textarea
              ref={inputRef}
              value={input}
              maxLength={1000}
              onChange={(event) =>
                onInputChange(
                  event.target.value,
                  event.target.selectionStart ?? event.target.value.length,
                )
              }
              onClick={(event) =>
                onInputClick(
                  event.currentTarget.value,
                  event.currentTarget.selectionStart ?? event.currentTarget.value.length,
                )
              }
              onKeyUp={(event) =>
                onInputKeyUp(
                  event.currentTarget.value,
                  event.currentTarget.selectionStart ?? event.currentTarget.value.length,
                )
              }
              onKeyDown={onInputKeyDown}
              placeholder={`${messagePlaceholderLabel} #${channelName}`}
              rows={1}
              className="w-full bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground/50 resize-none outline-none min-h-[20px] max-h-[120px] py-1 leading-relaxed"
              style={{ scrollbarWidth: "none" }}
            />
          </div>
          <div className="relative mb-1">
            {emojiPickerOpen && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-full right-0 mb-1.5 p-2 border border-border rounded-sm bg-background z-20 shadow-xl w-[200px] space-y-1"
              >
                {channelViewEmojiGroups.map((group, groupIndex) => (
                  <div key={`emoji-group-${groupIndex}`} className="grid grid-cols-8 gap-1">
                    {group.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => onPickEmoji(emoji)}
                        className="h-6 w-6 rounded-sm hover:bg-muted/40 text-sm flex items-center justify-center transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
            <button
              ref={emojiButtonRef}
              type="button"
              onClick={onToggleEmojiPicker}
              className={cn(
                "shrink-0 transition-colors",
                emojiPickerOpen
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary",
              )}
              title={pickEmojiLabel}
            >
              <Smile className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => {
              void onSend();
            }}
            disabled={!hasDraft}
            className={cn(
              "shrink-0 w-7 h-7 rounded-sm flex items-center justify-center transition-all mb-0.5",
              hasDraft
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-muted/30 text-muted-foreground/40 cursor-not-allowed",
            )}
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
