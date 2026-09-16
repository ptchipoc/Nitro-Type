"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CursorGlow } from "@/components/cursor-glow";
import {
  requestPasswordReset,
  resendVerificationCode,
  resetPassword,
} from "@/features/auth/actions";
import { passwordSchema } from "@/features/auth/schema";
import { ApiRequestError } from "@/lib/api/errors";
import { useVerifyEmail } from "@/features/auth/hooks/verifyEmail.hook";
import {
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

function VerifyOtpPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const emailParam = searchParams.get("email") ?? "";
  const intent =
    searchParams.get("intent") === "reset-password"
      ? "reset-password"
      : "verify-email";
  
  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(300);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { isLoading: isVerifying, error: verifyError, success: verifySuccess, verify } = useVerifyEmail();

  const isResetFlow = intent === "reset-password";

  // Obter email do sessionStorage se não estiver nos params
  useEffect(() => {
    if (!email && typeof window !== "undefined") {
      const storedEmail = sessionStorage.getItem("activationEmail");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, [email]);

  // Redirecionar para login se verificação bem-sucedida
  useEffect(() => {
    if (verifySuccess && !isResetFlow) {
      setSuccessMessage(t("auth.verify_otp.email_verified"));
      const timer = setTimeout(() => {
        sessionStorage.removeItem("activationEmail");
        router.push("/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [verifySuccess, isResetFlow, router]);

  // Atualizar erro se houver erro na verificação
  useEffect(() => {
    if (verifyError && isSubmitting) {
      setError(verifyError);
    }
  }, [verifyError, isSubmitting]);

  const code = otp.join("");
  const backHref = isResetFlow ? "/forgot-password" : "/login";
  const pageTitle = isResetFlow ? t("auth.verify_otp.title_reset") : t("auth.verify_otp.title_verify");
  const pageDescription = isResetFlow
    ? email
      ? t("auth.verify_otp.desc_reset_email").replace("{email}", email)
      : t("auth.verify_otp.desc_reset_no_email")
    : email
      ? t("auth.verify_otp.desc_verify_email").replace("{email}", email)
      : t("auth.verify_otp.desc_verify_no_email");
  const submitLabel = isResetFlow ? t("auth.verify_otp.submit_reset") : t("auth.verify_otp.submit_verify");
  const resendLabel = isResetFlow
    ? t("auth.verify_otp.resend_reset")
    : t("auth.verify_otp.resend_verify");
  const successTitle = isResetFlow ? t("auth.verify_otp.success_title_reset") : t("auth.verify_otp.success_title_verify");
  const successDescription = isResetFlow
    ? t("auth.verify_otp.success_desc_reset")
    : t("auth.verify_otp.success_desc_verify");

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    const digits = value.replace(/\D/g, "");

    setOtp((current) => {
      const next = [...current];

      if (!digits) {
        next[index] = "";
        return next;
      }

      digits
        .slice(0, 6 - index)
        .split("")
        .forEach((digit, offset) => {
          next[index + offset] = digit;
        });

      return next;
    });

    if (digits) {
      const nextIndex = Math.min(index + digits.length, 5);
      requestAnimationFrame(() => {
        const nextInput = document.getElementById(`otp-${nextIndex}`);
        nextInput?.focus();
      });
    }
  };

  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      requestAnimationFrame(() => {
        const previousInput = document.getElementById(`otp-${index - 1}`);
        previousInput?.focus();
      });
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      const previousInput = document.getElementById(`otp-${index - 1}`);
      previousInput?.focus();
    }

    if (event.key === "ArrowRight" && index < 5) {
      event.preventDefault();
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const digits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!digits) return;

    const nextOtp = ["", "", "", "", "", ""];
    digits.split("").forEach((digit, index) => {
      nextOtp[index] = digit;
    });
    setOtp(nextOtp);

    requestAnimationFrame(() => {
      const nextInput = document.getElementById(
        `otp-${Math.min(digits.length - 1, 5)}`,
      );
      nextInput?.focus();
    });
  };

  const validateResetPassword = () => {
    const passwordResult = passwordSchema.safeParse(newPassword);
    if (!passwordResult.success) {
      return passwordResult.error.issues[0]?.message || t("auth.verify_otp.error_invalid_password");
    }

    if (confirmPassword !== newPassword) {
      return t("auth.verify_otp.error_passwords_mismatch");
    }

    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setInfo(null);

    if (!email) {
      setError(t("auth.verify_otp.error_missing_email"));
      return;
    }

    if (code.length !== 6) {
      setError(t("auth.verify_otp.error_incomplete_code"));
      return;
    }

    if (isResetFlow) {
      const passwordError = validateResetPassword();
      if (passwordError) {
        setError(passwordError);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (isResetFlow) {
        const response = await resetPassword({
          email,
          code,
          newPassword,
        });

        setSuccessMessage(
          response.data.message || t("auth.verify_otp.success_password_updated"),
        );
      } else {
        await verify(email, code);
      }
    } catch (apiError) {
      if (apiError instanceof ApiRequestError) {
        setError(apiError.message);
      } else {
        setError(t("auth.verify_otp.error_operation_failed"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTimerDisplay = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
  const handleResend = async () => {
    if (!email) {
      setError(t("auth.verify_otp.error_missing_email"));
      return;
    }

    setError(null);
    setInfo(null);
    setIsResending(true);

    try {
      const response = isResetFlow
        ? await requestPasswordReset(email)
        : await resendVerificationCode(email);

      setTimer(60);
      setInfo(
        response.data.message ||
          t("auth.verify_otp.info_resend_success"),
      );
    } catch (apiError) {
      if (apiError instanceof ApiRequestError) {
        setError(apiError.message);
      } else {
        setError(t("auth.verify_otp.error_resend_failed"));
      }
    } finally {
      setIsResending(false);
    }
  };

  if (successMessage) {
    return (
      <main className="relative min-h-screen overflow-hidden scanlines flex flex-col bg-background">
        <CursorGlow />

        <div className="absolute top-6 left-6 z-20">
          <Link
            href="/login"
            className="group flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-all"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {t("auth.verify_otp.back_to_login")}
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
          <div className="w-full max-w-md space-y-8 animate-fade-in-up text-center">
            <div className="p-8 rounded-2xl border border-primary/20 bg-primary/5 glass space-y-4">
              <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight ">
                  {successTitle}
                </h1>
                <p className="text-sm text-muted-foreground font-mono">
                  {successMessage}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  {successDescription}
                </p>
              </div>
            </div>

            <Link
              href="/login"
              className="w-full rounded-xl bg-primary py-4 font-mono text-sm font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90 transition-all flex items-center justify-center gap-3"
            >
              {t("auth.verify_otp.go_to_login")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden scanlines flex flex-col bg-background">
      <CursorGlow />

      <div className="absolute top-6 left-6 z-20">
        <Link
          href={backHref}
          className="group flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-all"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {t("auth.verify_otp.back")}
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20 mb-4 mx-auto">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight ">
              {pageTitle}
            </h1>
            <p className="text-xs text-muted-foreground font-mono max-w-xs mx-auto text-center">
              {pageDescription}
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3">
                <p className="text-xs font-mono text-orange-200">{error}</p>
              </div>
            )}

            {info && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                <p className="text-xs font-mono text-primary">{info}</p>
              </div>
            )}

            <div className="space-y-3">
              <div
                className="flex justify-between gap-2"
                onPaste={handleOtpPaste}
              >
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    autoComplete={i === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold bg-card/40 border border-border rounded-xl focus:border-primary/50 outline-none transition-all font-mono"
                  />
                ))}
              </div>
              <p className="text-[10px] text-center font-mono text-muted-foreground">
                {t("auth.verify_otp.paste_instruction")}
              </p>
            </div>

            {isResetFlow && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pl-1">
                    {t("auth.verify_otp.new_password")}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      placeholder="NewPass@1234"
                      className="w-full bg-card/40 border border-border rounded-xl py-4 pl-10 pr-12 outline-none focus:border-primary/50 transition-all font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords((current) => !current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showPasswords ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pl-1">
                    {t("auth.verify_otp.confirm_password")}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Repete a nova password"
                      className="w-full bg-card/40 border border-border rounded-xl py-4 pl-10 pr-4 outline-none focus:border-primary/50 transition-all font-mono text-sm"
                    />
                  </div>
                </div>

                <p className="text-[10px] font-mono text-muted-foreground">
                  {t("auth.verify_otp.password_requirements")}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full rounded-xl bg-primary py-4 font-mono text-sm font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
              >
                {isSubmitting ? t("auth.verify_otp.validating") : submitLabel}{" "}
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="text-center space-y-2">
                {timer > 0 ? (
                  <p className="text-[10px] font-mono text-muted-foreground">
                    {t("auth.verify_otp.resend_in")} <span className="text-primary">{getTimerDisplay()}</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    disabled={isResending || !email}
                    onClick={handleResend}
                    className="text-[10px] font-mono text-primary hover:underline flex items-center gap-2 mx-auto disabled:opacity-60"
                  >
                    <RefreshCw className="h-3 w-3" />
                    {isResending ? t("auth.verify_otp.resending") : resendLabel}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

function VerifyOtpLoading() {
  const { t } = useTranslation();
  return (
    <main className="relative min-h-screen overflow-hidden scanlines flex flex-col bg-background">
      <CursorGlow />

      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/login"
          className="group flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-all"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {t("auth.verify_otp.back_to_login")}
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-md space-y-4 text-center animate-fade-in-up">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20 mx-auto">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight ">
            {t("auth.verify_otp.loading_title")}
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            {t("auth.verify_otp.loading_desc")}
          </p>
        </div>
      </div>
    </main>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<VerifyOtpLoading />}>
      <VerifyOtpPageContent />
    </Suspense>
  );
}
