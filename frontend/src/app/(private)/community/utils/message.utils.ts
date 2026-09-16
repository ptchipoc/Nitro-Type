import type { UiMessage } from "../types/controller.types";

export function upsertUiMessage(messages: UiMessage[], nextMessage: UiMessage): UiMessage[] {
    const existingIndex = messages.findIndex(
        (message) => message.id === nextMessage.id,
    );

    if (existingIndex === -1) {
        // Filter out any optimistic message that has the exact same content
        const filtered = messages.filter((m) => !(m.id.startsWith("temp-") && m.content === nextMessage.content));
        return [...filtered, nextMessage];
    }

    return messages.map((message, index) =>
        index === existingIndex ? nextMessage : message,
    );
}

export function upsertUiMessageRecord(
    collections: Record<string, UiMessage[]>,
    collectionId: string,
    nextMessage: UiMessage,
) {
    return {
        ...collections,
        [collectionId]: upsertUiMessage(collections[collectionId] ?? [], nextMessage),
    };
}

export function patchUiMessageRecordById(
    collections: Record<string, UiMessage[]>,
    messageId: string,
    updater: (message: UiMessage) => UiMessage,
) {
    let changed = false;
    const nextCollections: Record<string, UiMessage[]> = {};

    for (const [collectionId, messages] of Object.entries(collections)) {
        const nextMessages = messages.map((message) => {
            if (message.id !== messageId) return message;
            changed = true;
            return updater(message);
        });

        nextCollections[collectionId] = nextMessages;
    }

    return changed ? nextCollections : collections;
}
