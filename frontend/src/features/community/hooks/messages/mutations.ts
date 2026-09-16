import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    fetchSendChannelMessage,
} from "@/features/community/services/community.service";

import {
    SendMessageInput,
} from "@/features/community/input/community.input";

import { communityKeys } from "../keys";

export function useSendChannelMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            channelId,
            input,
        }: {
            channelId: string;
            input: SendMessageInput;
        }) =>
            fetchSendChannelMessage(channelId, input),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: communityKeys.channelMessages(
                    variables.channelId,
                ),
            });
        },
    });
}