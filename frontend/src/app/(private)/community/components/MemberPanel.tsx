"use client";

import { motion } from "framer-motion";
import {
  Users,
  Lock,
  Hash,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommunityMember, MemberRole } from "../types/member.types";
import { useEffect, useState } from "react";
import { ManageRoleModal } from "./ManageRoleModal";
import { useTranslation } from "@/lib/i18n";
import { memberPanelLabelsByLocale } from "../locates/member-panel.labels";
import { MemberPanelRow } from "./MemberPanelRow";
import { roleBadgeClass } from "./member-panel.utils";

interface Props {
  members: CommunityMember[];
  currentUserId?: string;
  currentUserRole: MemberRole;
  channelName: string;
  channelDescription: string;
  memberCount?: number;
  isPrivate: boolean;
  isPlatformManaged?: boolean;
  onRoleChange?: (memberId: string, newRole: MemberRole) => Promise<void> | void;
  onRemoveMember?: (memberId: string) => Promise<void> | void;
  onBanMember?: (memberId: string) => Promise<void> | void;
  onEditChannel?: () => void;
}

export function MemberPanel({
  members: initialMembers,
  currentUserId,
  currentUserRole,
  channelName,
  channelDescription,
  memberCount,
  isPrivate,
  isPlatformManaged = false,
  onRoleChange,
  onRemoveMember,
  onBanMember,
  onEditChannel,
}: Props) {
  const { locale } = useTranslation();
  const labels = memberPanelLabelsByLocale[locale];
  const [members, setMembers] = useState(initialMembers);
  const [managingMember, setManagingMember] = useState<CommunityMember | null>(
    null,
  );

  useEffect(() => {
    setMembers(initialMembers);
  }, [initialMembers]);

  const canManage =
    (currentUserRole === "GROUP_OWNER" ||
      currentUserRole === "GROUP_ADMIN" ||
      currentUserRole === "MASTER_ADMIN") &&
    (!isPlatformManaged || currentUserRole === "MASTER_ADMIN");

  const online = members.filter(
    (m) => m.status === "online" || m.status === "dnd",
  );
  const away = members.filter((m) => m.status === "away");
  const offline = members.filter((m) => m.status === "offline");
  const activeMemberCount = online.length + away.length;

  async function handleRoleChange(memberId: string, newRole: MemberRole) {
    await onRoleChange?.(memberId, newRole);
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)),
    );
  }

  async function handleRemove(memberId: string) {
    await onRemoveMember?.(memberId);
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  }

  async function handleBan(memberId: string) {
    await onBanMember?.(memberId);
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  }

  return (
    <>
      <motion.aside
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col h-full overflow-hidden"
      >
        {/* Channel info header */}
        <div className="px-3 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2 mb-1">
            {isPrivate ? (
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <Hash className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span className="font-mono text-xs font-bold text-foreground">
              {channelName}
            </span>
            {onEditChannel && canManage && !isPlatformManaged && (
              <button
                onClick={onEditChannel}
                className="p-1 rounded-sm hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors ml-auto"
                title={labels.editChannel}
              >
                <Settings className="h-3 w-3" />
              </button>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            {channelDescription}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] font-mono text-muted-foreground">
              {activeMemberCount} {labels.activeMembers}
            </span>
          </div>
        </div>

        {/* Member list */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-2 py-2">
          {online.length > 0 && (
            <>
              <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest px-2 mb-1 mt-2">
                {labels.online} — {online.length}
              </p>
              {online.map((m) => (
                <MemberPanelRow
                  key={m.id}
                  member={m}
                  canManage={canManage}
                  onManage={setManagingMember}
                />
              ))}
            </>
          )}
          {away.length > 0 && (
            <>
              <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest px-2 mb-1 mt-3">
                {labels.away} — {away.length}
              </p>
              {away.map((m) => (
                <MemberPanelRow
                  key={m.id}
                  member={m}
                  canManage={canManage}
                  onManage={setManagingMember}
                />
              ))}
            </>
          )}
          {offline.length > 0 && (
            <>
              <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest px-2 mb-1 mt-3">
                {labels.offline} — {offline.length}
              </p>
              {offline.map((m) => (
                <div key={m.id} className="opacity-50">
                  <MemberPanelRow
                    member={m}
                    canManage={canManage}
                    onManage={setManagingMember}
                  />
                </div>
              ))}
            </>
          )}
          {members.length === 0 && (
            <div className="text-center py-6">
              <Users className="h-5 w-5 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-[10px] font-mono text-muted-foreground/50">
                {labels.none}
              </p>
            </div>
          )}
        </div>

        {/* Role legend */}
        <div className="px-3 py-3 border-t border-border shrink-0 space-y-1">
          <p className="text-[8px] font-mono text-muted-foreground/50 uppercase tracking-widest mb-1.5">
            {labels.legend}
          </p>
          {(
            [
              ["GROUP_OWNER", labels.owner],
              ["GROUP_ADMIN", labels.admin],
              ["GROUP_MEMBER", labels.member],
              ["GROUP_VIEWER", labels.viewer],
            ] as [MemberRole, string][]
          ).map(([role, label]) => (
            <div key={role} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "text-[8px] font-mono px-1 py-0.5 border rounded-[2px]",
                  roleBadgeClass(role),
                )}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </motion.aside>

      <ManageRoleModal
        member={managingMember}
        currentUserId={currentUserId}
        currentUserRole={currentUserRole}
        open={!!managingMember}
        onClose={() => setManagingMember(null)}
        onRoleChange={handleRoleChange}
        onRemove={handleRemove}
        onBan={handleBan}
      />
    </>
  );
}
