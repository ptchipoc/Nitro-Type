import {
  ChannelType,
  MemberRole,
  MessageType,
  UserPresenceStatus,
} from "../types/community.type";

export interface CreateChannelInput {
  name: string;
  description?: string;
  type: ChannelType;
  isPlatformManaged?: boolean;
}

export interface UpdateChannelInput {
  name?: string;
  description?: string;
}

export interface AddMemberInput {
  userId: string;
}

export interface RemoveMemberInput {
  userId: string;
  notifyChannel?: boolean;
}

export interface BanMemberInput {
  userId: string;
  reason?: string;
  duration?: string;
}

export interface UpdateMemberRoleInput {
  userId: string;
  role: MemberRole;
}

export interface SendMessageInput {
  content: string;
  type?: MessageType;
  mentions?: string[];
  attachmentIds?: string[];
  replyToId?: string;
}

export interface SendDMInput {
  toUserId: string;
  content: string;
  replyToId?: string;
}

export interface AddReactionInput {
  emoji: string;
}

export interface EditMessageInput {
  content: string;
}

export interface InviteToChannelInput {
  invitedUserId: string;
}

export interface UpdatePresenceInput {
  status: UserPresenceStatus;
}
