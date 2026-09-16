"use client";

import { toast } from "sonner";
import type { CommunityChannel, CommunityMember, MemberRole as CommunityMemberRole } from "../types";
import type { SidebarNotice } from "../types/controller.types";
import {
    fetchInviteToChannel,
    fetchUpdateMemberRole,
    fetchRemoveMember,
    fetchBanMember,
} from "@/features/community/services/community.service";
import { MemberRole as ApiMemberRole } from "@/features/community/types/enums.type";
import { isUuid } from "../mappers/index.mappers";
import { ApiRequestError } from "@/lib/api/errors";

interface UseChannelMembersProps {
    selectedChannel: CommunityChannel | undefined;
    channelMembersById: Record<string, CommunityMember[]>;
    setChannelMembersById: React.Dispatch<React.SetStateAction<Record<string, CommunityMember[]>>>;
    resolveCurrentUserId: () => Promise<string | undefined>;
    notices: Record<string, any>;
    setSidebarNotice: React.Dispatch<React.SetStateAction<SidebarNotice | null>>;
    registerRemovedMember: (channelId: string, memberId: string) => void;
    bumpChannelMemberCount: (channelId: string, delta: number) => void;
}

export function useChannelMembers({
    selectedChannel,
    channelMembersById,
    setChannelMembersById,
    resolveCurrentUserId,
    notices,
    setSidebarNotice,
    registerRemovedMember,
    bumpChannelMemberCount,
}: UseChannelMembersProps) {

    async function handleInviteToGroup(groupId: string, userIds: string[]) {
        const selfId = await resolveCurrentUserId();
        const validUserIds = userIds.filter(
            (userId) => isUuid(userId) && userId !== selfId,
        );
        if (validUserIds.length === 0) {
            setSidebarNotice({ kind: "error", message: notices.inviteSelfError });
            return;
        }

        try {
            const results = await Promise.allSettled(
                validUserIds.map((userId) =>
                    fetchInviteToChannel(groupId, { invitedUserId: userId }),
                ),
            );

            const sentCount = results.filter((result) => result.status === "fulfilled").length;
            const failedCount = validUserIds.length - sentCount;

            if (sentCount > 0 && failedCount === 0) {
                setSidebarNotice({ kind: "success", message: notices.inviteSent(sentCount) });
            } else if (sentCount > 0) {
                setSidebarNotice({
                    kind: "info",
                    message: notices.invitePartial(sentCount, failedCount),
                });
            } else {
                setSidebarNotice({ kind: "error", message: notices.inviteError });
            }
        } catch (error) {
            setSidebarNotice({ kind: "error", message: notices.inviteError });
            console.error("Failed to invite members:", error);
        }
    }

    async function handleUpdateChannelMemberRole(
        memberId: string,
        role: CommunityMemberRole,
    ) {
        if (!selectedChannel) return;
        const channelId = selectedChannel.id;

        if (!isUuid(memberId)) {
            setChannelMembersById((prev) => ({
                ...prev,
                [channelId]: (prev[channelId] ?? []).map((member) =>
                    member.id === memberId ? { ...member, role } : member,
                ),
            }));
            return;
        }

        try {
            await fetchUpdateMemberRole(channelId, memberId, {
                userId: memberId,
                role: ApiMemberRole[role as keyof typeof ApiMemberRole],
            });

            setChannelMembersById((prev) => ({
                ...prev,
                [channelId]: (prev[channelId] ?? []).map((member) =>
                    member.id === memberId ? { ...member, role } : member,
                ),
            }));
        } catch (error) {
            const message =
                error instanceof ApiRequestError
                    ? error.status === 403
                        ? notices.noPermission
                        : error.message
                    : notices.roleError;
            toast.error(message);
        }
    }

    async function handleRemoveChannelMember(memberId: string) {
        if (!selectedChannel) return;
        const channelId = selectedChannel.id;
        const wasMember = (channelMembersById[channelId] ?? []).some(
            (member) => member.id === memberId,
        );

        try {
            if (isUuid(memberId)) {
                await fetchRemoveMember(channelId, memberId, {
                    userId: memberId,
                    notifyChannel: false,
                });
            }

            setChannelMembersById((prev) => ({
                ...prev,
                [channelId]: (prev[channelId] ?? []).filter((member) => member.id !== memberId),
            }));

            registerRemovedMember(channelId, memberId);

            if (wasMember) {
                bumpChannelMemberCount(channelId, -1);
            }
        } catch (error) {
            const message =
                error instanceof ApiRequestError
                    ? error.status === 403
                        ? notices.noPermission
                        : error.message
                    : notices.removeError;
            toast.error(message);
        }
    }

    async function handleBanChannelMember(memberId: string) {
        if (!selectedChannel) return;
        const channelId = selectedChannel.id;
        const wasMember = (channelMembersById[channelId] ?? []).some(
            (member) => member.id === memberId,
        );

        try {
            if (isUuid(memberId)) {
                await fetchBanMember(channelId, memberId, {
                    userId: memberId,
                });
            }

            setChannelMembersById((prev) => ({
                ...prev,
                [channelId]: (prev[channelId] ?? []).filter((member) => member.id !== memberId),
            }));

            registerRemovedMember(channelId, memberId);

            if (wasMember) {
                bumpChannelMemberCount(channelId, -1);
            }
        } catch (error) {
            const message =
                error instanceof ApiRequestError
                    ? error.status === 403
                        ? notices.noPermission
                        : error.message
                    : notices.banError;
            toast.error(message);
        }
    }

    return {
        handleInviteToGroup,
        handleUpdateChannelMemberRole,
        handleRemoveChannelMember,
        handleBanChannelMember,
    };
}
