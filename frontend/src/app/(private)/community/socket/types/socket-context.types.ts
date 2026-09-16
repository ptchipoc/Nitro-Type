import type React from "react";

import type {
  CommunityUser,
  CommunityMember,
  OnlineStatus,
} from "../../types";

import type {
  UiMessage,
} from "../../types/controller.types";

import type {
  Message as ApiMessage,
} from "@/features/community/types/community.type";

export interface SocketContext {
  resolvedCurrentUserId: string | undefined;

  selectedId: string;

  presenceByUserId: Record<
    string,
    OnlineStatus
  >;

  hydrateLiveMessage: (
    message: ApiMessage,
  ) => ApiMessage;

  setUserPresence: (
    userId: string,
    status: OnlineStatus,
  ) => void;

  upsertCommunityUser: (
    user: CommunityUser,
  ) => void;

  setChannelMessagesById: React.Dispatch<
    React.SetStateAction<
      Record<string, UiMessage[]>
    >
  >;

  setChannelMembersById: React.Dispatch<
    React.SetStateAction<
      Record<string, CommunityMember[]>
    >
  >;

  setDmMessagesById: React.Dispatch<
    React.SetStateAction<
      Record<string, UiMessage[]>
    >
  >;

  upsertDMPreview: (params: {
    conversationId: string;
    counterpartId: string;
    message: ApiMessage;
    conversation?: any;
  }) => void;

  getDMCounterpartId: (conversationId: string) => string | undefined;

  setPlatformChannels: React.Dispatch<
    React.SetStateAction<any[]>
  >;

  setPrivateGroups: React.Dispatch<
    React.SetStateAction<any[]>
  >;

  setSelectedId: React.Dispatch<
    React.SetStateAction<string>
  >;
}