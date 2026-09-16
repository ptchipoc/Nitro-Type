import { getInitials } from "../../mappers/index.mappers";

export function buildSocketCommunityUser(
    author: any,
    status: any,
) {
    const displayName =
        author.name?.trim() ||
        author.username ||
        author.email?.split("@")[0] ||
        author.id;

    return {
        id: author.id,
        name: displayName,

        username:
            author.username ||
            author.email?.split("@")[0] ||
            author.id.slice(0, 10),

        initials:
            getInitials(displayName),

        status,
    };
}