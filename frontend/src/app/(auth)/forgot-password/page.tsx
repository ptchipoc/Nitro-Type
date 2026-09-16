"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CursorGlow } from "@/components/cursor-glow";
import {
  type ForgotPasswordInput,
} from "@/features/auth/inputs/auth.input";
import { requestPasswordReset } from "@/features/auth/actions/forgotPassword.action";
import { forgotPasswordSchema } from "@/features/auth/schema";
import { ApiRequestError } from "@/lib/api/errors";
import {
  Mail,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function ForgotPasswordPage() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setApiError(null);
    setApiMessage(null);

    try {
      const normalizedEmail = data.email.trim();
      const response = await requestPasswordReset(normalizedEmail);

      setSubmittedEmail(normalizedEmail);
      setApiMessage(
        response.data.message || t("auth.forgot_password.info_success"),
      );
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setApiError(error.message);
        return;
      }

      setApiError(t("auth.forgot_password.error_connection"));
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden scanlines flex flex-col bg-background">
      <CursorGlow />

      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/login"
          className="group flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-all"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {t("auth.forgot_password.back_to_login")}
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20 mb-4 mx-auto">
              <ShieldAlert className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight ">
              {t("auth.forgot_password.title")}
            </h1>
            <p className="text-sm text-muted-foreground font-mono max-w-sm mx-auto">
              {t("auth.forgot_password.subtitle")}
            </p>
          </div>

          <div className="space-y-6">
            {!submittedEmail ? (
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {apiError && (
                  <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3">
                    <p className="text-xs font-mono text-orange-200">{apiError}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pl-1">
                    {t("auth.forgot_password.email_label")}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="coder@nt.io"
                      {...register("email")}
                      className="w-full bg-card/40 border border-border rounded-xl py-4 pl-10 pr-4 outline-none focus:border-primary/50 transition-all font-mono text-sm"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-primary py-4 font-mono text-sm font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
                >
                  {isSubmitting ? t("auth.forgot_password.sending") : t("auth.forgot_password.submit")}{" "}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <div className="space-y-6 text-center">
                <div className="p-8 rounded-2xl border border-primary/20 bg-primary/5 glass space-y-4">
                  <CheckCircle2 className="h-10 w-10 text-primary mx-auto" />
                  <div className="space-y-2">
                    <p className="text-sm text-foreground font-mono">
                      {t("auth.forgot_password.code_requested_for")}
                    </p>
                    <p className="text-xs text-primary font-mono break-all">
                      {submittedEmail}
                    </p>
                    <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                      {apiMessage || t("auth.forgot_password.info_success")}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/verify-otp?intent=reset-password&email=${encodeURIComponent(submittedEmail)}`}
                  className="w-full rounded-xl bg-primary py-4 font-mono text-sm font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90 transition-all flex items-center justify-center gap-3"
                >
                  {t("auth.forgot_password.enter_code")} <ArrowRight className="h-4 w-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setSubmittedEmail(null);
                    setApiMessage(null);
                    setApiError(null);
                  }}
                  className="w-full rounded-xl border border-border bg-card/40 py-4 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
                >
                  {t("auth.forgot_password.use_other_email")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
