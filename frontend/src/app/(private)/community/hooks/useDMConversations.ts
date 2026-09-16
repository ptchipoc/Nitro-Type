"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import type { CommunityUser, DirectMessage, CommunityMember, OnlineStatus } from "../types";
import type { SidebarNotice } from "../types/controller.types";
import type { Message as ApiMessage, DMConversation as ApiDMConversation } from "@/features/community/types/community.type";
import {
    fetchDMConversations,
    fetchCreateOrOpenDM,
} from "@/features/community/services/community.service";
import {
    mapConversationToDM,
    getInitials,
    isUuid,
} from "../mappers/index.mappers";
import { normalizeParticipantUsername, upsertDMCollection } from "../utils/dm.utils";

interface UseDMConversationsParams {
    resolvedCurrentUserId: string | undefined;
    locale: string;
    usersById: Map<string, CommunityUser>;
    presenceByUserId: Record<string, OnlineStatus>;
    session: any;
    notices: {
        dmSelfError: string;
        dmReady: string;
        dmError: string;
        dmPending: string;
    };
    setCommunityUsers: React.Dispatch<React.SetStateAction<CommunityUser[]>>;
    setSidebarNotice: React.Dispatch<React.SetStateAction<SidebarNotice | null>>;
    setSelectedId: React.Dispatch<React.SetStateAction<string>>;
    setMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    resolveCurrentUserId: () => Promise<string | undefined>;
}

