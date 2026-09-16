import type { OnlineStatus } from "./user.types";

export type MemberRole =
  | "MASTER_ADMIN"
  | "GROUP_OWNER"
  | "GROUP_ADMIN"
  | "GROUP_MEMBER"
  | "GROUP_VIEWER";

export interface CommunityMember {
  id: string;
  name: string;
  username: string;
  avatarInitials: string;
  avatarUrl?: string;
  role: MemberRole;
  status: OnlineStatus;
  badge?: string;
}