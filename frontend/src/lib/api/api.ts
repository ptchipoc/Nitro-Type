export class ApiError extends Error {
  success: false;
  error: { code: number; message: string };
  ts: string;
  path: string;

  constructor(
    error: { code: number; message: string },
    ts: string,
    path: string,
  ) {
    super(error.message);
    this.success = false;
    this.error = error;
    this.ts = ts;
    this.path = path;
  }
}

export interface ApiSuccess {
  success: true;
  data: {
    message: string;
  };
  ts: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  ts: string;
}
