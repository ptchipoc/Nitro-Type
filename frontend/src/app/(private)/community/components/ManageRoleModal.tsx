"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Crown,
  ShieldCheck,
  Users,
  Eye,
  UserMinus,
  AlertTriangle,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommunityMember, MemberRole } from "../types/member.types";
import { useTranslation } from "@/lib/i18n";
import { manageRoleLabelsByLocale } from "../locates/manage-role.labels";

interface Props {
  member: CommunityMember | null;
  currentUserId?: string;
  currentUserRole: MemberRole;
  open: boolean;
  onClose: () => void;
  onRoleChange: (memberId: string, newRole: MemberRole) => Promise<void> | void;
  onRemove: (memberId: string) => Promise<void> | void;
  onBan?: (memberId: string) => Promise<void> | void;
}

function avatarColor(role: MemberRole) {
  if (role === "MASTER_ADMIN" || role === "GROUP_OWNER")
    return "bg-amber-400/10 border-amber-400/30 text-amber-400";
  if (role === "GROUP_ADMIN")
    return "bg-blue-400/10 border-blue-400/30 text-blue-400";
  return "bg-card border-border text-foreground";
}

export function ManageRoleModal({
  member,
  currentUserId,
  currentUserRole,
  open,
  onClose,
  onRoleChange,
  onRemove,
  onBan,
}: Props) {
  const { locale } = useTranslation();
  const labels = manageRoleLabelsByLocale[locale];
  const [selectedRole, setSelectedRole] = useState<MemberRole | null>(null);
  const [confirmAction, setConfirmAction] = useState<"remove" | "ban" | null>(
    null,
  );
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!member) return null;

  async function handleSave() {
    if (!selectedRole || !member) return;

    try {
      setIsSubmitting(true);
      await onRoleChange(member.id, selectedRole);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setSelectedRole(null);
        onClose();
      }, 800);
    } catch {
      // Error is handled upstream via toast
      setSelectedRole(null);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRemove() {
    if (!member) return;

    try {
      setIsSubmitting(true);
      await onRemove(member.id);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setConfirmAction(null);
        onClose();
      }, 700);
    } catch {
      setConfirmAction(null);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleBan() {
    if (!member || !onBan) return;

    try {
      setIsSubmitting(true);
      await onBan(member.id);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setConfirmAction(null);
        onClose();
      }, 700);
    } catch {
      setConfirmAction(null);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    setSelectedRole(null);
    setConfirmAction(null);
    setSaved(false);
    setIsSubmitting(false);
    onClose();
  }

  // Owner cannot change roles of other owners or admins above their level
  const isSelf = member.id === currentUserId;
  const isProtected =
    isSelf || member.role === "MASTER_ADMIN" || member.role === "GROUP_OWNER";
  const roles = [
    {
      role: "GROUP_ADMIN" as MemberRole,
      label: labels.admin,
      desc: labels.adminDesc,
      icon: <ShieldCheck className="h-4 w-4" />,
      color: "text-blue-400 border-blue-400/30 bg-blue-400/10",
    },
    {
      role: "GROUP_MEMBER" as MemberRole,
      label: labels.member,
      desc: labels.memberDesc,
      icon: <Users className="h-4 w-4" />,
      color: "text-foreground border-border bg-card",
    },
    {
      role: "GROUP_VIEWER" as MemberRole,
      label: labels.viewer,
      desc: labels.viewerDesc,
      icon: <Eye className="h-4 w-4" />,
      color: "text-muted-foreground border-border/60 bg-muted/20",
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none px-4"
          >
            <div className="glass border border-border rounded-sm w-full max-w-sm pointer-events-auto overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="font-mono text-sm font-bold text-foreground">
                  {labels.title}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-1 rounded-sm hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-5 py-4 space-y-5">
                {/* Member identity */}
                <div className="flex items-center gap-3 p-3 rounded-sm bg-muted/20 border border-border/50">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-xs font-mono font-bold border shrink-0 overflow-hidden",
                      avatarColor(member.role),
                    )}
                  >
                    {member.avatarInitials}
                  </div>
                  <div>
                    <p className="font-mono text-xs font-bold text-foreground">
                      {member.name}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span
                      className={cn(
                        "text-[9px] font-mono px-1.5 py-0.5 border rounded-[2px]",
                        member.role === "GROUP_OWNER" ||
                          member.role === "MASTER_ADMIN"
                          ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
                          : member.role === "GROUP_ADMIN"
                            ? "text-blue-400 bg-blue-400/10 border-blue-400/20"
                            : "text-muted-foreground bg-muted/30 border-border/50",
                      )}
                    >
                      {member.role === "MASTER_ADMIN"
                        ? labels.staff
                        : member.role === "GROUP_OWNER"
                          ? labels.owner
                          : member.role === "GROUP_ADMIN"
                            ? labels.admin
                            : member.role === "GROUP_MEMBER"
                              ? labels.member
                              : labels.viewer}
                    </span>
                  </div>
                </div>

                {isProtected ? (
                  <div className="flex items-start gap-2 p-3 rounded-sm bg-amber-400/5 border border-amber-400/20">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-mono text-amber-400/80 leading-relaxed">
                      {isSelf ? "You cannot modify your own role or remove yourself." : labels.protected}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Role selector */}
                    <div>
                      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">
                        {labels.changePermission}
                      </p>
                      <div className="space-y-2">
                        {roles.map((r) => {
                          const isCurrentRole = member.role === r.role;
                          const isSelected = selectedRole === r.role;
                          return (
                            <button
                              key={r.role}
                              onClick={() =>
                                setSelectedRole(isCurrentRole ? null : r.role)
                              }
                              disabled={isCurrentRole}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-sm border text-left transition-all",
                                isCurrentRole
                                  ? "opacity-50 cursor-default border-dashed"
                                  : isSelected
                                    ? "border-primary/50 bg-primary/5"
                                    : "hover:border-border hover:bg-muted/20",
                                !isSelected &&
                                !isCurrentRole &&
                                "border-border/50",
                              )}
                            >
                              <span
                                className={cn(
                                  "shrink-0",
                                  isSelected
                                    ? "text-primary"
                                    : r.color.split(" ")[0],
                                )}
                              >
                                {r.icon}
                              </span>
                              <div className="flex-1">
                                <p
                                  className={cn(
                                    "font-mono text-xs font-bold",
                                    isSelected
                                      ? "text-primary"
                                      : "text-foreground",
                                  )}
                                >
                                  {r.label}
                                  {isCurrentRole && (
                                    <span className="ml-2 font-normal text-muted-foreground">
                                      ({labels.current})
                                    </span>
                                  )}
                                </p>
                                <p className="text-[9px] text-muted-foreground mt-0.5">
                                  {r.desc}
                                </p>
                              </div>
                              {isSelected && (
                                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                              )}
                              {isCurrentRole && (
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {!confirmAction ? (
                        <>
                          <button
                            onClick={() => setConfirmAction("remove")}
                            disabled={isSubmitting}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-sm border border-red-500/30 text-red-400 text-[10px] font-mono hover:bg-red-500/10 transition-colors disabled:opacity-50"
                          >
                            <UserMinus className="h-3.5 w-3.5" />
                            {labels.remove}
                          </button>

                          {onBan && (
                            <button
                              onClick={() => setConfirmAction("ban")}
                              disabled={isSubmitting}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-sm border border-amber-500/30 text-amber-400 text-[10px] font-mono hover:bg-amber-500/10 transition-colors disabled:opacity-50"
                            >
                              <AlertTriangle className="h-3.5 w-3.5" />
                              {labels.ban}
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center gap-1.5 flex-1">
                          <span className="text-[10px] font-mono text-destructive">
                            {labels.sure}
                          </span>
                          <button
                            onClick={() => {
                              if (confirmAction === "remove") {
                                void handleRemove();
                                return;
                              }
                              void handleBan();
                            }}
                            disabled={isSubmitting}
                            className="px-2 py-1 rounded-sm bg-destructive/10 border border-destructive/30 text-destructive text-[10px] font-mono hover:bg-destructive/20 transition-colors"
                          >
                            {labels.yes}
                          </button>
                          <button
                            onClick={() => setConfirmAction(null)}
                            disabled={isSubmitting}
                            className="px-2 py-1 rounded-sm border border-border text-muted-foreground text-[10px] font-mono hover:text-foreground transition-colors"
                          >
                            {labels.no}
                          </button>
                        </div>
                      )}

                      <button
                        onClick={handleSave}
                        disabled={!selectedRole || saved || isSubmitting}
                        className={cn(
                          "ml-auto flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs font-mono font-bold transition-all",
                          saved
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : selectedRole
                              ? "bg-primary text-primary-foreground hover:opacity-90"
                              : "bg-muted/30 text-muted-foreground/40 cursor-not-allowed",
                        )}
                      >
                        {saved ? (
                          <>
                            <Check className="h-3.5 w-3.5" /> {labels.saved}
                          </>
                        ) : (
                          labels.save
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
