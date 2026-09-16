import type {
  MemberRole,
  OnlineStatus,
} from "../types";

export function roleBadgeClass(
  role: MemberRole,
): string {
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

export function statusColor(
  status: OnlineStatus,
): string {
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