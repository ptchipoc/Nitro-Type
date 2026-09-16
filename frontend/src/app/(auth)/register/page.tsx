"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CursorGlow } from "@/components/cursor-glow";
import { TerminalAuth } from "@/components/terminal-auth";
import {
  User,
  Mail,
  Lock,
  Chrome,
  Github,
  Terminal as TerminalIcon,
  Eye,
  EyeOff,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerInputSchema,
  type RegisterInput,
} from "@/features/auth/inputs/register.input";
import { useRegister } from "@/features/auth/hooks/use-register";
import { ApiClientError } from "@/features/apiClient";
import { ChangeLocale } from "@/components/change-locale";
import { useTranslation } from "@/lib/i18n";
import { SocialButtons } from "@/components/auth/social_buttons";

export default function RegisterPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"visual" | "terminal">("visual");
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const registerMutation = useRegister();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerInputSchema),
  });

  const privacyAgreed = watch("privacyAgreed");

  const onSubmit = async (data: RegisterInput) => {
    setApiError(null);
    setApiMessage(null);

    try {
      const response = await registerMutation.mutateAsync(data);
      setApiMessage(
        response?.data?.message || t("auth.register2.account_created")
      );
      router.push(
        `/verify-otp?intent=verify-email&email=${encodeURIComponent(data.email)}`,
      );
      router.refresh();
    } catch (error) {
      if (error instanceof ApiClientError) {
        setApiError(error.getMessage());
        return;
      }
      setApiError(t("auth.register2.connection_failed"));
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

      <ChangeLocale />

      <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl ">
              {t("auth.register")}
            </h1>
            <p className="text-sm text-muted-foreground font-mono">
              {t("auth.register2.start_your_journey")}
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setViewMode("visual")}
              className={cn(
                " cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border font-mono text-[10px] uppercase transition-all",
                viewMode === "visual"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card/40 text-muted-foreground",
              )}
            >
              <Eye className="h-3 w-3" /> {t("auth.register2.visual")}
            </button>
            <button
              onClick={() => setViewMode("terminal")}
              className={cn(
                " cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border font-mono text-[10px] uppercase transition-all",
                viewMode === "terminal"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card/40 text-muted-foreground",
              )}
            >
              <TerminalIcon className="h-3 w-3" /> {t("auth.register2.terminal")}
            </button>
          </div>

          {viewMode === "visual" ? (
            <div className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pl-1">
                    {t("auth.register2.name")}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Coder Smith"
                      {...register("name")}
                      className="w-full bg-card/40 border border-border rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary/50 transition-all font-mono text-sm"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pl-1">
                    {t("auth.register2.email")}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="coder@nt.io"
                      {...register("email")}
                      className="w-full bg-card/40 border border-border rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary/50 transition-all font-mono text-sm"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pl-1">
                    {t("auth.register2.password")}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password")}
                      className="w-full bg-card/40 border border-border rounded-xl py-3 pl-10 pr-12 outline-none focus:border-primary/50 transition-all font-mono text-sm"
                    />
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
                  {errors.password && (
                    <p className="text-red-500 text-xs">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Privacy Agreement Checkbox */}
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      {...register("privacyAgreed")}
                      className="w-5 h-5 rounded border border-border bg-card/40 cursor-pointer accent-primary"
                    />
                    <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                      {t("auth.register2.privacy_agreement")}{" "}
                      <Link
                        href="/privacy-policy"
                        target="_blank"
                        className="text-primary font-bold hover:underline"
                      >
                        {t("auth.register2.privacy_policy")}
                      </Link>
                    </span>
                  </label>
                  {errors.privacyAgreed && (
                    <p className="text-red-500 text-xs">
                      {errors.privacyAgreed.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || registerMutation.isPending}
                  className="cursor-pointer w-full rounded-xl bg-primary py-3.5 font-mono text-sm font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting || registerMutation.isPending
                    ? t("auth.register2.processing")
                    : t("auth.register2.registerAndVlidate")}
                </button>
                {apiError && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-mono text-red-400">
                    {apiError}
                  </div>
                )}
                {apiMessage && (
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-mono text-emerald-400">
                    {apiMessage}
                  </div>
                )}
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-background px-2 text-muted-foreground font-mono">
                    {t("auth.register2.or_register_with")}
                  </span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <SocialButtons />

              <div className="text-center pt-2">
                <p className="text-xs text-muted-foreground font-mono">
                  {t("auth.register2.already_have_account")}{" "}
                  <Link
                    href="/login"
                    className="text-primary font-bold hover:underline"
                  >
                    {t("auth.register2.login_here")}
                  </Link>
                </p>
              </div>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 flex gap-3">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                <p className="text-[10px] leading-relaxed text-muted-foreground">
                  {t("auth.register2.message")}
                </p>
              </div>
            </div>
          ) : (
            <TerminalAuth mode="register" onSwitchMode={setViewMode} />
          )}
        </div>
      </div>
    </main>
  );
}
