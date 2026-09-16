export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly path: string,
  ) {
    super(`[api] ${status} ${path} — ${message}`);
  }
}
