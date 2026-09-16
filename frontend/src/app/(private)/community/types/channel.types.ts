export interface CommunityChannel {
  id: string;
  name: string;
  slug: string;
  description: string;
  isPlatformManaged: boolean;
  memberCount?: number;
  isPrivate: boolean;
  unreadCount?: number;
  lastMessage?: string;
  createdBy?: string;
}