import type { OnlineStatus } from "../types";
import { UserPresenceStatus } from "@/features/community/types/community.type";
import { mapPresenceToOnlineStatus } from "../mappers/index.mappers";

export const PRESENCE_HEARTBEAT_MS = 15000;
export const PRESENCE_STALE_AFTER_MS = 45000;

export function resolvePresenceStatus(status: UserPresenceStatus, lastSeenAt: string): OnlineStatus {
    const mapped = mapPresenceToOnlineStatus(status);
    const lastSeenTime = new Date(lastSeenAt).getTime();
    if (Number.isNaN(lastSeenTime)) return mapped;

    const isStale = Date.now() - lastSeenTime > PRESENCE_STALE_AFTER_MS;
    return isStale ? "offline" : mapped;
}

export function mapSocketPresenceStatus(status?: string): OnlineStatus {
    switch ((status ?? "").toUpperCase()) {
        case "ONLINE":
            return "online";
        case "IDLE":
            return "away";
        case "DND":
            return "dnd";
        default:
            return "offline";
    }
}
