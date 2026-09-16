import {
  mapApiMessageToUiMessage,
} from "../../mappers/index.mappers";

import {
  upsertUiMessageRecord,
} from "../../utils/message.utils";

export function createReactionAddedHandlers(
  context: any,
) {
  const {
    hydrateLiveMessage,
    resolvedCurrentUserId,
    setChannelMessagesById,
    setDmMessagesById,
  } = context;

  const handleSocketReactionAdded =
    (payload: any) => {
      const updatedMessage =
        hydrateLiveMessage(
          payload.reaction,
        );

      const mappedMessage =
        mapApiMessageToUiMessage(
          updatedMessage,
        );

      const nextMessage =
        payload.userId ===
        resolvedCurrentUserId
          ? {
              ...mappedMessage,
              reactions:
                (
                  mappedMessage.reactions ??
                  []
                ).map((reaction) =>
                  reaction.emoji ===
                  payload.emoji
                    ? {
                        ...reaction,
                        reacted: true,
                        count: Math.max(
                          reaction.count,
                          1,
                        ),
                      }
                    : reaction,
                ),
            }
          : mappedMessage;

      if (updatedMessage.channelId) {
        setChannelMessagesById(
          (prev: any) =>
            upsertUiMessageRecord(
              prev,
              updatedMessage.channelId,
              nextMessage,
            ),
        );
      }

      if (updatedMessage.dmId) {
        setDmMessagesById(
          (prev: any) =>
            upsertUiMessageRecord(
              prev,
              updatedMessage.dmId,
              nextMessage,
            ),
        );
      }
    };

  return {
    handleSocketReactionAdded,
  };
}