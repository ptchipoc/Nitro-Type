import {
  mapApiMessageToCommunityMember,
  mapApiMessageToUiMessage,
} from "../../mappers/index.mappers";

import {
  upsertUiMessageRecord,
} from "../../utils/message.utils";

import {
  buildSocketCommunityUser,
} from "../utils/socket-user.utils";

import type {
  SocketContext,
} from "../types/socket-context.types";

export function createChannelMessageHandlers(
  context: SocketContext,
) {
  const {
    hydrateLiveMessage,
    setChannelMessagesById,
    setChannelMembersById,
    presenceByUserId,
    upsertCommunityUser,
  } = context;

  const handleSocketChannelMessage =
    ({
      channelId,
      message,
    }: any) => {
      const hydratedMessage =
        hydrateLiveMessage(message);

      const mappedMessage =
        mapApiMessageToUiMessage(
          hydratedMessage,
        );

      setChannelMessagesById(
        (prev) =>
          upsertUiMessageRecord(
            prev,
            channelId,
            mappedMessage,
          ),
      );

      if (!hydratedMessage.author)
        return;

      const mappedMember =
        mapApiMessageToCommunityMember(
          hydratedMessage,
        );

      const nextMemberStatus =
        presenceByUserId[
          mappedMember.id
        ] ?? mappedMember.status;

      setChannelMembersById(
        (prev) => {
          const currentMembers =
            prev[channelId] ?? [];

          const existingIndex =
            currentMembers.findIndex(
              (member) =>
                member.id ===
                mappedMember.id,
            );

          if (existingIndex === -1) {
            return {
              ...prev,
              [channelId]: [
                ...currentMembers,
                {
                  ...mappedMember,
                  status:
                    nextMemberStatus,
                },
              ],
            };
          }

          return {
            ...prev,
            [channelId]:
              currentMembers.map(
                (
                  member,
                  index,
                ) =>
                  index ===
                  existingIndex
                    ? {
                        ...mappedMember,
                        ...member,
                        status:
                          presenceByUserId[
                            mappedMember.id
                          ] ??
                          member.status,
                      }
                    : member,
              ),
          };
        },
      );

      upsertCommunityUser(
        buildSocketCommunityUser(
          hydratedMessage.author,
          presenceByUserId[
            hydratedMessage.author.id
          ] ?? "offline",
        ),
      );
    };

  return {
    handleSocketChannelMessage,
  };
}