"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CursorGlow } from "@/components/cursor-glow";
import { useTranslation } from "@/lib/i18n";
import {
  TypingCategory,
  TypingDifficulty,
} from "@/lib/api/endpoints/typing/typing.type";
import { useTypingCreateSession } from "@/features/typing/hooks/typing-create-session.hook";
import { TypingSessionCategory, TypingSessionDifficulty } from "@/features/typing/type";
import { useUserResults } from "@/hooks/use-typing";

// Extracted components and constants
import { labelsByLocale } from "./components/constants";
import { SessionConfig } from "./components/SessionConfig";
import { ModuleStatus } from "./components/ModuleStatus";
import { RecentActivity } from "./components/RecentActivity";
import { userGetMeHook } from "@/features/users/hooks/user-get-me.hook";

export default function TypingPage() {
  const { locale } = useTranslation();
  const labels =
    labelsByLocale[locale as keyof typeof labelsByLocale] || labelsByLocale.en;
  const router = useRouter();

  const { data: results, isLoading: isLoadingResults } = useUserResults();
  const { data: userData, isLoading: isLoadingUserData } = userGetMeHook();

  const [selectedCategory, setSelectedCategory] = useState<TypingCategory>(
    TypingCategory.ANIME,
  );
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<TypingDifficulty>(TypingDifficulty.EASY);
  const [isScaling, setIsScaling] = useState(false);

  const { mutate: createSession, isPending } = useTypingCreateSession();

  // Stats calculation from real data
  const averageWpm =
    results && results.length > 0
      ? Math.round(
        results.reduce((acc, session) => acc + session.wpm, 0) /
        results.length,
      )
      : 0;

  const averageAccuracy =
    results && results.length > 0
      ? Math.round(
        (results.reduce((acc, session) => acc + session.accuracy, 0) /
          results.length) *
        10,
      ) / 10
      : 0;

  const totalXp = results?.reduce((acc, r) => acc + r.xpEarned, 0) ?? 0;
  const currentLevel = Math.floor(totalXp / 500) + 1;

  const getRankTitle = (lvl: number) => {
    if (lvl < 5) return "Novice Coder";
    if (lvl < 10) return "Script Junior";
    if (lvl < 20) return "Syntax Ninja";
    if (lvl < 35) return "Binary Master";
    return "Kernel Architect";
  };

  const rankTitle = getRankTitle(currentLevel);

  const categoryMap: Record<TypingCategory, TypingSessionCategory> = {
    [TypingCategory.ANIME]: TypingSessionCategory.ANIME,
    [TypingCategory.FUNCTIONS]: TypingSessionCategory.FUNCTIONS,
    [TypingCategory.ALGORITHMS]: TypingSessionCategory.ALGORITHMS,
  };

  const difficultyMap: Record<TypingDifficulty, TypingSessionDifficulty> = {
    [TypingDifficulty.EASY]: TypingSessionDifficulty.EASY,
    [TypingDifficulty.MEDIUM]: TypingSessionDifficulty.MEDIUM,
    [TypingDifficulty.HARD]: TypingSessionDifficulty.HARD,
    [TypingDifficulty.EXTREME]: TypingSessionDifficulty.HARD,
  };

  const startSoloGame = () => {
    createSession(
      {
        category: categoryMap[selectedCategory],
        difficulty: difficultyMap[selectedDifficulty],
      },
      {
        onSuccess: (response) => {
          router.push(`/typing/arena?sectionId=${response.data.id}`);
        },
        onError: (error) => {
          console.error("Error starting solo game:", error);
        },
      }
    );
  };

  const sessionsToday =
    results
      ?.filter((r) => {
        const d = new Date(r.createdAt);
        const today = new Date();
        return (
          d.getDate() === today.getDate() &&
          d.getMonth() === today.getMonth() &&
          d.getFullYear() === today.getFullYear()
        );
      })
      .length.toString() ?? "0";

  // Get last session stats (most recent)
  const lastSession = results && results.length > 0 ? results[0] : null;
  const lastSessionWpm = lastSession ? Math.round(lastSession.wpm) : 0;
  const lastSessionAccuracy = lastSession ? Math.round(lastSession.accuracy * 10) / 10 : 0;

  return (
    <main className="relative min-h-screen overflow-hidden scanlines">
      <CursorGlow />
      <div className="relative z-10">
        <Header />

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 sm:pt-36">
          <div className="mb-10 space-y-3 sm:mb-14">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {labels.title}
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {labels.description}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <SessionConfig
                labels={labels}
                locale={locale}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedDifficulty={selectedDifficulty}
                setSelectedDifficulty={setSelectedDifficulty}
                isScaling={isScaling}
                startSoloGame={startSoloGame}
              />
            </div>

            <div className="space-y-6 lg:col-span-5">
              <ModuleStatus
                labels={labels}
                totalUserXp={userData?.data?.progress?.totalXp || 0}
                userRank={userData?.data?.progress?.rank || 0}
                lastSessionWpm={lastSessionWpm}
                lastSessionAccuracy={lastSessionAccuracy}
                sessionsToday={sessionsToday}
                currentLevel={userData?.data?.progress?.level || currentLevel}
                rankTitle={userData?.data?.progress?.rankTitle || rankTitle}
                totalXp={totalXp}
              />

              <RecentActivity
                labels={labels}
                results={results}
                isLoadingResults={isLoadingResults}
              />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
