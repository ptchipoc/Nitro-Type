"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { toast } from "sonner";
import type { CommunityChannel } from "../types";
import {
    fetchChannels,
    fetchChannel,
    fetchCreateChannel,
    fetchUpdateChannel,
    fetchDeleteChannel,
} from "@/features/community/services/community.service";
import { ChannelType } from "@/features/community/types/enums.type";
import { mapApiChannelToCommunityChannel } from "../mappers/index.mappers";

interface UseGroupManagementProps {
    selectedId: string;
    setSelectedId: React.Dispatch<React.SetStateAction<string>>;
    setCreateGroupOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setEditGroupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useGroupManagement({
    selectedId,
    setSelectedId,
    setCreateGroupOpen,
    setEditGroupOpen,
}: UseGroupManagementProps) {
    const [platformChannels, setPlatformChannels] = useState<CommunityChannel[]>([]);
    const [privateGroups, setPrivateGroups] = useState<CommunityChannel[]>([]);
    const [channelsLoading, setChannelsLoading] = useState(true);
    const [channelsError, setChannelsError] = useState<string | null>(null);

    const loadChannels = useCallback(async () => {
        try {
            setChannelsLoading(true);
            setChannelsError(null);
            const data = await fetchChannels();
            setPlatformChannels(data.public.map((channel) => mapApiChannelToCommunityChannel(channel, false)));
            setPrivateGroups(data.private.map((channel) => mapApiChannelToCommunityChannel(channel, true)));
        } catch {
            setChannelsError("Failed to load channels");
        } finally {
            setChannelsLoading(false);
        }
    }, []);

    const allChannels = useMemo(
        () => [...platformChannels, ...privateGroups],
        [platformChannels, privateGroups],
    );

    const channelNamesById = useMemo(
        () => new Map(allChannels.map((channel) => [channel.id, channel.name])),
        [allChannels],
    );

    const selectedChannel = allChannels.find((channel) => channel.id === selectedId);

    // Initial load
    useEffect(() => {
        let cancelled = false;
        queueMicrotask(() => {
            if (!cancelled) void loadChannels();
        });
        return () => {
            cancelled = true;
        };
    }, [loadChannels]);

    // Channel detail loading (when selected)
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
    }, [selectedChannel?.id]);

    function bumpChannelMemberCount(channelId: string, delta: number) {
        if (delta === 0) return;

        const applyDelta = (channels: CommunityChannel[]) =>
            channels.map((channel) => {
                if (channel.id !== channelId) return channel;
                return {
                    ...channel,
                    memberCount: Math.max((channel.memberCount ?? 0) + delta, 0),
                };
            });

        setPlatformChannels((prev) => applyDelta(prev));
        setPrivateGroups((prev) => applyDelta(prev));
    }

    async function handleCreateGroup(name: string, description?: string) {
        try {
            const created = await fetchCreateChannel({
                name,
                description,
                type: ChannelType.PRIVATE,
                isPlatformManaged: false,
            });
            await loadChannels();
            setSelectedId(created.id);
            setCreateGroupOpen(false);
        } catch (error: any) {
            const msg = error?.message || "Falha ao criar grupo";
            // console.error("Failed to create group:", msg);
            toast.error(msg);
            // throw error;
        }
    }

    async function handleUpdateGroup(name: string, description?: string) {
        if (!selectedChannel) return;
        try {
            await fetchUpdateChannel(selectedChannel.id, { name, description });
            await loadChannels();
            setEditGroupOpen(false);
            toast.success("Grupo atualizado com sucesso");
        } catch (error) {
            console.error("Failed to update group:", error);
            toast.error("Falha ao atualizar grupo");
        }
    }

    async function handleDeleteGroup() {
        if (!selectedChannel) return;
        try {
            await fetchDeleteChannel(selectedChannel.id);
            await loadChannels();
            setSelectedId("");
            setEditGroupOpen(false);
            toast.success("Grupo removido com sucesso");
        } catch (error) {
            console.error("Failed to delete group:", error);
            toast.error("Falha ao remover grupo");
        }
    }

    return {
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
    };
}
