import type { Socket } from "socket.io-client";

import { COMMUNITY_SOCKET_EVENTS } from "./socket-events";

import type { CommunitySocketHandlers } from "./socket-handlers.types";

import { resolveSocketErrorMessage } from "./resolve-socket-error";

interface RegisterSocketListenersParams {
    socket: Socket;

    handlersRef: React.MutableRefObject<CommunitySocketHandlers>;

    setConnected: (value: boolean) => void;

    setError: (value: string | null) => void;
}

export function registerSocketListeners({
    socket,
    handlersRef,
    setConnected,
    setError,
}: RegisterSocketListenersParams) {
    socket.on(
        COMMUNITY_SOCKET_EVENTS.CONNECT,
        () => {
            setConnected(true);

            setError(null);

            handlersRef.current.onConnect?.(socket);
        },
    );

    socket.on(
        COMMUNITY_SOCKET_EVENTS.DISCONNECT,
        (reason: string) => {
            setConnected(false);

            handlersRef.current.onDisconnect?.(
                reason,
            );
        },
    );

    socket.on(
        COMMUNITY_SOCKET_EVENTS.CONNECT_ERROR,
        (error: Error) => {
            setConnected(false);

            setError(error.message);

            handlersRef.current.onConnectError?.(
                error.message,
            );
        },
    );

    socket.on(
        COMMUNITY_SOCKET_EVENTS.ERROR,
        (payload: unknown) => {
            const message =
                resolveSocketErrorMessage(payload);

            if (message) {
                setError(message);
            }

            handlersRef.current.onError?.(
                payload,
            );
        },
    );

    socket.on(
        COMMUNITY_SOCKET_EVENTS.CHANNEL_MESSAGE,
        (payload) => {
            handlersRef.current.onChannelMessage?.(
                payload,
            );
        },
    );

    socket.on(
        COMMUNITY_SOCKET_EVENTS.DM_MESSAGE,
        (payload) => {
            handlersRef.current.onDMMessage?.(
                payload,
            );
        },
    );

    socket.on(
        COMMUNITY_SOCKET_EVENTS.USER_ONLINE,
        (payload) => {
            handlersRef.current.onUserOnline?.(
                payload,
            );
        },
    );

    socket.on(
        COMMUNITY_SOCKET_EVENTS.USER_OFFLINE,
        (payload) => {
            handlersRef.current.onUserOffline?.(
                payload,
            );
        },
    );

    socket.on(
        COMMUNITY_SOCKET_EVENTS.PRESENCE_UPDATED,
        (payload) => {
            handlersRef.current.onPresenceUpdated?.(
                payload,
            );
        },
    );

    socket.on(
        COMMUNITY_SOCKET_EVENTS.PRESENCE_STATUS,
        (payload) => {
            handlersRef.current.onPresenceStatus?.(
                payload,
            );
        },
    );

    socket.on(
        COMMUNITY_SOCKET_EVENTS.REACTION_ADDED,
        (payload) => {
            handlersRef.current.onReactionAdded?.(
                payload,
            );
        },
    );

    socket.on(
        COMMUNITY_SOCKET_EVENTS.REACTION_REMOVED,
        (payload) => {
            handlersRef.current.onReactionRemoved?.(
                payload,
            );
        },
    );

    socket.on(
        COMMUNITY_SOCKET_EVENTS.MESSAGE_EDITED,
        (payload) => {
            handlersRef.current.onMessageEdited?.(
                payload,
            );
        },
    );
}