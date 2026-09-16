import { mapSocketPresenceStatus }
  from "../../utils/presence.utils";

import type {
  SocketContext,
} from "../types/socket-context.types";

export function createPresenceHandlers(
  context: SocketContext,
) {
  const {
    setUserPresence,
  } = context;

  const handleSocketPresence = (
    payload: any,
  ) => {
    if (!payload.userId) return;

    setUserPresence(
      payload.userId,
      mapSocketPresenceStatus(
        payload.status,
      ),
    );
  };

  return {
    handleSocketPresence,
  };
}