"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/header";
import {
  Trophy,
  ArrowLeft,
  ChevronUp,
  Star,
  Users,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { useUser } from "@/hooks/use-user";
import { MedalType } from "@/lib/api/endpoints/events/event.type";
import { useEvent } from "@/features/events/hooks/use-event";
import { useEventRanking } from "@/features/events/hooks/use-event-ranking";
import { TypingEvent } from "@/features/events/types";
import PodiumPosition from "./components/PodiumPosition";

import { labelsByLocale } from "../../components/details/constants";

interface EventFinishResultsProps {
  eventId: string;
}

const getParticipant = (event: TypingEvent, userId: string) => {
  const participant = event.participants.find((p) => p.userId === userId);
  return participant || null;
}

export default function EventFinishResults({
  eventId,
}: EventFinishResultsProps) {
  const { locale } = useTranslation();
  const labels =
    labelsByLocale[locale as keyof typeof labelsByLocale] || labelsByLocale.en;
  const router = useRouter();
  const { data: currentUser } = useUser();
  const { data: result, isLoading: isLoadingEvent } = useEvent(eventId);
  const { data: resultRanking, isLoading: isLoadingRanking } =
    useEventRanking(eventId);

  const event = result?.data;
  const rankingData = resultRanking?.data;
  const [showPodium, setShowPodium] = useState(false);
  const [showRewards, setShowRewards] = useState(false);

  useEffect(() => {
    if (!isLoadingRanking && rankingData) {
      const podiumTimer = window.setTimeout(() => setShowPodium(true), 500);
      const rewardsTimer = window.setTimeout(() => setShowRewards(true), 2500);
      return () => {
        window.clearTimeout(podiumTimer);
        window.clearTimeout(rewardsTimer);
      };
    }
  }, [isLoadingRanking, rankingData]);

  if (isLoadingEvent || isLoadingRanking) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-mono">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <span className="text-xs uppercase tracking-widest opacity-50">
          {labels.syncingRankings}
        </span>
      </div>
    );
  }

  if (!event || !rankingData) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-mono">
        <span className="text-red-500 text-xs uppercase">
          {labels.errorEventNotFound}
        </span>
        <Button
          variant="link"
          onClick={() => router.push("/events")}
          className="mt-4"
        >
          Voltar
        </Button>
      </div>
    );
  }

  const ranking = rankingData.ranking;
  const userRank = ranking.find((r) => r.userId === currentUser?.id);

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden scanlines">
      <Header />

      <main className="flex-1 pt-24 pb-24 px-4 md:px-8 max-w-6xl mx-auto w-full">
        {/* Podium Section */}
        <section className="mb-20">
          <div className="text-center">
            <h1 className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-primary mb-2">
              {labels.officialResults}
            </h1>
            <h2 className="text-2xl font-mono font-bold uppercase tracking-tighter">
              {event.name}
            </h2>
          </div>

          <div className="flex justify-center items-end gap-2 md:gap-8 h-[210px] pt-12">
            {/* 3rd Place */}
            {ranking[2] && (
              <PodiumPosition
                participant={getParticipant(event, ranking[2].userId)}
                rank={3}
                height="h-[140px]"
                delay={1}
                show={showPodium}
              />
            )}
            {/* 1st Place */}
            {ranking[0] && (
              <PodiumPosition
                participant={getParticipant(event, ranking[0].userId)}
                rank={1}
                height="h-[180px]"
                delay={1.8}
                show={showPodium}
                isWinner
              />
            )}
            {/* 2nd Place */}
            {ranking[1] && (
              <PodiumPosition
                participant={getParticipant(event, ranking[1].userId)}
                rank={2}
                height="h-[160px]"
                delay={1.4}
                show={showPodium}
              />
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* USER PERFORMANCE (Left) */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.2 }}
              className="p-6 rounded-sm border border-primary/20 bg-primary/5 glass relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3 opacity-20">
                <Star className="h-12 w-12 text-primary fill-primary" />
              </div>

              <div className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest mb-6">
                {labels.yourPerformance}
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-sm border border-primary/30 bg-primary/10 flex items-center justify-center text-xl font-mono font-bold text-primary">
                  #{userRank?.rank || "-"}
                </div>
                <div>
                  <h3 className="font-mono font-bold text-lg leading-none mb-1">
                    {currentUser?.name || "Tu"}
                  </h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-tighter">
                    {userRank ? labels.statusFinished : labels.statusUnranked}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-muted-foreground uppercase">
                    {labels.totalScore}
                  </span>
                  <div className="text-xl font-mono font-bold">
                    {userRank?.totalScore.toFixed(1) || "0"}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">
                    {labels.medal}
                  </span>
                  <div className="text-xl font-mono font-bold uppercase text-amber-500">
                    {userRank?.medal || labels.none}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border/10 flex flex-col gap-3">
                <Button
                  variant="ghost"
                  className="w-full h-11 font-mono text-xs opacity-50 hover:opacity-100 cursor-pointer"
                  onClick={() => router.push("/events")}
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-2" /> {labels.back}
                </Button>
              </div>
            </motion.div>
          </div>

          {/* FULL RANKING (Right) */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5 }}
              className="rounded-sm border border-border bg-card/20 overflow-hidden glass mt-3"
            >
              <div className="px-6 py-4 border-b border-border bg-muted/10 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                {labels.fullRanking}
                <Users className="h-3.5 w-3.5" />
              </div>

              {/* Desktop: Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border/50 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                      <th className="px-6 py-4 font-bold">{labels.rank}</th>
                      <th className="px-6 py-4 font-bold">User</th>
                      <th className="px-6 py-4 font-bold text-right">
                        {labels.score}
                      </th>
                      <th className="px-6 py-4 font-bold text-right">
                        {labels.medal}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-[11px]">
                    {ranking.map((p, i) => (
                      <tr
                        key={p.userId}
                        className={cn(
                          "border-b border-border/20 last:border-0 hover:bg-muted/5 transition-colors",
                          p.userId === currentUser?.id &&
                          "bg-primary/5 border-primary/20",
                        )}
                      >
                        <td className="px-6 py-4 font-bold">
                          <div className="flex items-center gap-2">
                            {i === 0
                              ? "🥇"
                              : i === 1
                                ? "🥈"
                                : i === 2
                                  ? "🥉"
                                  : `#${p.rank}`}
                            {p.userId === currentUser?.id && (
                              <ChevronUp className="h-3 w-3 text-green-500" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-foreground">
                            {event.participants
                              .find((u) => u.userId === p.userId)
                              ?.user.name.substring(0, 42)}
                            ...
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-foreground">
                          {p.totalScore.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={cn(
                              "font-bold uppercase text-[10px]",
                              p.medal === MedalType.GOLD
                                ? "text-amber-500"
                                : p.medal === MedalType.SILVER
                                  ? "text-slate-400"
                                  : p.medal === MedalType.BRONZE
                                    ? "text-amber-700"
                                    : "text-muted-foreground/30",
                            )}
                          >
                            {p.medal || "-"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile: Card View */}
              <div className="md:hidden space-y-3 p-4">
                {ranking.map((p, i) => (
                  <motion.div
                    key={p.userId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.5 + i * 0.1 }}
                    className={cn(
                      "p-4 rounded-sm border border-border/50 bg-muted/5 transition-colors",
                      p.userId === currentUser?.id &&
                      "bg-primary/10 border-primary/30",
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-mono font-bold">
                          {i === 0
                            ? "🥇"
                            : i === 1
                              ? "🥈"
                              : i === 2
                                ? "🥉"
                                : `#${p.rank}`}
                        </span>
                        <span className="font-mono font-bold text-foreground">
                          {event.participants
                            .find((u) => u.userId === p.userId)
                            ?.user.name.substring(0, 24)}
                        </span>
                        {p.userId === currentUser?.id && (
                          <ChevronUp className="h-4 w-4 text-green-500 ml-auto" />
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 font-mono text-[10px]">
                      <div>
                        <p className="text-muted-foreground uppercase mb-1">
                          {labels.score}
                        </p>
                        <p className="font-bold text-lg text-foreground">
                          {p.totalScore.toFixed(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground uppercase mb-1">
                          {labels.medal}
                        </p>
                        <p
                          className={cn(
                            "font-bold uppercase text-sm",
                            p.medal === MedalType.GOLD
                              ? "text-amber-500"
                              : p.medal === MedalType.SILVER
                                ? "text-slate-400"
                                : p.medal === MedalType.BRONZE
                                  ? "text-amber-700"
                                  : "text-muted-foreground/30",
                          )}
                        >
                          {p.medal || "-"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

