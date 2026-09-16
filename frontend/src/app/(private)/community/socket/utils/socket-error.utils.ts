export function isRemovedFromChannelError(
  message: string,
) {
  const lower =
    message.toLowerCase();

  return (
    lower.includes("banned") ||
    lower.includes("banido") ||
    lower.includes("removed") ||
    lower.includes("removido") ||
    lower.includes("kick")
  );
}