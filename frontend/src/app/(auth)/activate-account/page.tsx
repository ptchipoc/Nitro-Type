"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CursorGlow } from "@/components/cursor-glow";
import { TerminalAuth } from "@/components/terminal-auth";
import {
  Mail,
  ShieldAlert,
  ArrowRight,
  ChevronLeft,
  Terminal as TerminalIcon,
  Eye,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useResendVerification } from "@/features/auth/hooks/resendVerification.hook";
import { useTranslation } from "@/lib/i18n";

export default function ActivateAccountPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<"visual" | "terminal">("visual");
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const { isLoading, error, success, resend } = useResendVerification();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    await resend(email);
    if (success || !error) {
      // Armazenar email na sessão para usar em verify-otp
      sessionStorage.setItem("activationEmail", email);

      // Redirecionar para verify-otp
      setTimeout(() => {
        router.push(
          `/verify-otp?intent=verify-email&email=${encodeURIComponent(email)}`,
        );
      }, 1500);
    }

    setSubmitted(true);
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
          {t("auth.activate.back_to_login")}
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 border border-orange-500/20 mb-4 mx-auto">
              <ShieldAlert className="h-6 w-6 text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{t("auth.activate.title")}</h1>
            <p className="text-sm text-muted-foreground font-mono italic text-center">
              {t("auth.activate.subtitle")}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setViewMode("visual")}
              className={cn(
                "px-4 py-2 rounded-lg border font-mono text-[10px] uppercase transition-all",
                viewMode === "visual"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card/40 text-muted-foreground",
              )}
            >
              <Eye className="h-3 w-3 inline mr-2" /> {t("auth.activate.visual")}
            </button>
            <button
              onClick={() => setViewMode("terminal")}
              className={cn(
                "px-4 py-2 rounded-lg border font-mono text-[10px] uppercase transition-all",
                viewMode === "terminal"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card/40 text-muted-foreground",
              )}
            >
              <TerminalIcon className="h-3 w-3 inline mr-2" /> {t("auth.activate.terminal")}
            </button>
          </div>

          {viewMode === "visual" ? (
            <div className="space-y-6">
              {!submitted ? (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pl-1">
                      {t("auth.activate.email_label")}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="coder@nt.io"
                        disabled={isLoading}
                        className="w-full bg-card/40 border border-border rounded-xl py-4 pl-10 pr-4 outline-none focus:border-primary/50 transition-all font-mono text-sm disabled:opacity-50"
                      />
                    </div>
                    {error && (
                      <p className="text-xs text-destructive font-mono mt-2">
                        ✗ {error}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-xl bg-primary py-4 font-mono text-sm font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("auth.activate.sending")}
                      </>
                    ) : (
                      <>
                        {t("auth.activate.submit")} <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-6 text-center">
                  <div
                    className={cn(
                      "p-8 rounded-xl border glass",
                      success
                        ? "border-primary/20 bg-primary/5"
                        : "border-destructive/20 bg-destructive/5",
                    )}
                  >
                    <ShieldAlert
                      className={cn(
                        "h-10 w-10 mx-auto mb-4 animate-pulse",
                        success ? "text-primary" : "text-destructive",
                      )}
                    />
                    <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                      {success
                        ? t("auth.activate.success_message")
                        : error || t("auth.activate.error_message")}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setEmail("");
                    }}
                    className="w-full rounded-xl bg-secondary py-4 font-mono text-sm font-bold uppercase tracking-widest text-foreground hover:opacity-90 transition-all flex items-center justify-center gap-3"
                  >
                    {t("auth.activate.try_again")} <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <TerminalAuth mode="activate" onSwitchMode={setViewMode} />
          )}
        </div>
      </div>
    </main>
  );
}
