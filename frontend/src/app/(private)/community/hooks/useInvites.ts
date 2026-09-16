"use client";

import { useState, useCallback, useMemo } from "react";
import type { UiInvite, SidebarNotice } from "../types/controller.types";
import {
    fetchMyInvites,
    fetchAcceptInvite,
    fetchRejectInvite,
} from "@/features/community/services/community.service";
import { ApiRequestError } from "@/lib/api/errors";
import { toast } from "sonner";

interface UseInvitesParams {
    channelNamesById: Map<string, string>;
    notices: {
        inviteAccepted: string;
        inviteAcceptError: string;
        banned: string;
        alreadyMember: string;
    };
    loadChannels: () => Promise<void>;
    setSidebarNotice: React.Dispatch<React.SetStateAction<SidebarNotice | null>>;
    setSelectedId: React.Dispatch<React.SetStateAction<string>>;
}

export function useInvites({
    channelNamesById,
    notices,
    loadChannels,
    setSidebarNotice,
    setSelectedId,
}: UseInvitesParams) {
    const [pendingInvites, setPendingInvites] = useState<UiInvite[]>([]);
    const [invitesLoading, setInvitesLoading] = useState(false);

    const [rejectedCodes, setRejectedCodes] = useState<string[]>(() => {
        if (typeof window !== "undefined") {
            try {
                const saved = localStorage.getItem("rejected_invites");
                return saved ? JSON.parse(saved) : [];
            } catch {
                return [];
            }
        }
        return [];
    });

    const sidebarInvites = useMemo(
        () =>
            pendingInvites
                .filter((invite) => !rejectedCodes.includes(invite.code))
                .map((invite) => ({
                    code: invite.code,
                    channelName:
                        invite.channelName ||
                        channelNamesById.get(invite.channelId) ||
                        `#${invite.channelId.slice(0, 8)}`,
                    expiresAt: invite.expiresAt,
                })),
        [channelNamesById, pendingInvites, rejectedCodes],
    );

    const loadInvites = useCallback(async () => {
        try {
            setInvitesLoading(true);
            const invites = await fetchMyInvites();
            setPendingInvites(
                invites
                    .filter((invite) => invite.status === "PENDING")
                    .map((invite) => ({
                        code: invite.code,
                        channelId: invite.channelId,
                        channelName: invite.channelName,
                        expiresAt: invite.expiresAt,
                    })),
            );
        } catch {
            setPendingInvites([]);
        } finally {
            setInvitesLoading(false);
        }
    }, []);

    async function handleAcceptInviteCode(code: string) {
        setPendingInvites((prev) => prev.filter((invite) => invite.code !== code));

        const result = await fetchAcceptInvite(code).then(
            (data) => ({ success: true, data, error: null }),
            (error) => ({ success: false, data: null, error })
        );

        if (result.success) {
            await Promise.all([loadChannels(), loadInvites()]);
            if (result.data?.channelId) {
                setSelectedId(result.data.channelId);
            }
            setSidebarNotice({ kind: "success", message: notices.inviteAccepted });
        } else {
            void loadInvites();
            const error = result.error;
            let errorMsg: string = notices.inviteAcceptError;

            if (error instanceof ApiRequestError) {
                const msgLower = (error.message || "").toLowerCase();
                if (
                    msgLower.includes("banido") ||
                    msgLower.includes("banned") ||
                    msgLower.includes("ban")
                ) {
                    errorMsg = notices.banned;
                } else if (
                    msgLower.includes("membro") ||
                    msgLower.includes("member") ||
                    msgLower.includes("já") ||
                    msgLower.includes("already")
                ) {
                    errorMsg = notices.alreadyMember;
                } else if (error.status !== 500) {
                    errorMsg = error.message;
                }
            }
            toast.error(errorMsg);
        }
    }

    async function handleRejectInviteCode(code: string) {
        setPendingInvites((prev) => prev.filter((invite) => invite.code !== code));
        setRejectedCodes((prev) => {
            const next = [...prev, code];
            try {
                localStorage.setItem("rejected_invites", JSON.stringify(next));
            } catch { }
            return next;
        });
        setSidebarNotice({ kind: "info", message: "Convite recusado" });
    }

    return {
        pendingInvites,
        invitesLoading,
        sidebarInvites,
        loadInvites,
        handleAcceptInviteCode,
        handleRejectInviteCode,
    };
}
