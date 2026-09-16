"use client";

import { useState } from "react";
import Link from "next/link";
import { CursorGlow } from "@/components/cursor-glow";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import {
  Github,
  Mail,
  Lock,
  Chrome,
  ShieldAlert,
  Terminal as TerminalIcon,
  Eye,
  EyeOff,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TerminalAuth2 } from "@/components/auth/terminal-auth";
import { SignInInput } from "@/features/auth/inputs/auth.input";
import { signInSchema } from "@/features/auth/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "@/lib/i18n";
import { AUTH_ERROR_CODES } from "@/lib/auth/credentials-errors";
import { ChangeLocale } from "@/components/change-locale";
import { SocialButtons } from "@/components/auth/social_buttons";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<"visual" | "terminal">("visual");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInInput) => {
    setAuthError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        redirectTo: "/dashboard",
      });

      if (result?.error) {
        if (result.code === AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED) {
          router.push(
            `/verify-otp?intent=verify-email&email=${encodeURIComponent(data.email)}`,
          );
          return;
        }

        if (result.code === AUTH_ERROR_CODES.INVALID_CREDENTIALS) {
          setAuthError(t("auth.invalid_credentials"));
          return;
        }

        setAuthError(t("auth.login_failed"));
        return;
      }

      router.push(result?.url ?? "/dashboard");
      router.refresh();
    } catch {
      setAuthError(t("auth.login_failed"));
    }
  };
  return (
    <main className="relative min-h-screen overflow-hidden scanlines flex flex-col bg-background">
      <CursorGlow />

      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="group flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-all"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {t("auth.back_to_dashboard")}
        </Link>
      </div>

      {/* locale translation */}
      {/* <div className="absolute top-6 right-6 z-20 flex gap-2">
        <button
          onClick={() => setLocale("pt")}
          className={cn(
            "px-2 py-1 rounded border font-mono text-[10px] uppercase transition-all",
            locale === "pt"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-card/40 text-muted-foreground",
          )}
        >
          PT
        </button>
        <button
          onClick={() => setLocale("en")}
          className={cn(
            "px-2 py-1 rounded border font-mono text-[10px] uppercase transition-all",
            locale === "en"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-card/40 text-muted-foreground",
          )}
        >
          EN
        </button>
        <button
          onClick={() => setLocale("fr")}
          className={cn(
            "px-2 py-1 rounded border font-mono text-[10px] uppercase transition-all",
            locale === "fr"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-card/40 text-muted-foreground",
          )}
        >
          FR
        </button>
      </div> */}
      <ChangeLocale />


      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
          <div className="w-full max-w-md space-y-8 animate-fade-in-up">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t("auth.login_title")}
              </h1>
              <p className="text-sm text-muted-foreground font-mono">
                {t("auth.login_subtitle")}
              </p>
            </div>

            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => setViewMode("visual")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border font-mono text-[10px] uppercase transition-all",
                  viewMode === "visual"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card/40 text-muted-foreground",
                )}
              >
                <Eye className="h-3 w-3" /> Visual
              </button>
              <button
                onClick={() => setViewMode("terminal")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border font-mono text-[10px] uppercase transition-all",
                  viewMode === "terminal"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card/40 text-muted-foreground",
                )}
              >
                <TerminalIcon className="h-3 w-3" /> Terminal
              </button>
            </div>

            <div className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {authError && (
                  <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3">
                    <p className="text-xs font-mono text-orange-200">
                      {authError}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pl-1">
                    {t("auth.email")}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="coder@nt.io"
                      {...register("email")}
                      className="w-full bg-card/40 border border-border rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary/50 transition-all font-mono text-sm"
                    />

                    {errors.email && (
                      <p className="text-red-500 text-xs">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {t("auth.password")}
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-[10px] font-mono text-primary hover:underline"
                    >
                      {t("auth.forgot_password")}
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password")}
                      className="w-full bg-card/40 border border-border rounded-xl py-3 pl-10 pr-12 outline-none focus:border-primary/50 transition-all font-mono text-sm"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs">
                        {errors.password.message}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  className="w-full rounded-xl bg-primary py-3.5 font-mono text-sm font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? t("auth.loading") : t("auth.login")}
                </button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-background px-2 text-muted-foreground font-mono">
                    {t("auth.or_connect_with")}
                  </span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <SocialButtons />

              <div className="text-center pt-2">
                <p className="text-xs text-muted-foreground font-mono">
                  {t("auth.new_here")}{" "}
                  <Link
                    href="/register"
                    className="text-primary font-bold hover:underline"
                  >
                    {t("auth.register")}
                  </Link>
                </p>
              </div>

              <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20 flex gap-3">
                <ShieldAlert className="h-5 w-5 text-orange-500 shrink-0" />
                <p className="text-[10px] leading-relaxed text-muted-foreground">
                  {t("auth.inactive_account")}{" "}
                  <Link
                    href="/activate-account"
                    className="text-primary font-bold hover:underline"
                  >
                    {t("auth.activate_now")}
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden lg:block">
          {viewMode === "visual" ? (
            <>
              <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/10" />
              <div className="absolute inset-0 bg-[url('/og-image.png')] bg-cover bg-center opacity-10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-primary">{t("auth.logo_title")}</h1>
                  <p className="text-muted-foreground">
                    {t("auth.logo_subtitle")}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <TerminalAuth2 />
          )}
        </div>
      </div>
    </main>
  );
}
