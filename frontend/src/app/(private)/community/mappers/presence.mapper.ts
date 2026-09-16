import {
    UserPresenceStatus,
} from "@/features/community/types/enums.type";
import type { UserPresence } from "@/features/community/types/community.type";

import type { OnlineStatus } from "../types/user.types";

export function mapPresenceToOnlineStatus(
    status: UserPresence["status"],
): OnlineStatus {
    if (status === UserPresenceStatus.ONLINE) return "online";
    if (status === UserPresenceStatus.IDLE) return "away";
    return "offline";
}