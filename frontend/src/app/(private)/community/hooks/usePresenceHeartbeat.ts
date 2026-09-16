"use client";

import { useEffect } from "react";
import { fetchUpdatePresence } from "@/features/community/services/community.service";
import { UserPresenceStatus } from "@/features/community/types/enums.type";
import { PRESENCE_HEARTBEAT_MS } from "../utils/presence.utils";

export function usePresenceHeartbeat() {
    useEffect(() => {
        let cancelled = false;

        async function heartbeatOnline() {
            try {
                await fetchUpdatePresence({ status: UserPresenceStatus.ONLINE });
            } catch {
                if (cancelled) return;
            }
        }

        void heartbeatOnline();

        const heartbeatId = window.setInterval(() => {
            void heartbeatOnline();
        }, PRESENCE_HEARTBEAT_MS);

        return () => {
            cancelled = true;
            window.clearInterval(heartbeatId);
            void fetchUpdatePresence({ status: UserPresenceStatus.OFFLINE }).catch(() => {
                return undefined;
            });
        };
    }, []);
}
