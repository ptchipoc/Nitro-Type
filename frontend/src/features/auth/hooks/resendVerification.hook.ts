import { useState } from "react";
import { resendVerificationCode } from "../actions/resendVerification.action";
import { ApiClientError } from "@/features/apiClient";

interface UseResendVerificationReturn {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  resend: (email: string) => Promise<void>;
}

export function useResendVerification(): UseResendVerificationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resend = async (email: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await resendVerificationCode(email);
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.getMessage());
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao reenviar código de verificação");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    success,
    resend,
  };
}
