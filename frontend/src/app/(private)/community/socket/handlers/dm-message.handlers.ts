import {
  mapApiMessageToUiMessage,
} from "../../mappers/index.mappers";

import {
  normalizeSocketDMMessage,
  resolveDMCounterpartId,
} from "../../utils/dm.utils";

import {
  upsertUiMessageRecord,
} from "../../utils/message.utils";

import {
  buildSocketCommunityUser,
} from "../utils/socket-user.utils";

import type {
  SocketContext,
} from "../types/socket-context.types";

export function createDMMessageHandlers(
  context: SocketContext,
) {
  const {
    hydrateLiveMessage,
    resolvedCurrentUserId,
    setDmMessagesById,
    upsertCommunityUser,
    upsertDMPreview,
    presenceByUserId,
  } = context;

  const handleSocketDMMessage =
    (payload: any) => {
      const normalized =
        normalizeSocketDMMessage(
          payload.message,
        );

      if (!normalized?.message)
        return;

      const message =
        hydrateLiveMessage(
          normalized.message,
        );

      const conversationId =
        normalized.conversation?.id ??
        message.dmId;

      if (!conversationId)
        return;

      setDmMessagesById((prev) =>
        upsertUiMessageRecord(
          prev,
          conversationId,
          mapApiMessageToUiMessage(
            message,
          ),
        ),
      );

      let counterpartId =
        resolveDMCounterpartId(
          normalized.conversation,
          resolvedCurrentUserId,
          message.authorId,
          payload.participantId,
        );

      if (!counterpartId && conversationId) {
        counterpartId = context.getDMCounterpartId(conversationId);
      }

      if (
        message.author &&
        message.authorId !==
        resolvedCurrentUserId
      ) {
        upsertCommunityUser(
          buildSocketCommunityUser(
            message.author,
            presenceByUserId[
            message.author.id
            ] ?? "offline",
          ),
        );
      }

      if (!counterpartId) return;

      upsertDMPreview({
        conversationId,
        counterpartId,
        message,
        conversation:
          normalized.conversation,
      });
    };

  return {
    handleSocketDMMessage,
  };
}