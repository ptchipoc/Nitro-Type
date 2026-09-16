import { ApiEnvelope } from "@/lib/api/api";
import {
  Channel,
  Message,
  ChannelMember,
  ChannelInvite,
  DMConversation,
  UserPresence,
} from "../types/community.type";

type DMMessagesData = {
  conversation: {
    id: string;
    participantId?: string;
    participantName: string;
  };
  messages: Message[];
};

export type ChannelResponse = ApiEnvelope<Channel>;
export type ChannelListResponse = ApiEnvelope<{
  private: Channel[];
  public: Channel[];
}>;
export type MessageResponse = ApiEnvelope<Message>;
export type MessageListResponse = ApiEnvelope<Message[]>;
export type MemberResponse = ApiEnvelope<ChannelMember>;
export type MemberListResponse = ApiEnvelope<ChannelMember[]>;
export type InviteResponse = ApiEnvelope<ChannelInvite>;
export type InviteListResponse = ApiEnvelope<ChannelInvite[]>;
export type DMConversationResponse = ApiEnvelope<DMConversation>;
export type DMConversationListResponse = ApiEnvelope<DMConversation[]>;
export type DMMessagesResponse = ApiEnvelope<Message[] | DMMessagesData>;
export type DMSendMessageResponse = ApiEnvelope<{
  conversation: DMConversation;
  message: Message;
}>;
export type PresenceResponse = ApiEnvelope<UserPresence>;
