export function isUnauthorizedError(
  message: string,
) {
  const lower =
    message.toLowerCase();

  return (
    lower.includes("unauthorized") ||
    lower.includes("auth") ||
    lower.includes("token") ||
    lower.includes("sessão expirou")
  );
}