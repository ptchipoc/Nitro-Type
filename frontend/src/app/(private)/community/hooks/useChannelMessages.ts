"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import type { CommunityUser, CommunityMember, OnlineStatus } from "../types";
import type { UiMessage } from "../types/controller.types";
import type { Message as ApiMessage } from "@/features/community/types/community.type";
import {
    fetchChannel,
    fetchChannelMessages,
    fetchSendChannelMessage,
    fetchEditMessage,
    fetchDeleteMessage,
    fetchAddReaction,
    fetchRemoveReaction,
} from "@/features/community/services/community.service";
import { ChannelType } from "@/features/community/types/enums.type";
import {
    mapApiChannelToCommunityChannel,
    mapApiMessageToCommunityMember,
    mapApiMessageToUiMessage,
    getInitials,
} from "../mappers/index.mappers";
import type { CommunityChannel } from "../types";
import type { MessagePayload } from "../types/controller.types";

interface UseChannelMessagesParams {
    selectedChannel: CommunityChannel | undefined;
    resolvedCurrentUserId: string | undefined;
    session: any;
    presenceByUserId: Record<string, OnlineStatus>;
    usersById: Map<string, CommunityUser>;
    removedMemberIdsByChannel: Record<string, string[]>;
    hydrateLiveMessage: (message: ApiMessage) => ApiMessage;
    setCommunityUsers: React.Dispatch<React.SetStateAction<CommunityUser[]>>;
    setPlatformChannels: React.Dispatch<React.SetStateAction<CommunityChannel[]>>;
    setPrivateGroups: React.Dispatch<React.SetStateAction<CommunityChannel[]>>;
    communitySocketConnected: boolean;
    emitCommunityEvent: (event: string, data: any) => void;
    channelMessagesById: Record<string, UiMessage[]>;
    setChannelMessagesById: React.Dispatch<React.SetStateAction<Record<string, UiMessage[]>>>;
    channelMembersById: Record<string, CommunityMember[]>;
    setChannelMembersById: React.Dispatch<React.SetStateAction<Record<string, CommunityMember[]>>>;
}

