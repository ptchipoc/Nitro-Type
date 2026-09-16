import { 
  ChannelType, 
  InviteStatus, 
  MemberRole, 
  MessageType, 
  UserPresenceStatus 
} from "./enums.type";

export interface Channel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: ChannelType;
  isPlatformManaged: boolean;
  isArchived: boolean;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  reacted: boolean;
}

export interface AuthInfo {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

export interface Message {
  id: string;
  channelId?: string;
  dmId?: string;
  authorId: string;
  content: string;
  type: MessageType;
  reactions: MessageReaction[];
  mentions: string[];
  attachmentIds: string[];
  replyToId?: string;
  edited: boolean;
  author: AuthInfo;
  editedAt?: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ChannelMember {
  id: string;
  channelId: string;
  userId: string;
  role: MemberRole;
  joinedAt: string;
  bannedAt?: string;
}

export interface ChannelInvite {
  id: string;
  channelId: string;
  invitedUserId: string;
  code: string;
  channelName: string;
  status: InviteStatus;
  expiresAt: string;
  createdAt: string;
}

export interface DMConversation {
  id: string;
  participantAId: string;
  participantBId: string;
  participantId?: string;
  participantName?: string;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPresence {
  id: string;
  userId: string;
  status: UserPresenceStatus;
  lastSeenAt: string;
  createdAt: string;
  updatedAt?: string;
}
