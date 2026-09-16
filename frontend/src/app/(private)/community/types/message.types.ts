import type { MemberRole } from "./member.types";
import { OnlineStatus } from "./user.types";

export interface CommunityMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  authorRole: MemberRole;
  content: string;
  createdAt: string;
  edited?: boolean;
  reactions?: {
    emoji: string;
    count: number;
    reacted: boolean;
  }[];
  mentions?: string[];
  authorAvatarUrl?: string;
}

export interface DirectMessage {
  id: string;
  userId: string;
  name: string;
  username: string;
  initials: string;
  avatarUrl?: string;
  status: OnlineStatus;
  lastMessage: string;
  lastAt: string;
  unreadCount?: number;
}