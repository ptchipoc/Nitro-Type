"use client";

import { cn } from "@/lib/utils";
import { RoleIcon } from "./RoleIcon";
import { useTranslation } from "@/lib/i18n";
import { Settings } from "lucide-react";
import { statusColor } from "../utils/member-panel.utils";
import type { CommunityMember } from "../types/member.types";
import { memberPanelLabelsByLocale } from "../locates/member-panel.labels";

interface MemberPanelRowProps {
  member: CommunityMember;
  canManage: boolean;
  onManage: (member: CommunityMember) => void;
}

export function MemberPanelRow({
  member,
  canManage,
  onManage,
}: MemberPanelRowProps) {
  const { locale } = useTranslation();
  const labels = memberPanelLabelsByLocale[locale];
  const isProtected =
    member.role === "MASTER_ADMIN" || member.role === "GROUP_OWNER";
  const showManage = canManage && !isProtected;

  const roleBorder =
    member.role === "MASTER_ADMIN" || member.role === "GROUP_OWNER"
      ? "bg-amber-400/10 border-amber-400/30 text-amber-400"
      : member.role === "GROUP_ADMIN"
        ? "bg-blue-400/10 border-blue-400/30 text-blue-400"
        : "bg-card border-border text-foreground";

  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-muted/30 group transition-colors">
      <div className="relative shrink-0">
        <div
          className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold border shrink-0 overflow-hidden",
            roleBorder,
          )}
        >
          {member.avatarInitials}
        </div>
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-1 ring-background",
            statusColor(member.status),
          )}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[11px] text-foreground truncate">
            {member.name}
          </span>
          {<RoleIcon role={member.role} />}
        </div>
      </div>
      {showManage && (
        <button
          onClick={() => onManage(member)}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-sm hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
          title={labels.managePermissions}
        >
          <Settings className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
