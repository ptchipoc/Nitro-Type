export const COMMUNITY_SOCKET_EVENTS = {
    CONNECT: "connect",
    DISCONNECT: "disconnect",
    CONNECT_ERROR: "connect_error",

    ERROR: "error",

    CHANNEL_MESSAGE: "channel:message",
    DM_MESSAGE: "dm:message",

    USER_ONLINE: "user:online",
    USER_OFFLINE: "user:offline",

    PRESENCE_UPDATED: "presence:updated",
    PRESENCE_STATUS: "presence:status",

    REACTION_ADDED: "message:reaction:added",
    REACTION_REMOVED: "message:reaction:removed",

    MESSAGE_EDITED: "message:edited",
} as const;