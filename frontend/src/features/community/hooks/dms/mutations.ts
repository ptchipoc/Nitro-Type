import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    fetchCreateOrOpenDM,
    fetchSendDMMessage,
} from "@/features/community/services/community.service";

import {
    SendDMInput,
} from "@/features/community/input/community.input";

import { communityKeys } from "../keys";

export function useSendDM() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            dmId,
            input,
        }: {
            dmId: string;
            input: SendDMInput;
        }) =>
            fetchSendDMMessage(dmId, input),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: communityKeys.dmMessages(
                    variables.dmId,
                ),
            });
        },
    });
}

export function useCreateOrOpenDM() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchCreateOrOpenDM,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: communityKeys.dmList(),
            });
        },
    });
}