import { createPresenceHandlers }
  from "../handlers/presence.handlers";

import { createChannelMessageHandlers }
  from "../handlers/channel-message.handlers";

import { createDMMessageHandlers }
  from "../handlers/dm-message.handlers";

import { createReactionAddedHandlers }
  from "../handlers/reaction-added.handlers";

import { createReactionRemovedHandlers }
  from "../handlers/reaction-removed.handlers";

import { createMessageEditedHandlers }
  from "../handlers/message-edited.handlers";

import { createErrorHandlers }
  from "../handlers/error.handlers";

import { createConnectionHandlers }
  from "../handlers/connection.handlers";

export function createCommunitySocketHandlers(
  context: any,
) {
  return {
    ...createPresenceHandlers(
      context,
    ),

    ...createChannelMessageHandlers(
      context,
    ),

    ...createDMMessageHandlers(
      context,
    ),

    ...createReactionAddedHandlers(
      context,
    ),

    ...createReactionRemovedHandlers(
      context,
    ),

    ...createMessageEditedHandlers(
      context,
    ),

    ...createErrorHandlers(
      context,
    ),

    ...createConnectionHandlers(
      context,
    ),
  };
}