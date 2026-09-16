import type { Channel } from "@/features/community/types/community.type";
import type { CommunityChannel } from "../types/channel.types";

export function mapApiChannelToCommunityChannel(
  channel: Channel,
  isPrivate: boolean,
): CommunityChannel {
  return {
    id: channel.id,
    name: channel.name,
    slug: channel.slug,
    description: channel.description ?? "",
    isPrivate,
    isPlatformManaged: channel.isPlatformManaged,
    memberCount: channel.memberCount,
    unreadCount: 0,
    createdBy: channel.createdBy,
  };
}