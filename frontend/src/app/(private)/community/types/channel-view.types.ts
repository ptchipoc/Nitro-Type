import type { CommunityMessage } from ".";

export interface MentionCandidate {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
}

export interface MentionTarget {
  start: number;
  end: number;
  query: string;
}

export interface MessageAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

export type RenderMessage = CommunityMessage & {
  attachments?: MessageAttachment[];
};
