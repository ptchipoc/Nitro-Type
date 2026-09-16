"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { useTranslation } from "@/lib/i18n";
import { CursorGlow } from "@/components/cursor-glow";
import { EventsCarousel } from "@/features/events/components/EventsCarousel";
import { useGetRecentXpTransations } from "@/features/users/hooks/user-get-recent-xp-transations.hook";
import { userGetMeHook } from "@/features/users/hooks/user-get-me.hook";
import { EventsShowcase } from "./components/EventsShowCase";
import { Footer } from "@/components/footer";

const labelsByLocale = {
  pt: {
    featuredOfficial: "Destaque Oficial",
    basePrize: "Prémio Base",
    legendaryReward: "500 XP + Troféu Lendário",
    participants: "Inscritos",
    joinNow: "Participar Agora",
    viewDetails: "Ver Detalhes",
    startsIn: "Inicia em",
    xpValid: "XP Válida para rank global",
    tabs: {
      ALL: "Todos",
      PUBLIC: "Oficiais",
      PRIVATE: "Casuais",
      MINE: "Meus",
    },
    searchPlaceholder: "Pesquisar eventos...",
    filters: "Filtros",
    createEvent: "Criar Evento",
    noEventsTitle: "Nenhum evento encontrado",
    noEventsDesc:
      "Tenta ajustar os teus filtros ou pesquisa para encontrar o que procuras.",
  },
  en: {
    featuredOfficial: "Official Highlight",
    basePrize: "Base Prize",
    legendaryReward: "500 XP + Legendary Trophy",
    participants: "Participants",
    joinNow: "Join Now",
    viewDetails: "View Details",
    startsIn: "Starts in",
    xpValid: "XP valid for global rank",
    tabs: { ALL: "All", PUBLIC: "Official", PRIVATE: "Casual", MINE: "Mine" },
    searchPlaceholder: "Search events...",
    filters: "Filters",
    createEvent: "Create Event",
    noEventsTitle: "No events found",
    noEventsDesc:
      "Try adjusting your filters or search to find what you are looking for.",
  },
  fr: {
    featuredOfficial: "Sélection officielle",
    basePrize: "Prix de base",
    legendaryReward: "500 XP + Trophée légendaire",
    participants: "Inscrits",
    joinNow: "Participer maintenant",
    viewDetails: "Voir les détails",
    startsIn: "Commence dans",
    xpValid: "XP valable pour le classement global",
    tabs: { ALL: "Tous", PUBLIC: "Officiels", PRIVATE: "Casual", MINE: "Mes" },
    searchPlaceholder: "Rechercher des événements...",
    filters: "Filtres",
    createEvent: "Créer un événement",
    noEventsTitle: "Aucun événement trouvé",
    noEventsDesc:
      "Essayez d'ajuster vos filtres ou votre recherche pour trouver ce que vous cherchez.",
  },
};

export default function EventsPage() {
  const { locale } = useTranslation();
  const labels = labelsByLocale[locale];
  const { data } = useGetRecentXpTransations();
  const { data: user } = userGetMeHook();
  const progress = user?.data?.progress;

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden scanlines">
      <Header />
      <CursorGlow />
      <main className="flex-1 pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-column gap-8">
          <EventsShowcase
            totalXp={progress?.totalXp || 0}
            rank={progress?.rank || 0}
            totalEvents={progress?.totalEvents || 0}
            eventsWon={progress?.eventsWon || 0}
          />
          <EventsCarousel locale={locale} labels={labels} />
        </div>

        {/* ── MAIN CONTENT GRID ────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 mx-auto mt-12">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* ── RECENT XP TRANSACTIONS ───────────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                  Últimos XP
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="bg-card/60 glass border border-border rounded-sm divide-y divide-border">
                {data?.data.map((tx) => {
                  return (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${tx.amount > 0 ? "bg-green-500" : "bg-red-500"}`}
                        />
                        <div>
                          <span className="text-xs font-mono text-foreground capitalize">
                            {tx.reason.replace(/_/g, " ")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {new Date(tx.createdAt).toLocaleDateString("pt", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                        <span
                          className={`text-xs font-mono font-bold ${tx.amount > 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          +{tx.amount} XP
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
