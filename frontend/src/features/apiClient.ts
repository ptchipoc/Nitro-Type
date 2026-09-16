import { API_URL } from "./config";
import { signOut } from "next-auth/react";
let isSigningOut = false;

function handleSessionExpired() {
  if (isSigningOut) return;
  isSigningOut = true;
  signOut({ callbackUrl: "/login" }).finally(() => {
    isSigningOut = false;
  });
}


export async function apiClient<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      // Erro da API externa — trata aqui, não vaza pro console
      throw new ApiClientError(res.status, await res.json());
    }

    return await res.json();
  } catch (error) {
    if (error instanceof ApiClientError) {
      if (error.getCode() === 401) {
        if (error.getMessage().startsWith("Sessão expirada. Faz login novamente") || error.getMessage().startsWith("Token inválido."))
          handleSessionExpired();
      }
      throw error;
    }


    // Erro de rede, timeout, etc.
    throw new NetworkError("Falha na conexão");
  }
}

export class ApiClientError extends Error {
  private success = false;
  private error: { code: number; message: string };
  private ts: string;
  constructor(
    public status: number,
    public data: any,
  ) {
    super(`API Error ${status}`);
    this.error = { code: status, message: data.error || "Unknown error" };
    this.ts = new Date().toISOString();

    if (typeof data === "object" && data.error && data.ts) {
      this.success = false;
      this.error = data.error;
      this.ts = data.ts;
    }
  }

  getSuccess(): boolean {
    return this.success;
  }

  getError(): { code: number; message: string } {
    return this.error;
  }

  getCode(): number {
    return this.error.code;
  }

  getMessage(): string {
    return this.error.message;
  }

  getTimestamp(): string {
    return this.ts;
  }
}

class NetworkError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export type ApiErrorResponse = {
  success: false;
  error: {
    code: number;
    message: string;
  };
  ts: string;
};

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
