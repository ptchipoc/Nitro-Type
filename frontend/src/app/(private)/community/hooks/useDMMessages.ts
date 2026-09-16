"use client";

import React, { useState, useEffect } from "react";
import type { UiMessage, MessagePayload } from "../types/controller.types";
import type { DirectMessage, OnlineStatus } from "../types";
import type { Message as ApiMessage } from "@/features/community/types/community.type";
import {
    fetchDMMessages,
    fetchSendDMMessage,
    fetchEditMessage,
    fetchDeleteMessage,
    fetchAddReaction,
    fetchRemoveReaction,
} from "@/features/community/services/community.service";
import { mapApiMessageToUiMessage } from "../mappers/index.mappers";
import { isUuid } from "../mappers/index.mappers";

interface UseDMMessagesParams {
    selectedDM: DirectMessage | undefined;
    resolvedCurrentUserId: string | undefined;
    hydrateLiveMessage: (message: ApiMessage) => ApiMessage;
    communitySocketConnected: boolean;
    emitCommunityEvent: (event: string, data: any) => void;
    loadDMConversations: () => Promise<DirectMessage[]>;
    setApiDMs: React.Dispatch<React.SetStateAction<DirectMessage[]>>;
    setExtraDMs: React.Dispatch<React.SetStateAction<DirectMessage[]>>;
    setSelectedId: React.Dispatch<React.SetStateAction<string>>;
    dmMessagesById: Record<string, UiMessage[]>;
    setDmMessagesById: React.Dispatch<React.SetStateAction<Record<string, UiMessage[]>>>;
}

export function useDMMessages({
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
}: UseDMMessagesParams) {

    // Load DM messages when selected
    useEffect(() => {
        const dmId = selectedDM?.id;
        if (!dmId || !isUuid(dmId)) return;

        let cancelled = false;

        async function loadDMMessages(currentDmId: string) {
            try {
                const data = await fetchDMMessages(currentDmId, 50);
                if (cancelled) return;

                const hydratedMessages = data.map((message) => hydrateLiveMessage(message));

                setDmMessagesById((prev) => ({
                    ...prev,
                    [currentDmId]: hydratedMessages.map(mapApiMessageToUiMessage),
                }));
            } catch {
                // Keep existing local messages on fetch failure.
            }
        }

        void loadDMMessages(dmId);

        return () => {
            cancelled = true;
        };
    }, [hydrateLiveMessage, selectedDM?.id]);

    // Join/leave socket DM room
    useEffect(() => {
        const participantId = selectedDM?.userId;
        if (!communitySocketConnected || !participantId || !isUuid(participantId)) {
            return;
        }

        emitCommunityEvent("dm:join", { participantId });

        return () => {
            emitCommunityEvent("dm:leave", { participantId });
        };
    }, [communitySocketConnected, emitCommunityEvent, selectedDM?.userId]);

    const dmMessages = selectedDM ? (dmMessagesById[selectedDM.id] ?? []) : [];

    function updateDMPreview(dmId: string, content: string) {
        const now = new Date().toISOString();

        setApiDMs((prev) =>
            prev.map((dm) =>
                dm.id === dmId ? { ...dm, lastMessage: content, lastAt: now } : dm,
            ),
        );
        setExtraDMs((prev) =>
            prev.map((dm) =>
                dm.id === dmId ? { ...dm, lastMessage: content, lastAt: now } : dm,
            ),
        );
    }

    async function handleSendDMMessage(payload: MessagePayload) {
        if (!selectedDM) return;

        const dmId = selectedDM.id;
        const toUserId = selectedDM.userId;

        if (!isUuid(toUserId)) {
            return;
        }

        if (communitySocketConnected) {
            emitCommunityEvent("dm:join", { participantId: toUserId });
            emitCommunityEvent("dm:message", {
                participantId: toUserId,
                content: payload.content,
                replyToId: payload.replyToId,
            });
            return;
        }

        const created = await fetchSendDMMessage(toUserId, {
            toUserId,
            content: payload.content,
            replyToId: payload.replyToId,
        });

        if (isUuid(dmId)) {
            const mapped = mapApiMessageToUiMessage(hydrateLiveMessage(created));
            setDmMessagesById((prev) => ({
                    ...prev,
                [dmId]: [...(prev[dmId] ?? []), mapped],
            }));
            updateDMPreview(dmId, payload.content);
        }

        const refreshedConversations = await loadDMConversations();
        const resolvedConversation = refreshedConversations.find(
            (conversation) => conversation.userId === toUserId,
        );

        if (resolvedConversation) {
            setExtraDMs((prev) =>
                prev.filter((dm) => dm.userId !== resolvedConversation.userId),
            );
            setSelectedId(resolvedConversation.id);
            updateDMPreview(resolvedConversation.id, payload.content);
        }
    }

    async function handleEditDMMessage(messageId: string, content: string) {
        if (!selectedDM) return;
        const dmId = selectedDM.id;

        const updated = await fetchEditMessage(messageId, { content });
        const mapped = mapApiMessageToUiMessage(updated);

        setDmMessagesById((prev) => {
            const current = prev[dmId] ?? [];
            return {
                ...prev,
                [dmId]: current.map((msg) => (msg.id === messageId ? mapped : msg)),
            };
        });
    }

    async function handleDeleteDMMessage(messageId: string) {
        if (!selectedDM) return;
        const dmId = selectedDM.id;

        await fetchDeleteMessage(messageId);

        setDmMessagesById((prev) => {
            const current = prev[dmId] ?? [];
            return {
                ...prev,
                [dmId]: current.filter((msg) => msg.id !== messageId),
            };
        });
    }

    async function handleAddDMMessageReaction(messageId: string, emoji: string) {
        if (!selectedDM) return;
        const dmId = selectedDM.id;

        if (communitySocketConnected && isUuid(selectedDM.userId)) {
            emitCommunityEvent("dm:join", { participantId: selectedDM.userId });
            emitCommunityEvent("message:reaction:add", {
                messageId,
                emoji,
                type: "dm",
                participantId: selectedDM.userId,
            });
            return;
        }

        const updated = await fetchAddReaction(messageId, { emoji });
        const mapped = mapApiMessageToUiMessage(updated);

        setDmMessagesById((prev) => {
            const current = prev[dmId] ?? [];
            return {
                ...prev,
                [dmId]: current.map((msg) => {
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

    async function handleRemoveDMMessageReaction(messageId: string, emoji: string) {
        if (!selectedDM) return;
        const dmId = selectedDM.id;

        if (communitySocketConnected && isUuid(selectedDM.userId)) {
            emitCommunityEvent("dm:join", { participantId: selectedDM.userId });
            emitCommunityEvent("message:reaction:remove", {
                messageId,
                emoji,
                type: "dm",
                participantId: selectedDM.userId,
            });
            return;
        }

        await fetchRemoveReaction(messageId, emoji);

        setDmMessagesById((prev) => {
            const current = prev[dmId] ?? [];
            return {
                ...prev,
                [dmId]: current.map((msg) => {
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
        dmMessagesById,
        setDmMessagesById,
        dmMessages,
        handleSendDMMessage,
        handleEditDMMessage,
        handleDeleteDMMessage,
        handleAddDMMessageReaction,
        handleRemoveDMMessageReaction,
    };
}
