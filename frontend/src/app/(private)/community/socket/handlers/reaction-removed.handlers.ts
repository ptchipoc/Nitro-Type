import {
  patchUiMessageRecordById,
} from "../../utils/message.utils";

export function createReactionRemovedHandlers(
  context: any,
) {
  const {
    resolvedCurrentUserId,
    setChannelMessagesById,
    setDmMessagesById,
  } = context;

  const handleSocketReactionRemoved =
    (payload: any) => {
      const updateMessage = (
        message: any,
      ) => {
        const nextReactions =
          (
            message.reactions ?? []
          )
            .map((reaction: any) => {
              if (
                reaction.emoji !==
                payload.emoji
              ) {
                return reaction;
              }

              return {
                ...reaction,

                reacted:
                  payload.userId ===
                  resolvedCurrentUserId
                    ? false
                    : reaction.reacted,

                count: Math.max(
                  reaction.count - 1,
                  0,
                ),
              };
            })
            .filter(
              (reaction: any) =>
                reaction.count > 0,
            );

        return {
          ...message,
          reactions:
            nextReactions,
        };
      };

      setChannelMessagesById(
        (prev: any) =>
          patchUiMessageRecordById(
            prev,
            payload.messageId,
            updateMessage,
          ),
      );

      setDmMessagesById(
        (prev: any) =>
          patchUiMessageRecordById(
            prev,
            payload.messageId,
            updateMessage,
          ),
      );
    };

  return {
    handleSocketReactionRemoved,
  };
}