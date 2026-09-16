"use client";

import React, {
    useMemo,
    useState,
    useEffect,
    useCallback,
} from "react";

import type {
    DirectMessage,
    CommunityMember,
} from "../types";

import type {
    SidebarNotice,
    UiMessage,
} from "../types/controller.types";

import type {
    Message as ApiMessage,
} from "@/features/community/types/community.type";

import { fetchPresence } from "@/features/community/services/community.service";

import { useTranslation } from "@/lib/i18n";

import {
    useSession,
    signOut,
} from "next-auth/react";

import { fetchUserMe } from "@/lib/api/endpoints/user/user.service";

import { ApiRequestError } from "@/lib/api/errors";

import {
    communityPageLabelsByLocale,
    communityPageNoticesByLocale,
} from "../locates/community-page.labels";

import { isUuid } from "../mappers/index.mappers";

import { resolvePresenceStatus } from "../utils/presence.utils";

import { usePresenceHeartbeat } from "./usePresenceHeartbeat";
import { useCommunityUsers } from "./useCommunityUsers";
import { useInvites } from "./useInvites";
import { useDMConversations } from "./useDMConversations";

import { useSocketEvents } from "../socket/index";

import { useGroupManagement } from "./useGroupManagement";
import { useChannelMembers } from "./useChannelMembers";
import { useChannelMessages } from "./useChannelMessages";
import { useDMMessages } from "./useDMMessages";

