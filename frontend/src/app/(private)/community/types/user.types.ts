export type OnlineStatus =
  | "online"
  | "away"
  | "offline"
  | "dnd";

export interface CommunityUser {
  id: string;
  name: string;
  username: string;
  initials: string;
  status: OnlineStatus;
  avatarUrl?: string;
}