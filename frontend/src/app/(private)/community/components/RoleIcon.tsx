import { Crown, ShieldCheck, Eye } from "lucide-react";
import type { MemberRole } from "../types";

interface Props {
  role: MemberRole;
}

export function RoleIcon({ role }: Props) {
  switch (role) {
    case "MASTER_ADMIN":
    case "GROUP_OWNER":
      return (
        <Crown className="h-3 w-3 text-amber-400" />
      );

    case "GROUP_ADMIN":
      return (
        <ShieldCheck className="h-3 w-3 text-blue-400" />
      );

    case "GROUP_VIEWER":
      return (
        <Eye className="h-3 w-3 text-muted-foreground" />
      );

    default:
      return null;
  }
}