export function useChannelMessages({
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
}: UseChannelMessagesParams) {
    const [, setMessagesLoading] = useState(false);
    const [, setMessagesError] = useState<string | null>(null);

    // Load channel detail when selected
    useEffect(() => {
        const channelId = selectedChannel?.id;
        if (!channelId) return;

        let cancelled = false;

        async function loadChannelDetail(currentChannelId: string) {
            try {
                const detailedChannel = await fetchChannel(currentChannelId);
                if (cancelled) return;

                const mapped = mapApiChannelToCommunityChannel(
                    detailedChannel,
                    detailedChannel.type === ChannelType.PRIVATE,
                );

                setPlatformChannels((prev) =>
                    prev.map((channel) =>
                        channel.id === currentChannelId ? mapped : channel,
                    ),
                );
                setPrivateGroups((prev) =>
                    prev.map((channel) =>
                        channel.id === currentChannelId ? mapped : channel,
                    ),
                );
            } catch {
                // Silent fallback to already loaded list data.
            }
        }

        void loadChannelDetail(channelId);

        return () => {
            cancelled = true;
        };
    }, [selectedChannel?.id, setPlatformChannels, setPrivateGroups]);

    // Load channel messages when selected
    useEffect(() => {
        const channelId = selectedChannel?.id;
        if (!channelId) return;

        let cancelled = false;

        async function loadMessages(currentChannelId: string) {
            try {
                setMessagesLoading(true);
                setMessagesError(null);

                const data = await fetchChannelMessages(currentChannelId, 50);
                if (cancelled) return;

                const hydratedMessages = data.map((message) => hydrateLiveMessage(message));

                setChannelMessagesById((prev) => ({
                    ...prev,
                    [currentChannelId]: hydratedMessages.map(mapApiMessageToUiMessage),
                }));

                const members = Array.from(
                    new Map(
                        hydratedMessages.map((message) => {
                            const member = mapApiMessageToCommunityMember(message);
                            return [member.id, member] as const;
                        }),
                    ).values(),
                );

                if (members.length > 0) {
                    setChannelMembersById((prev) => {
                        const existing = prev[currentChannelId] ?? [];
                        const merged = Array.from(
                            new Map([...members, ...existing].map((m) => [m.id, m])).values()
                        );
                        return {
                            ...prev,
                            [currentChannelId]: merged,
                        };
                    });
                    setCommunityUsers((prev) => {
                        const known = new Set(prev.map((user) => user.id));
                        const additions = members
                            .filter(
                                (member) =>
                                    member.id !== resolvedCurrentUserId && !known.has(member.id),
                            )
                            .map((member) => ({
                                id: member.id,
                                name: member.name,
                                username: member.username,
                                initials: member.avatarInitials,
                                status: member.status,
                            }));

                        return additions.length > 0 ? [...prev, ...additions] : prev;
                    });
                }
            } catch {
                if (!cancelled) setMessagesError("Falha ao carregar mensagens");
            } finally {
                if (!cancelled) setMessagesLoading(false);
            }
        }

        void loadMessages(channelId);

        return () => {
            cancelled = true;
        };
    }, [hydrateLiveMessage, resolvedCurrentUserId, selectedChannel?.id, setCommunityUsers]);

    // Join/leave socket channel
    useEffect(() => {
        const channelId = selectedChannel?.id;
        if (!communitySocketConnected || !channelId) return;

        emitCommunityEvent("channel:join", { channelId });

        return () => {
            emitCommunityEvent("channel:leave", { channelId });
        };
    }, [communitySocketConnected, emitCommunityEvent, selectedChannel?.id]);

    // Computed: selected channel members
    const selectedChannelMembers = useMemo(() => {
        if (!selectedChannel) return [];

        const removedList = removedMemberIdsByChannel[selectedChannel.id] ?? [];

        const channelMembers = (channelMembersById[selectedChannel.id] ?? []).filter(
            (m) => !removedList.includes(m.id)
        );

        const visibleMessageMembers = (channelMessagesById[selectedChannel.id] ?? [])
            .map((message) => {
                const knownUser = usersById.get(message.authorId);
                const fallbackName =
                    knownUser?.name ||
                    message.authorName ||
                    `User ${message.authorId.slice(0, 6)}`;

                return {
                    id: message.authorId,
                    name: fallbackName,
                    username:
                        knownUser?.username ||
                        fallbackName.toLowerCase().replace(/\s+/g, "_") ||
                        message.authorId.slice(0, 10),
                    avatarInitials: knownUser?.initials || message.authorInitials,
                    avatarUrl: (message.authorAvatarUrl ?? knownUser?.avatarUrl) ?? undefined,
                    role: "GROUP_MEMBER" as const,
                    status: knownUser?.status ?? "offline",
                };
            })
            .filter((member) => Boolean(member.id) && !removedList.includes(member.id));

        const selfFallback: CommunityMember[] =
            channelMembers.length === 0 &&
                visibleMessageMembers.length === 0 &&
                resolvedCurrentUserId
                ? [
                    {
                        id: resolvedCurrentUserId,
                        name: session?.user?.name?.trim() || "You",
                        username: session?.user?.email?.split("@")[0]?.trim() || "you",
                        avatarInitials: getInitials(session?.user?.name?.trim() || "You"),
                        avatarUrl: (session?.user && 'avatarUrl' in session.user ? (session.user.avatarUrl as string) : undefined) || (session?.user?.image as string),
                        role: "GROUP_MEMBER",
                        status: "online",
                    },
                ]
                : [];

        let baseMembers = Array.from(
            new Map(
                [...selfFallback, ...visibleMessageMembers, ...channelMembers].map((member) => [
                    member.id,
                    member,
                ]),
            ).values(),
        );

        if (channelMembers.length > 0) {
            const activeIds = new Set(channelMembers.map((m) => m.id));
            baseMembers = baseMembers.filter((member) => member.id === resolvedCurrentUserId || activeIds.has(member.id));
        }

        return baseMembers.map((member) => {
            const resolvedStatus =
                member.id === resolvedCurrentUserId
                    ? (presenceByUserId[member.id] ?? "online")
                    : (presenceByUserId[member.id] ?? member.status);

            let resolvedRole = member.role;
            if (selectedChannel.isPrivate && selectedChannel.createdBy && member.id === selectedChannel.createdBy) {
                resolvedRole = "GROUP_OWNER";
            }

            return {
                ...member,
                role: resolvedRole,
                status: resolvedStatus,
            };
        });
    }, [
        channelMembersById,
        channelMessagesById,
        presenceByUserId,
        removedMemberIdsByChannel,
        resolvedCurrentUserId,
        selectedChannel,
        session?.user?.email,
        session?.user?.name,
        usersById,
    ]);

    const messages = selectedChannel ? (channelMessagesById[selectedChannel.id] ?? []) : [];

    const mentionCandidates = selectedChannelMembers
        .filter((member) => member.id !== resolvedCurrentUserId)
        .map((member) => ({
            id: member.id,
            name: member.name,
            username: member.username,
        }));

    // Channel message action handlers
    async function handleSendChannelMessage(payload: MessagePayload) {
        if (!selectedChannel) return;

        if (communitySocketConnected) {
            emitCommunityEvent("channel:join", { channelId: selectedChannel.id });
            emitCommunityEvent("channel:message", {
                channelId: selectedChannel.id,
                content: payload.content,
                mentions: payload.mentions,
                attachmentIds: payload.attachmentIds,
                replyToId: payload.replyToId,
            });
            return;
        }

        const created = await fetchSendChannelMessage(selectedChannel.id, {
            content: payload.content,
            mentions: payload.mentions,
            attachmentIds: payload.attachmentIds,
            replyToId: payload.replyToId,
        });

        const mapped = mapApiMessageToUiMessage(hydrateLiveMessage(created));

        setChannelMessagesById((prev) => ({
            ...prev,
            [selectedChannel.id]: [...(prev[selectedChannel.id] ?? []), mapped],
        }));
    }

    async function handleEditChannelMessage(messageId: string, content: string) {
        if (!selectedChannel) return;
        const channelId = selectedChannel.id;

        const updated = await fetchEditMessage(messageId, { content });
        const mapped = mapApiMessageToUiMessage(updated);

        setChannelMessagesById((prev) => {
            const current = prev[channelId] ?? [];
            return {
                ...prev,
                [channelId]: current.map((msg) => (msg.id === messageId ? mapped : msg)),
            };
        });
    }

    async function handleDeleteChannelMessage(messageId: string) {
        if (!selectedChannel) return;
        const channelId = selectedChannel.id;

        await fetchDeleteMessage(messageId);

        setChannelMessagesById((prev) => {
            const current = prev[channelId] ?? [];
            return {
                ...prev,
                [channelId]: current.filter((msg) => msg.id !== messageId),
            };
        });
    }

    async function handleAddChannelMessageReaction(messageId: string, emoji: string) {
        if (!selectedChannel) return;
        const channelId = selectedChannel.id;

        if (communitySocketConnected) {
            emitCommunityEvent("channel:join", { channelId });
            emitCommunityEvent("message:reaction:add", {
                messageId,
                emoji,
                type: "channel",
                channelId,
            });
            return;
        }

        const updated = await fetchAddReaction(messageId, { emoji });
        const mapped = mapApiMessageToUiMessage(updated);

        setChannelMessagesById((prev) => {
            const current = prev[channelId] ?? [];
            return {
                ...prev,
                [channelId]: current.map((msg) => {
                    if (msg.id !== messageId) return msg;

                    const reactionExists = (mapped.reactions ?? []).some(
                        (reaction) => reaction.emoji === emoji,
                    );

                    const reactionsWithTarget = reactionExists
                        ? mapped.reactions ?? []
                        : [...(mapped.reactions ?? []), { emoji, count: 1, reacted: false }];

                    return {
                        ...mapped,
                        reactions: reactionsWithTarget.map((reaction) =>
                            reaction.emoji === emoji
                                ? {
                                    ...reaction,
                                    reacted: true,
                                    count: Math.max(reaction.count, 1),
                                }
                                : reaction,
                        ),
                    };
                }),
            };
        });
    }

    async function handleRemoveChannelMessageReaction(messageId: string, emoji: string) {
        if (!selectedChannel) return;
        const channelId = selectedChannel.id;

        if (communitySocketConnected) {
            emitCommunityEvent("channel:join", { channelId });
            emitCommunityEvent("message:reaction:remove", {
                messageId,
                emoji,
                type: "channel",
                channelId,
            });
            return;
        }

        await fetchRemoveReaction(messageId, emoji);

        setChannelMessagesById((prev) => {
            const current = prev[channelId] ?? [];
            return {
                ...prev,
                [channelId]: current.map((msg) => {
                    if (msg.id !== messageId) return msg;

                    const nextReactions = (msg.reactions ?? [])
                        .map((reaction) => {
                            if (reaction.emoji !== emoji) return reaction;

                            return {
                                ...reaction,
                                reacted: false,
                                count: Math.max(reaction.count - 1, 0),
                            };
                        })
                        .filter((reaction) => reaction.count > 0);

                    return {
                        ...msg,
                        reactions: nextReactions,
                    };
                }),
            };
        });
    }

    return {
        channelMessagesById,
        setChannelMessagesById,
        channelMembersById,
        setChannelMembersById,
        selectedChannelMembers,
        messages,
        mentionCandidates,
        handleSendChannelMessage,
        handleEditChannelMessage,
        handleDeleteChannelMessage,
        handleAddChannelMessageReaction,
        handleRemoveChannelMessageReaction,
    };
}
