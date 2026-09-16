"use client";

import { Hash, Lock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChannelViewHeaderProps {
  isPrivate: boolean;
  channelName: string;
  channelDescription: string;
  isPlatformManaged: boolean;
  officialLabel: string;
  memberPanelOpen: boolean;
  onToggleMemberPanel: () => void;
}

export function ChannelViewHeader({
  isPrivate,
  channelName,
  channelDescription,
  isPlatformManaged,
  officialLabel,
  memberPanelOpen,
  onToggleMemberPanel,
}: ChannelViewHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
      <div className="flex items-center gap-2">
        {isPrivate ? (
          <Lock className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Hash className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="font-mono text-sm font-bold text-foreground">
          {channelName}
        </span>
        {isPlatformManaged && (
          <span className="text-[9px] font-mono px-1.5 py-0.5 border border-primary/30 text-primary bg-primary/10 rounded-[2px]">
            {officialLabel}
          </span>
        )}
        <span className="text-[10px] font-mono text-muted-foreground hidden sm:block">
          - {channelDescription}
        </span>
      </div>
      <button
        onClick={onToggleMemberPanel}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded-sm text-[10px] font-mono border transition-colors",
          memberPanelOpen
            ? "border-primary/30 text-primary bg-primary/10"
            : "border-border text-muted-foreground hover:text-foreground hover:border-border/80",
        )}
      >
        <Users className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
