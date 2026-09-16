export function createConnectionHandlers(
    context: any,
) {
    const {
        resolvedCurrentUserId,
        setUserPresence,
    } = context;

    const handleConnect = () => {
        if (
            resolvedCurrentUserId
        ) {
            setUserPresence(
                resolvedCurrentUserId,
                "online",
            );
        }
    };

    const handleDisconnect = () => {
        if (
            resolvedCurrentUserId
        ) {
            setUserPresence(
                resolvedCurrentUserId,
                "offline",
            );
        }
    };

    return {
        handleConnect,
        handleDisconnect,
    };
}