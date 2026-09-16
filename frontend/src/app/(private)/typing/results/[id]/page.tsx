"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CursorGlow } from "@/components/cursor-glow";
import { useTranslation } from "@/lib/i18n";
import { labelsByLocale } from "../../components/constants";
import { TypingSessionResultById } from "@/features/typing/type";
import { useTypingGetResults } from "@/features/typing/hooks/typing-get-results.hook";

// Extracted components and config
import { createStatusThemes } from "../components/config";
import { StatusHero } from "../components/StatusHero";
import { PrimaryStats } from "../components/PrimaryStats";
import { ProgressionSidebar } from "../components/ProgressionSidebar";
import { TypingSessionStatus } from "@/features/typing/type";

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { locale } = useTranslation();
  const id = params.id as string;

  const labels = labelsByLocale[locale as keyof typeof labelsByLocale] || labelsByLocale.en;

  const { data, isLoading, error } = useTypingGetResults(id);

  const statusThemes = createStatusThemes(labels);

  if (isLoading || !data?.data) {
    return (
      <main className="relative min-h-screen overflow-hidden scanlines bg-background/95 flex items-center justify-center">
        <CursorGlow />
        <div className="relative flex flex-col items-center gap-6">
          <div className="relative">
            <div className="h-16 w-16 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            <Zap className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary animate-pulse">
            Decrypting Mission Data...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="relative min-h-screen overflow-hidden scanlines bg-background/95 flex items-center justify-center px-6">
        <CursorGlow />
        <div className="flex flex-col items-center text-center gap-8">
          <div className="relative">
            <div className="h-20 w-20 rounded-sm border border-destructive/20 bg-destructive/5 flex items-center justify-center glass">
              <Zap className="h-10 w-10 text-destructive opacity-50" />
            </div>
            <div className="absolute -top-2 -right-2 h-6 w-6 bg-destructive rounded-full flex items-center justify-center border-2 border-background animate-bounce">
              <span className="text-[10px] font-bold text-white">!</span>
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold uppercase tracking-tight text-destructive font-mono">
              Mission Data Corrupted
            </h2>
            <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-[0.2em] max-w-xs mx-auto leading-relaxed">
              A integridade dos logs de sessão foi perdida. O terminal não consegue recuperar este registro.
            </p>
          </div>
          <button
            onClick={() => router.push("/typing")}
            className="group relative px-10 py-4 overflow-hidden rounded-sm bg-background border border-border transition-all hover:border-primary/50 shadow-lg"
          >
            <div className="absolute inset-0 bg-primary/5 translate-y-full transition-transform group-hover:translate-y-0" />
            <span className="relative z-10 text-xs font-mono font-bold uppercase tracking-[0.2em] text-foreground group-hover:text-primary transition-colors">
              Return to Terminal
            </span>
          </button>
        </div>
      </main>
    );
  }

  const result = data.data;
  const theme =
    statusThemes[result.status as TypingSessionStatus] ||
    statusThemes[TypingSessionStatus.COMPLETED];

  return (
    <main className="relative min-h-screen overflow-hidden scanlines bg-background/95">
      <CursorGlow />
      <div className="relative z-10 w-full">
        <Header />

        <div className="pt-32 pb-20 px-6 lg:px-24 max-w-7xl mx-auto min-h-screen flex flex-col items-center">
          <StatusHero
            theme={theme}
            id={id}
            completedAt={result.completedAt as string}
            labels={{
              performance: labels.performance,
              summary: labels.summary,
              session: labels.session,
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full mt-8">
            <PrimaryStats result={result} theme={theme} />

            <ProgressionSidebar result={result} theme={theme} />
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
