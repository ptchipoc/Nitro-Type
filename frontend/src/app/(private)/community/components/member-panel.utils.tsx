import { Crown, ShieldCheck, Eye } from "lucide-react";
import type { MemberRole } from "../types/member.types";

export function roleIcon(role: MemberRole) {
  switch (role) {
    case "MASTER_ADMIN":
    case "GROUP_OWNER":
      return <Crown className="h-3 w-3 text-amber-400" />;
    case "GROUP_ADMIN":
      return <ShieldCheck className="h-3 w-3 text-blue-400" />;
    case "GROUP_VIEWER":
      return <Eye className="h-3 w-3 text-muted-foreground" />;
    default:
      return null;
  }
}

export function roleBadgeClass(role: MemberRole): string {
  switch (role) {
    case "MASTER_ADMIN":
    case "GROUP_OWNER":
      return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    case "GROUP_ADMIN":
      return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    case "GROUP_VIEWER":
      return "text-muted-foreground bg-muted/30 border-border/50";
    default:
      return "text-muted-foreground bg-muted/20 border-border/40";
  }
}

export function statusColor(status: string): string {
  switch (status) {
    case "online":
      return "bg-green-500";
    case "away":
      return "bg-amber-500";
    case "dnd":
      return "bg-red-500";
    default:
      return "bg-muted-foreground/40";
  }
}
