import {
    patchUiMessageRecordById,
} from "../../utils/message.utils";

export function createMessageEditedHandlers(
    context: any,
) {
    const {
        setChannelMessagesById,
        setDmMessagesById,
    } = context;

    const handleSocketMessageEdited =
        (payload: any) => {
            const {
                messageId,
                content,
                channelId,
                dmId,
            } = payload;

            const updateMessage = (
                message: any,
            ) => ({
                ...message,
                content,
                edited: true,
            });

            if (channelId) {
                setChannelMessagesById(
                    (prev: any) =>
                        patchUiMessageRecordById(
                            prev,
                            messageId,
                            updateMessage,
                        ),
                );

                return;
            }

            if (dmId) {
                setDmMessagesById(
                    (prev: any) =>
                        patchUiMessageRecordById(
                            prev,
                            messageId,
                            updateMessage,
                        ),
                );
            }
        };

    return {
        handleSocketMessageEdited,
    };
}