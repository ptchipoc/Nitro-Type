"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { CommunityUser, OnlineStatus } from "../types";
import type { SidebarNotice } from "../types/controller.types";
import {
    fetchUserMe,
    fetchUsers,
    fetchUsersBySearch,
} from "@/lib/api/endpoints/user/user.service";
import {
    fetchChannels,
    fetchChannelMessages,
    fetchDMConversations,
} from "@/features/community/services/community.service";
import { ApiRequestError } from "@/lib/api/errors";
import { getInitials, mapApiUserToCommunityUser } from "../mappers/index.mappers";
import { normalizeParticipantUsername } from "../utils/dm.utils";
import { filterUsersByQuery } from "../utils/user.utils";

interface UseCommunityUsersParams {
    resolvedCurrentUserId: string | undefined;
    notices: { userDirectoryRestricted: string };
    setSidebarNotice: React.Dispatch<React.SetStateAction<SidebarNotice | null>>;
}

export function useCommunityUsers({
    resolvedCurrentUserId,
    notices,
    setSidebarNotice,
}: UseCommunityUsersParams) {
    const [communityUsers, setCommunityUsers] = useState<CommunityUser[]>([]);
    const communityUsersRef = useRef<CommunityUser[]>([]);
    const currentUserIdRef = useRef<string | undefined>(resolvedCurrentUserId);
    const [presenceByUserId, setPresenceByUserId] = useState<Record<string, OnlineStatus>>({});

    useEffect(() => {
        communityUsersRef.current = communityUsers;
    }, [communityUsers]);

    useEffect(() => {
        currentUserIdRef.current = resolvedCurrentUserId;
    }, [resolvedCurrentUserId]);

    const usersById = useMemo(
        () => new Map(communityUsers.map((user) => [user.id, user])),
        [communityUsers],
    );

    const upsertCommunityUser = useCallback(
        (user: CommunityUser) => {
            if (!user.id || user.id === resolvedCurrentUserId) return;

            setCommunityUsers((prev) => {
                const existingIndex = prev.findIndex((entry) => entry.id === user.id);

                if (existingIndex === -1) {
                    return [...prev, user];
                }

                const existing = prev[existingIndex];
                const nextUser = {
                    ...existing,
                    ...user,
                };

                if (
                    existing.name === nextUser.name &&
                    existing.username === nextUser.username &&
                    existing.initials === nextUser.initials &&
                    existing.status === nextUser.status &&
                    existing.avatarUrl === nextUser.avatarUrl
                ) {
                    return prev;
                }

                return prev.map((entry, index) =>
                    index === existingIndex ? nextUser : entry,
                );
            });
        },
        [resolvedCurrentUserId],
    );

    const setUserPresence = useCallback((userId: string, status: OnlineStatus) => {
        if (!userId) return;

        setPresenceByUserId((prev) =>
            prev[userId] === status ? prev : { ...prev, [userId]: status },
        );

        setCommunityUsers((prev) => {
            let changed = false;

            const nextUsers = prev.map((user) => {
                if (user.id !== userId || user.status === status) {
                    return user;
                }

                changed = true;
                return {
                    ...user,
                    status,
                };
            });

            return changed ? nextUsers : prev;
        });
    }, []);

    const loadCommunityUsers = useCallback(async () => {
        const discovered = new Map<string, CommunityUser>();
        let userDirectoryRestricted = false;

        function rememberUser(user: CommunityUser) {
            if (!user.id || user.id === resolvedCurrentUserId) return;
            if (discovered.has(user.id)) return;
            discovered.set(user.id, user);
        }

        try {
            const users = await fetchUsers();
            users.forEach((user) => {
                try {
                    rememberUser(mapApiUserToCommunityUser(user));
                } catch {
                    // Skip malformed user records without breaking full list loading.
                }
            });
        } catch (error) {
            if (error instanceof ApiRequestError && error.status === 403) {
                userDirectoryRestricted = true;
            }
        }

        try {
            const channels = await fetchChannels();
            const channelIds = [...channels.public, ...channels.private].map(
                (channel) => channel.id,
            );

            await Promise.all(
                channelIds.map(async (channelId) => {
                    try {
                        const messages = await fetchChannelMessages(channelId, 50);
                        messages.forEach((message) => {
                            if (!message.author) return;

                            const displayName =
                                message.author.name?.trim() ||
                                message.author.username ||
                                message.author.email ||
                                message.author.id;

                            rememberUser({
                                id: message.author.id,
                                name: displayName,
                                username:
                                    message.author.username ||
                                    message.author.email?.split("@")[0] ||
                                    message.author.id.slice(0, 10),
                                initials: getInitials(displayName),
                                avatarUrl: message.author.avatarUrl ?? undefined,
                                status: "offline",
                            });
                        });
                    } catch {
                        // Continue discovering users from remaining channels.
                    }
                }),
            );
        } catch {
            // Ignore; channel message discovery is best effort.
        }

        try {
            const conversations = await fetchDMConversations();
            conversations.forEach((conversation) => {
                const counterpartId =
                    conversation.participantId ??
                    (resolvedCurrentUserId &&
                        conversation.participantAId === resolvedCurrentUserId
                        ? conversation.participantBId
                        : conversation.participantAId);
                const participantName = conversation.participantName?.trim();

                const existing = discovered.get(counterpartId);
                rememberUser(
                    existing ?? {
                        id: counterpartId,
                        name: participantName || `User ${counterpartId.slice(0, 8)}`,
                        username:
                            (participantName
                                ? normalizeParticipantUsername(participantName)
                                : undefined) || counterpartId.slice(0, 10),
                        initials: getInitials(participantName || counterpartId),
                        avatarUrl: undefined,
                        status: "offline",
                    },
                );
            });
        } catch {
            // Ignore; DM discovery is best effort.
        }

        if (discovered.size === 0) {
            try {
                const me = await fetchUserMe();
                const mapped = mapApiUserToCommunityUser(me);
                rememberUser(mapped);
            } catch {
                // Keep empty directory if no fallback source is available.
            }
        }

        setCommunityUsers((prev) => {
            const merged = new Map(prev.map((user) => [user.id, user]));
            let changed = false;
            discovered.forEach((user, id) => {
                if (!merged.has(id)) {
                    merged.set(id, user);
                    changed = true;
                }
            });
            return changed ? Array.from(merged.values()) : prev;
        });

        if (discovered.size === 0 && userDirectoryRestricted) {
            setSidebarNotice({
                kind: "info",
                message: notices.userDirectoryRestricted,
            });
        }
    }, [notices.userDirectoryRestricted, resolvedCurrentUserId, setSidebarNotice]);

    const handleSearchUsers = useCallback(
        async (query: string) => {
            const normalizedQuery = query.trim();
            const currentId = currentUserIdRef.current;
            const currentSelectableUsers = communityUsersRef.current.filter(
                (user) => user.id !== currentId,
            );

            if (!normalizedQuery) return currentSelectableUsers;

            if (normalizedQuery.length < 3) {
                return filterUsersByQuery(currentSelectableUsers, normalizedQuery);
            }

            try {
                const users = await fetchUsersBySearch(normalizedQuery);
                return users
                    .map((user) => mapApiUserToCommunityUser(user))
                    .filter((user) => user.id !== currentId);
            } catch {
                return filterUsersByQuery(currentSelectableUsers, normalizedQuery);
            }
        },
        [],
    );

    const selectableUsers = useMemo(
        () => communityUsers.filter((user) => user.id !== resolvedCurrentUserId),
        [communityUsers, resolvedCurrentUserId],
    );

    return {
        communityUsers,
        setCommunityUsers,
        communityUsersRef,
        usersById,
        presenceByUserId,
        setPresenceByUserId,
        upsertCommunityUser,
        setUserPresence,
        loadCommunityUsers,
        handleSearchUsers,
        selectableUsers,
    };
}
