"use client";

import type { ReactNode } from "react";
import { Hash, Lock, Megaphone, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "../utils/format-relative-time";
import type {
  CommunityChannel,
  DirectMessage,
  OnlineStatus,
} from "../types";

export function OnlineDot({ status }: { status: OnlineStatus }) {
  const colors = {
    online: "bg-green-500",
    away: "bg-amber-500",
    dnd: "bg-red-500",
    offline: "bg-muted-foreground/40",
  };

  return (
    <span
      className={cn(
        "w-2 h-2 rounded-full shrink-0 ring-1 ring-background",
        colors[status],
      )}
    />
  );
}

export function SectionLabel({
  label,
  action,
}: {
  label: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-2 mb-1 mt-5 first:mt-0">
      <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
        {label}
      </span>
      {action}
    </div>
  );
}

export function ChannelRow({
  channel,
  selected,
  onClick,
  onInvite,
  inviteLabel,
}: {
  channel: CommunityChannel;
  selected: boolean;
  onClick: () => void;
  onInvite?: () => void;
  inviteLabel?: string;
}) {
  const Icon = channel.isPlatformManaged
    ? channel.slug === "announcements"
      ? Megaphone
      : Hash
    : channel.isPrivate
      ? Lock
      : Hash;

  return (
    <div className="flex items-center group">
      <button
        onClick={onClick}
        className={cn(
          "flex-1 flex items-center gap-2 px-2 py-1.5 rounded-sm text-left transition-colors min-w-0",
          selected
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
        )}
      >
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span className="font-mono text-xs flex-1 truncate">
          {channel.name}
        </span>
        {!!channel.unreadCount && !onInvite && (
          <span className="text-[9px] font-mono font-bold bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
            {channel.unreadCount}
          </span>
        )}
      </button>
      {onInvite && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInvite();
          }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-sm hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all shrink-0 mr-1"
          title={inviteLabel}
        >
          <UserPlus className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

export function DMRow({
  dm,
  selected,
  onClick,
  locale,
}: {
  dm: DirectMessage;
  selected: boolean;
  onClick: () => void;
  locale: "pt" | "en" | "fr";
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-2 py-1.5 rounded-sm text-left transition-colors min-w-0",
        selected
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
      )}
    >
      <div className="relative shrink-0">
        <div className="w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-[9px] font-mono font-bold text-foreground overflow-hidden">
          {dm.initials}
        </div>
        <OnlineDot status={dm.status} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs truncate">{dm.name}</span>
          <span className="text-[9px] text-muted-foreground/60 shrink-0 ml-1">
            {formatRelativeTime(dm.lastAt, locale)}
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground/70 truncate">
          {dm.lastMessage}
        </p>
      </div>
      {!!dm.unreadCount && (
        <span className="text-[9px] font-mono font-bold bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 min-w-[18px] text-center shrink-0">
          {dm.unreadCount}
        </span>
      )}
    </button>
  );
}
