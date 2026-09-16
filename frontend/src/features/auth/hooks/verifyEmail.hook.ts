import { useState } from "react";
import { verifyEmailCode } from "../actions/verifyEmail.action";
import { ApiClientError } from "@/features/apiClient";

interface UseVerifyEmailReturn {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  verify: (email: string, code: string) => Promise<void>;
}

export function useVerifyEmail(): UseVerifyEmailReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const verify = async (email: string, code: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await verifyEmailCode({ email, code });
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.getMessage());
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao verificar email");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    success,
    verify,
  };
}
