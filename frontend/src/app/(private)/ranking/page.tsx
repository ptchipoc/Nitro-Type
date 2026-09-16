"use client";

import { useGetRankingGlobal } from "@/features/users/hooks/user-get-ranking-global.hook";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CursorGlow } from "@/components/cursor-glow";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { RankingHero } from "./components/RankingHero";
import { RankingPodium } from "./components/RankingPodium";
import { RankingTable } from "./components/RankingTable";
import { RankingLoading } from "./components/RankingLoading";
import { RankingError } from "./components/RankingError";

export default function RankingPage() {
  const { data, isLoading, isError } = useGetRankingGlobal();
  const { t, locale } = useTranslation();

  const ranking = data?.data || [];
  const topThree = ranking.slice(0, 3);
  const remaining = ranking.slice(3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-mono text-foreground overflow-x-hidden scanlines">
      <Header />
      <CursorGlow />

      <main className="flex-1 pt-24 pb-12 px-4 md:px-8 max-w-6xl mx-auto w-full">
        <RankingHero />

        {isLoading ? (
          <RankingLoading />
        ) : isError ? (
          <RankingError />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            <RankingPodium topThree={topThree} />
            <RankingTable remaining={remaining} />
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
