import type { ApiUser } from "@/lib/api/endpoints/user/user.type";
import type { CommunityUser } from "../types/user.types";
import { getInitials } from "./utils.mapper";

export function mapApiUserToCommunityUser(
    user: ApiUser,
): CommunityUser {
    const profileUsername = user.profile?.username?.trim();
    const emailUsername = user.email?.split("@")[0]?.trim();

    const displayName =
        user.name?.trim() ||
        profileUsername ||
        emailUsername ||
        `User ${user.id.slice(0, 8)}`;

    const username =
        profileUsername || emailUsername || user.id.slice(0, 10);

    return {
        id: user.id,
        name: displayName,
        username,
        initials: getInitials(displayName),
        avatarUrl: (user as any).avatarUrl || user.profile?.avatarUrl || (user as any).image || undefined,
        status: "offline",
    };
}