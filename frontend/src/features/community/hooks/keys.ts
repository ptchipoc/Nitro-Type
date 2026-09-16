export const communityKeys = {
  all: ["community"] as const,
  
  channels: () => [...communityKeys.all, "channels"] as const,
  channelList: () => [...communityKeys.channels(), "list"] as const,
  channelDetail: (id: string) =>
    [...communityKeys.channels(), "detail", id] as const,
  channelMessages: (id: string) =>
    [...communityKeys.channelDetail(id), "messages"] as const,
  invites: () => [...communityKeys.all, "invites"] as const,
  inviteList: () => [...communityKeys.invites(), "list"] as const,
  dms: () => [...communityKeys.all, "dms"] as const,
  dmList: () => [...communityKeys.dms(), "list"] as const,
  dmMessages: (id: string) => [...communityKeys.dms(), "messages", id] as const,
  presence: (userId: string) =>
    [...communityKeys.all, "presence", userId] as const,
};