export function useDMConversations({
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
    resolveCurrentUserId,
}: UseDMConversationsParams) {
    const [apiDMs, setApiDMs] = useState<DirectMessage[]>([]);
    const [extraDMs, setExtraDMs] = useState<DirectMessage[]>([]);

    const dms = useMemo(() => {
        const existingUserIds = new Set(apiDMs.map((dm) => dm.userId));
        const merged = [
            ...apiDMs,
            ...extraDMs.filter((dm) => !existingUserIds.has(dm.userId)),
        ];

        return merged.map((dm) => ({
            ...dm,
            status: presenceByUserId[dm.userId] ?? dm.status,
        }));
    }, [apiDMs, extraDMs, presenceByUserId]);

    const usersByIdRef = useRef(usersById);

    useEffect(() => {
        usersByIdRef.current = usersById;
    }, [usersById]);

    const loadDMConversations = useCallback(async () => {
        try {
            const conversations = await fetchDMConversations();
            const mappedConversations = conversations.map((conversation) =>
                mapConversationToDM(conversation, resolvedCurrentUserId, usersByIdRef.current, locale),
            );
            setApiDMs(mappedConversations);

            setCommunityUsers((prev) => {
                const known = new Set(prev.map((user) => user.id));
                const additions = mappedConversations
                    .filter(
                        (dm) =>
                            dm.userId !== resolvedCurrentUserId && !known.has(dm.userId),
                    )
                    .map((dm) => ({
                        id: dm.userId,
                        name: dm.name,
                        username: dm.username,
                        initials: dm.initials,
                        status: dm.status,
                    }));

                return additions.length > 0 ? [...prev, ...additions] : prev;
            });

            return mappedConversations;
        } catch (error) {
            console.error("Failed to load DM conversations:", error);
            return [];
        }
    }, [locale, resolvedCurrentUserId, setCommunityUsers]);

    const upsertDMPreview = useCallback(
        ({
            conversationId,
            counterpartId,
            message,
            conversation,
        }: {
            conversationId: string;
            counterpartId: string;
            message: ApiMessage;
            conversation?: ApiDMConversation;
        }) => {
            const knownUser = usersById.get(counterpartId);
            const participantName = conversation?.participantName?.trim();
            const participantUsername = participantName
                ? normalizeParticipantUsername(participantName)
                : undefined;
            const messageAuthorId = message.authorId || message.author?.id || "";
            const incomingFromCounterpart = messageAuthorId === counterpartId;

            const fallbackName =
                knownUser?.name ||
                participantName ||
                (incomingFromCounterpart
                    ? message.author?.name?.trim() ||
                    message.author?.username ||
                    message.author?.email?.split("@")[0]
                    : undefined) ||
                `User ${counterpartId.slice(0, 6)}`;
            const fallbackUsername =
                knownUser?.username ||
                participantUsername ||
                (incomingFromCounterpart
                    ? message.author?.username ||
                    message.author?.email?.split("@")[0]
                    : undefined) ||
                counterpartId.slice(0, 10);

            const nextDM: DirectMessage = {
                id: conversationId,
                userId: counterpartId,
                name: fallbackName,
                username: fallbackUsername,
                initials: knownUser?.initials ?? getInitials(fallbackName),
                status: presenceByUserId[counterpartId] ?? knownUser?.status ?? "offline",
                lastMessage: message.content,
                lastAt: message.createdAt,
            };

            setApiDMs((prev) =>
                prev.some((dm) => dm.id === conversationId || dm.userId === counterpartId)
                    ? upsertDMCollection(prev, nextDM)
                    : prev,
            );
            setExtraDMs((prev) => upsertDMCollection(prev, nextDM));
        },
        [presenceByUserId, usersById],
    );

    const selectedDMMembers = useCallback(
        (selectedDM: DirectMessage | undefined): CommunityMember[] => {
            if (!selectedDM) return [];

            const knownCounterpart = usersById.get(selectedDM.userId);
            const currentUserName = session?.user?.name?.trim() || "You";
            const currentUserUsername =
                session?.user?.email?.split("@")[0]?.trim() || "you";
            const currentUserStatus =
                resolvedCurrentUserId && presenceByUserId[resolvedCurrentUserId]
                    ? presenceByUserId[resolvedCurrentUserId]
                    : "online";
            const counterpartStatus =
                presenceByUserId[selectedDM.userId] ?? selectedDM.status;

            const members: CommunityMember[] = [
                {
                    id: resolvedCurrentUserId ?? "self",
                    name: currentUserName,
                    username: currentUserUsername,
                    avatarInitials: getInitials(currentUserName),
                    avatarUrl: undefined,
                    role: "GROUP_MEMBER",
                    status: currentUserStatus,
                },
                {
                    id: selectedDM.userId,
                    name: selectedDM.name || knownCounterpart?.name || "User",
                    username:
                        selectedDM.username || knownCounterpart?.username || selectedDM.userId,
                    avatarInitials: selectedDM.initials || knownCounterpart?.initials || getInitials(selectedDM.name || knownCounterpart?.name || "User"),
                    avatarUrl: selectedDM.avatarUrl ?? knownCounterpart?.avatarUrl ?? undefined,
                    role: "GROUP_MEMBER",
                    status: counterpartStatus,
                },
            ];

            return Array.from(new Map(members.map((member) => [member.id, member])).values());
        },
        [
            presenceByUserId,
            resolvedCurrentUserId,
            session?.user?.email,
            session?.user?.name,
            usersById,
        ],
    );

    async function handleAddDirectFriends(users: CommunityUser[]) {
        const selfId = await resolveCurrentUserId();
        const targetUsers = users.filter((user) => user.id !== selfId);
        if (targetUsers.length === 0) {
            setSidebarNotice({ kind: "error", message: notices.dmSelfError });
            setMobileSidebarOpen(false);
            return;
        }

        let createFailed = false;
        let createdConversations: ApiDMConversation[] = [];

        try {
            createdConversations = await Promise.all(
                targetUsers.map((user) => fetchCreateOrOpenDM(user.id)),
            );
        } catch {
            createFailed = true;
        }

        const refreshedConversations = await loadDMConversations();

        let existingConversation = refreshedConversations.find((dm) =>
            targetUsers.some((user) => user.id === dm.userId),
        );

        if (!existingConversation && createdConversations.length > 0) {
            const apiConv = createdConversations[0];
            const mapped = mapConversationToDM(apiConv, selfId, usersById, locale as "pt" | "en" | "fr");
            setExtraDMs((prev) => upsertDMCollection(prev, mapped));
            existingConversation = mapped;
        }

        if (existingConversation) {
            setSelectedId(existingConversation.id);
            setMobileSidebarOpen(false);
            setSidebarNotice({ kind: "success", message: notices.dmReady });
            return;
        }

        setMobileSidebarOpen(false);
        setSidebarNotice({
            kind: createFailed ? "error" : "info",
            message: createFailed ? notices.dmError : notices.dmPending,
        });
    }

    return {
        apiDMs,
        setApiDMs,
        extraDMs,
        setExtraDMs,
        dms,
        loadDMConversations,
        upsertDMPreview,
        selectedDMMembers,
        handleAddDirectFriends,
    };
}
