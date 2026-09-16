"use client";
import { motion } from "framer-motion";
import {
  Terminal,
  Keyboard,
  Users,
  Trophy,
  ArrowRight,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CursorGlow } from "@/components/cursor-glow";
import { useTranslation } from "@/lib/i18n";
import {
  generateWebsiteStructuredData,
  generatePersonStructuredData,
} from "@/lib/structured-data";
import { HeaderPublic } from "@/components/header-public";

export default function Home() {
  const { t } = useTranslation();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eindev.ir";
  const websiteStructuredData = generateWebsiteStructuredData(baseUrl);
  const personStructuredData = generatePersonStructuredData();

  const ranks = [
    t("home_page.rank_1"),
    t("home_page.rank_2"),
    t("home_page.rank_3"),
    t("home_page.rank_4"),
    t("home_page.rank_5"),
    t("home_page.rank_6"),
    t("home_page.rank_7"),
    t("home_page.rank_8"),
    t("home_page.rank_9"),
    t("home_page.rank_10"),
  ];

  const features = [
    {
      icon: Keyboard,
      title: t("home_page.feature_typing_practice_title"),
      desc: t("home_page.feature_typing_practice_desc"),
    },
    {
      icon: Users,
      title: t("home_page.feature_community_title"),
      desc: t("home_page.feature_community_desc"),
    },
    {
      icon: Trophy,
      title: t("home_page.feature_events_title"),
      desc: t("home_page.feature_events_desc"),
    },
    {
      icon: Zap,
      title: t("home_page.feature_stats_title"),
      desc: t("home_page.feature_stats_desc"),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personStructuredData),
        }}
      />
      <main className="relative min-h-screen overflow-hidden scanlines">
        <CursorGlow />
        <div className="relative z-10">
          <HeaderPublic />

          <div className="pt-16">
            {/* Hero */}
            <section className="relative min-h-[90vh] flex items-center border-b border-border">
              <div className="container relative z-10 px-4 md:px-6">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-3xl"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-xs tracking-[0.3em] text-muted-foreground">
                      {t("home_page.tagline")}
                    </span>
                  </div>

                  <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-widest">
                    {t("home_page.hero_title_1")}
                    <br />
                    <span className="text-primary">{t("home_page.hero_title_2")}</span>
                    <br />
                    {t("home_page.hero_title_3")}
                    <br />
                    <span className="text-primary">{t("home_page.hero_title_4")}</span>
                  </h1>

                  <p className="text-muted-foreground text-lg max-w-xl mb-10 leading-relaxed">
                    {t("home_page.hero_description")}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/typing"
                      className="rounded-lg group flex items-center gap-3 border-2 border-primary bg-primary text-primary-foreground px-8 py-4 font-display text-sm tracking-wider transition-all hover:bg-transparent hover:text-primary"
                    >
                      {t("home_page.start_typing")}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/login"
                      className="rounded-lg flex items-center gap-3 border border-border px-8 py-4 font-display text-sm tracking-wider transition-colors hover:border-primary hover:text-primary"
                    >
                      {t("home_page.login")}
                    </Link>
                  </div>
                </motion.div>

                {/* Decorative grid */}
                <div className="absolute top-0 right-0 hidden lg:grid grid-cols-5 gap-px opacity-10">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="w-12 h-12 border border-primary"
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="py-24 border-b border-border">
              <div className="container px-4 md:px-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border"
                >
                  {features.map((feat, i) => (
                    <motion.div
                      key={feat.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-background p-8 group hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                    >
                      <feat.icon className="h-8 w-8 mb-6 text-primary group-hover:text-primary-foreground" />
                      <h3 className="font-bold text-sm tracking-wider mb-3">
                        {feat.title}
                      </h3>
                      <p className="text-sm opacity-60 leading-relaxed">
                        {feat.desc}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* Rank System Preview */}
            <section className="py-24 border-b border-border">
              <div className="container px-4 md:px-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <h2 className="font-display text-4xl font-bold mb-2">
                    {t("home_page.ranking_system_title")}
                  </h2>
                  <p className="text-muted-foreground mb-12 text-sm tracking-wider">
                    {t("home_page.ranking_system_subtitle")}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-border">
                    {ranks.map((rank, i) => (
                      <motion.div
                        key={rank}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-background p-6 text-center border border-transparent hover:border-primary transition-all group"
                      >
                        <div className="font-display text-3xl font-bold mb-2 opacity-20 group-hover:opacity-100 group-hover:text-primary">
                          {10 - i}
                        </div>
                        <div className="text-xs tracking-wider font-bold">
                          {rank.toUpperCase()}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          LVL 1-10
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>

            {/* CTA */}
            <section className="py-24">
              <div className="container text-center px-4 md:px-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className=""
                >
                  <h2 className="font-display text-5xl font-bold mb-6">
                    {t("home_page.ready_to_compete")}
                    <br />
                    {t("home_page.ready_to_compete_2")}
                  </h2>
                  <Link
                    href="/login"
                    className="rounded-lg inline-flex items-center gap-3 border-2 border-primary bg-primary text-primary-foreground px-10 py-5 font-display text-sm tracking-wider transition-all hover:bg-transparent hover:text-primary"
                  >
                    {t("home_page.create_account")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </div>
            </section>
          </div>

          <Footer />
        </div>
      </main>
    </>
  );
}
