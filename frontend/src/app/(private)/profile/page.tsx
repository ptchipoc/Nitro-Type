"use client";

import { useTranslation } from "@/lib/i18n";
import { Header } from "@/components/header";
import { CursorGlow } from "@/components/cursor-glow";
import { ProfileHero } from "./components/ProfileHero";
import { ProfileSections } from "./components/ProfileSections";
import { userGetMeHook } from "@/features/users/hooks/user-get-me.hook";
import { useUserResults } from "@/hooks/use-typing";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Footer } from "@/components/footer";

  
// ─── components ───────────────────────────────────────────────────────────────

function ProfileLoading() {
  return (
    <div className="min-h-screen pb-10 scanlines bg-background">
      <div className="p-6 max-w-6xl mx-auto space-y-8 mt-20">
        <Skeleton className="h-[200px] w-full rounded-sm" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
          <div className="space-y-6">
            <Skeleton className="h-[300px] w-full rounded-sm" />
            <Skeleton className="h-[200px] w-full rounded-sm" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[400px] w-full rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── constants ────────────────────────────────────────────────────────────────

const moduleNames: Record<string, string> = {
  typing: "Typing Code",
  competitive: "Prog. Competitiva",
  learning: "Learn Programming",
  bugs: "Learning from Bugs",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Profile() {
  const { locale } = useTranslation();
  const { data: response, isLoading: isLoadingUser } = userGetMeHook();
  const { data: results, isLoading: isLoadingResults } = useUserResults();
  

  const user = response?.data;

  if (isLoadingUser) {
    return <ProfileLoading />;
  }

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
    })
    : "---";

  return (
    <div className="min-h-screen pb-10 scanlines">
      <CursorGlow />
      <div className="p-6 max-w-6xl mx-auto space-y-5">
        <Header />

        <ProfileHero
          user={user}
          memberSince={memberSince}
          moduleNames={moduleNames}
        />

        <ProfileSections
          locale={locale as "pt" | "en" | "fr"}
          user={user}
          results={results}
          moduleNames={moduleNames}
        />
      </div>
      <Footer />
    </div>
  );
}