export function useCommunityPageController() {
    const { locale } = useTranslation();

    const { data: session } = useSession();

    const currentUserId = session?.user?.id;

    const [
        fallbackCurrentUserId,
        setFallbackCurrentUserId,
    ] = useState<string | undefined>();

    const resolvedCurrentUserId =
        currentUserId ?? fallbackCurrentUserId;

    const labels =
        communityPageLabelsByLocale[locale];

    const notices =
        communityPageNoticesByLocale[locale];

    const [sidebarNotice, setSidebarNotice] =
        useState<SidebarNotice | null>(null);

    const [
        channelMessagesById,
        setChannelMessagesById,
    ] = useState<Record<string, UiMessage[]>>({});

    const [
        channelMembersById,
        setChannelMembersById,
    ] = useState<Record<string, CommunityMember[]>>({});

    const [
        dmMessagesById,
        setDmMessagesById,
    ] = useState<Record<string, UiMessage[]>>({});

    const [selectedId, setSelectedId] =
        useState<string>(() => {
            if (typeof window !== "undefined") {
                try {
                    return (
                        localStorage.getItem(
                            "community_selected_id",
                        ) || ""
                    );
                } catch {
                    return "";
                }
            }

            return "";
        });

    const [
        removedMemberIdsByChannel,
        setRemovedMemberIdsByChannel,
    ] = useState<Record<string, string[]>>({});

    const registerRemovedMember = useCallback(
        (
            channelId: string,
            memberId: string,
        ) => {
            setRemovedMemberIdsByChannel((prev) => {
                const current =
                    prev[channelId] ?? [];

                if (current.includes(memberId)) {
                    return prev;
                }

                return {
                    ...prev,
                    [channelId]: [
                        ...current,
                        memberId,
                    ],
                };
            });
        },
        [],
    );

    const [memberPanelOpen, setMemberPanelOpen] =
        useState(() => {
            if (typeof window !== "undefined") {
                return window.innerWidth >= 1024;
            }

            return true;
        });

    const [
        createGroupOpen,
        setCreateGroupOpen,
    ] = useState(false);

    const [
        editGroupOpen,
        setEditGroupOpen,
    ] = useState(false);

    const [
        mobileSidebarOpen,
        setMobileSidebarOpen,
    ] = useState(false);

    // Fetch fallback user ID
    useEffect(() => {
        if (currentUserId) return;

        let cancelled = false;

        void fetchUserMe()
            .then((me) => {
                if (!cancelled) {
                    setFallbackCurrentUserId(
                        (prev) => prev ?? me.id,
                    );
                }
            })
            .catch((error) => {
                if (
                    error instanceof ApiRequestError &&
                    (
                        error.status === 401 ||
                        error.status === 403 ||
                        error.status === 404 ||
                        error.status === 500
                    )
                ) {
                    signOut({
                        callbackUrl: "/login",
                    });
                }

                return undefined;
            });

        return () => {
            cancelled = true;
        };
    }, [currentUserId]);

    // Persist selected ID
    useEffect(() => {
        if (!selectedId) return;

        try {
            localStorage.setItem(
                "community_selected_id",
                selectedId,
            );
        } catch { }
    }, [selectedId]);

    // Sidebar notice auto-dismiss
    useEffect(() => {
        if (!sidebarNotice) return;

        const timeoutId =
            window.setTimeout(() => {
                setSidebarNotice(null);
            }, 5000);

        return () =>
            window.clearTimeout(timeoutId);
    }, [sidebarNotice]);

    // Presence heartbeat
    usePresenceHeartbeat();

    // Community users
    const {
        setCommunityUsers,
        usersById,
        presenceByUserId,
        setPresenceByUserId,
        upsertCommunityUser,
        setUserPresence,
        loadCommunityUsers,
        handleSearchUsers,
        selectableUsers,
    } = useCommunityUsers({
        resolvedCurrentUserId,
        notices,
        setSidebarNotice,
    });

    const resolveCurrentUserFn =
        useCallback(async () => {
            if (resolvedCurrentUserId) {
                return resolvedCurrentUserId;
            }

            try {
                const me =
                    await fetchUserMe();

                return me.id;
            } catch {
                return undefined;
            }
        }, [resolvedCurrentUserId]);

    // Group Management
    const {
        platformChannels,
        privateGroups,
        allChannels,
        channelsLoading,
        channelsError,
        channelNamesById,
        selectedChannel,
        loadChannels,
        bumpChannelMemberCount,
        handleCreateGroup,
        handleUpdateGroup,
        handleDeleteGroup,
        setPlatformChannels,
        setPrivateGroups,
    } = useGroupManagement({
        selectedId,
        setSelectedId,
        setCreateGroupOpen,
        setEditGroupOpen,
    });

    // Invites
    const {
        invitesLoading,
        sidebarInvites,
        loadInvites,
        handleAcceptInviteCode,
        handleRejectInviteCode,
    } = useInvites({
        channelNamesById,
        notices,
        loadChannels,
        setSidebarNotice,
        setSelectedId,
    });

    // DM Conversations
    const {
        setApiDMs,
        setExtraDMs,
        dms,
        loadDMConversations,
        upsertDMPreview,
        selectedDMMembers:
        getSelectedDMMembers,
        handleAddDirectFriends,
    } = useDMConversations({
        resolvedCurrentUserId,
        locale,
        usersById,
        presenceByUserId,
        session,
        notices,
        setCommunityUsers,
        setSidebarNotice,
        setSelectedId,
        setMobileSidebarOpen,
        resolveCurrentUserId:
            resolveCurrentUserFn,
    });

    const selectedDM = useMemo(
        () =>
            dms.find(
                (dm) => dm.id === selectedId,
            ),
        [dms, selectedId],
    );

    const selectedDMMembers = useMemo(
        () =>
            getSelectedDMMembers(
                selectedDM,
            ),
        [
            getSelectedDMMembers,
            selectedDM,
        ],
    );

    // Handle responsive member panel visibility
    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const handleResize = () => {
            const isLargeScreen =
                window.innerWidth >= 1024;

            setMemberPanelOpen((prev) => {
                if (
                    !isLargeScreen &&
                    prev &&
                    (
                        selectedChannel ||
                        selectedDM
                    )
                ) {
                    return false;
                }

                return prev;
            });
        };

        const mediaQuery =
            window.matchMedia(
                "(min-width: 1024px)",
            );

        mediaQuery.addEventListener(
            "change",
            handleResize,
        );

        return () =>
            mediaQuery.removeEventListener(
                "change",
                handleResize,
            );
    }, [selectedChannel, selectedDM]);

    // Initial load
    useEffect(() => {
        void loadInvites();
        void loadCommunityUsers();
        void loadDMConversations();
    }, [
        loadInvites,
        loadCommunityUsers,
        loadDMConversations,
    ]);

    // Poll invites every 10s
    useEffect(() => {
        const intervalId =
            window.setInterval(() => {
                void loadInvites();
            }, 10000);

        return () =>
            window.clearInterval(intervalId);
    }, [loadInvites]);

    // Hydrate live message
    const hydrateLiveMessage = useCallback(
        (
            message: ApiMessage,
        ): ApiMessage => {
            const knownAuthor =
                usersById.get(
                    message.authorId,
                );

            const isCurrentUser =
                message.authorId ===
                resolvedCurrentUserId;

            const fallbackUsername =
                message.author?.username ||
                (
                    isCurrentUser
                        ? session?.user?.email
                            ?.split("@")[0]
                            ?.trim()
                        : undefined
                ) ||
                knownAuthor?.username ||
                (
                    message.authorId
                        ? `user_${message.authorId.slice(0, 8)}`
                        : "user"
                );

            const fallbackName =
                message.author?.name?.trim() ||
                (
                    isCurrentUser
                        ? session?.user?.name?.trim()
                        : undefined
                ) ||
                knownAuthor?.name ||
                (
                    message.authorId
                        ? `User ${message.authorId.slice(0, 6)}`
                        : "User"
                );

            const fallbackEmail =
                message.author?.email?.trim() ||
                (
                    isCurrentUser
                        ? session?.user?.email?.trim()
                        : undefined
                ) ||
                `${fallbackUsername}@local`;

            const fallbackAvatarUrl =
                (message.author as any)?.avatarUrl ||
                (message.author as any)?.profile?.avatarUrl ||
                (
                    isCurrentUser &&
                        session?.user &&
                        "avatarUrl" in
                        session.user
                        ? (
                            session.user
                                .avatarUrl as string
                        )
                        : undefined
                ) ||
                (
                    isCurrentUser
                        ? session?.user?.image
                        : undefined
                ) ||
                knownAuthor?.avatarUrl ||
                undefined;

            return {
                ...message,
                author: {
                    id: message.authorId,
                    name: fallbackName,
                    username:
                        fallbackUsername,
                    email: fallbackEmail,
                    avatarUrl:
                        fallbackAvatarUrl,
                },
            };
        },
        [
            resolvedCurrentUserId,
            session?.user,
            usersById,
        ],
    );

    // Socket Setup
    const getDMCounterpartId =
        useCallback(
            (conversationId: string) => {
                const match = dms.find(
                    (d: any) =>
                        d.id ===
                        conversationId,
                );

                return match?.userId;
            },
            [dms],
        );

    const {
        communitySocketConnected,
        emitCommunityEvent,
    } = useSocketEvents({
        resolvedCurrentUserId,
        selectedId,
        presenceByUserId,
        hydrateLiveMessage,
        setUserPresence,
        upsertCommunityUser,
        setChannelMessagesById,
        setChannelMembersById,
        setDmMessagesById,
        upsertDMPreview,
        setPlatformChannels,
        setPrivateGroups,
        setSelectedId,
        getDMCounterpartId,
    });

    // Channel Messages
    const {
        selectedChannelMembers,
        messages,
        mentionCandidates,
        handleSendChannelMessage,
        handleEditChannelMessage,
        handleDeleteChannelMessage,
        handleAddChannelMessageReaction,
        handleRemoveChannelMessageReaction,
    } = useChannelMessages({
        selectedChannel,
        resolvedCurrentUserId,
        session,
        presenceByUserId,
        usersById,
        removedMemberIdsByChannel,
        hydrateLiveMessage,
        setCommunityUsers,
        setPlatformChannels,
        setPrivateGroups,
        communitySocketConnected,
        emitCommunityEvent,
        channelMessagesById,
        setChannelMessagesById,
        channelMembersById,
        setChannelMembersById,
    });

    // DMs
    const {
        dmMessages,
        handleSendDMMessage,
        handleEditDMMessage,
        handleDeleteDMMessage,
        handleAddDMMessageReaction,
        handleRemoveDMMessageReaction,
    } = useDMMessages({
        selectedDM,
        resolvedCurrentUserId,
        hydrateLiveMessage,
        communitySocketConnected,
        emitCommunityEvent,
        loadDMConversations,
        setApiDMs,
        setExtraDMs,
        setSelectedId,
        dmMessagesById,
        setDmMessagesById,
    });

    // Channel Members Hook
    const {
        handleInviteToGroup,
        handleUpdateChannelMemberRole,
        handleRemoveChannelMember,
        handleBanChannelMember,
    } = useChannelMembers({
        selectedChannel,
        channelMembersById,
        setChannelMembersById,
        resolveCurrentUserId:
            resolveCurrentUserFn,
        notices,
        setSidebarNotice,
        registerRemovedMember,
        bumpChannelMemberCount,
    });

    // Auto-select channel/DM
    useEffect(() => {
        if (channelsLoading) return;

        const selectedStillExists =
            allChannels.some(
                (channel) =>
                    channel.id === selectedId,
            ) ||
            dms.some(
                (dm) => dm.id === selectedId,
            );

        if (selectedStillExists) {
            return;
        }

        const isDmId =
            selectedId &&
            !selectedId.startsWith("ch-");

        if (isDmId && dms.length === 0) {
            return;
        }

        queueMicrotask(() => {
            setSelectedId(
                (currentSelectedId) => {
                    const currentStillExists =
                        allChannels.some(
                            (channel) =>
                                channel.id ===
                                currentSelectedId,
                        ) ||
                        dms.some(
                            (dm) =>
                                dm.id ===
                                currentSelectedId,
                        );

                    if (
                        currentStillExists
                    ) {
                        return currentSelectedId;
                    }

                    if (
                        allChannels.length > 0
                    ) {
                        return allChannels[0]
                            .id;
                    }

                    if (dms.length > 0) {
                        return dms[0].id;
                    }

                    return currentSelectedId;
                },
            );
        });
    }, [
        allChannels,
        dms,
        channelsLoading,
        selectedId,
    ]);

    // Refresh presence for selected DM user
    useEffect(() => {
        const userId =
            selectedDM?.userId;

        if (
            !userId ||
            !isUuid(userId)
        ) {
            return;
        }

        let cancelled = false;

        async function refreshPresence(
            targetUserId: string,
        ) {
            try {
                const presence =
                    await fetchPresence(
                        targetUserId,
                    );

                if (
                    cancelled ||
                    !presence
                ) {
                    return;
                }

                setPresenceByUserId(
                    (prev) => {
                        const nextStatus =
                            resolvePresenceStatus(
                                presence.status,
                                presence.lastSeenAt,
                            );

                        if (
                            prev[targetUserId] ===
                            nextStatus
                        ) {
                            return prev;
                        }

                        return {
                            ...prev,
                            [targetUserId]:
                                nextStatus,
                        };
                    },
                );
            } catch { }
        }

        void refreshPresence(userId);

        return () => {
            cancelled = true;
        };
    }, [
        selectedDM?.userId,
        setPresenceByUserId,
    ]);

    function handleSelect(id: string) {
        setSelectedId(id);
        setMobileSidebarOpen(false);
    }

    return {
        labels,
        currentUserId:
            resolvedCurrentUserId,
        channelsLoading,
        channelsError,
        platformChannels,
        privateGroups,
        dms,
        selectableUsers,
        sidebarInvites,
        invitesLoading,
        sidebarNotice,
        setSidebarNotice,
        selectedId,
        handleSelect,
        createGroupOpen,
        setCreateGroupOpen,
        memberPanelOpen,
        setMemberPanelOpen,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        selectedChannel,
        selectedDM,
        messages,
        dmMessages,
        mentionCandidates,
        selectedChannelMembers,
        selectedDMMembers,
        handleInviteToGroup,
        handleSearchUsers,
        handleAcceptInviteCode,
        handleRejectInviteCode,
        handleAddDirectFriends,
        handleSendChannelMessage,
        handleEditChannelMessage,
        handleDeleteChannelMessage,
        handleAddChannelMessageReaction,
        handleRemoveChannelMessageReaction,
        handleSendDMMessage,
        handleEditDMMessage,
        handleDeleteDMMessage,
        handleAddDMMessageReaction,
        handleRemoveDMMessageReaction,
        handleUpdateChannelMemberRole,
        handleRemoveChannelMember,
        handleBanChannelMember,
        handleCreateGroup,
        handleUpdateGroup,
        handleDeleteGroup,
        editGroupOpen,
        setEditGroupOpen,
    };
}