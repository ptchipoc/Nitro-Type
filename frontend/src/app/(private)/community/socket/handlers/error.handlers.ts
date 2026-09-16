import { signOut }
    from "next-auth/react";

import { toast }
    from "sonner";

import {
    isUnauthorizedError,
} from "../utils/socket-auth.utils";

import {
    isRemovedFromChannelError,
} from "../utils/socket-error.utils";

export function createErrorHandlers(
    context: any,
) {
    const {
        selectedId,
        setPrivateGroups,
        setPlatformChannels,
        setSelectedId,
    } = context;

    const handleSocketError = (
        payload: any,
    ) => {
        if (
            !payload ||
            (typeof payload === "object" &&
                Object.keys(payload)
                    .length === 0)
        ) {
            return;
        }

        console.warn(
            "[CommunitySocket] Error:",
            payload,
        );

        const message =
            typeof payload === "string"
                ? payload
                : payload?.message;

        if (!message) return;

        if (
            isUnauthorizedError(
                message,
            )
        ) {
            signOut({
                callbackUrl: "/login",
            });

            return;
        }

        toast.error(message);

        if (
            isRemovedFromChannelError(
                message,
            )
        ) {
            const channelToFilter =
                selectedId;

            setPrivateGroups(
                (prev: any[]) =>
                    prev.filter(
                        (ch) =>
                            ch.id !==
                            channelToFilter,
                    ),
            );

            setPlatformChannels(
                (prev: any[]) =>
                    prev.filter(
                        (ch) =>
                            ch.id !==
                            channelToFilter,
                    ),
            );

            setSelectedId(
                "announcements",
            );
        }
    };

    return {
        handleSocketError,
    };
}