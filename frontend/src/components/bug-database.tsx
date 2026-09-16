"use client";

import { cn } from "@/lib/utils";
import { Bug, ArrowUpRight, MessageSquare, ThumbsUp } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const recentBugs = [
  {
    id: 1,
    title: "Memory Leak in React 19 useEffect",
    description:
      "Unexpected closure retention when using async functions inside useEffect.",
    votes: 124,
    comments: 18,
    status: "solved",
  },
  {
    id: 2,
    title: "Next.js 16 Hydration Mismatch",
    description:
      "Mismatched timestamp rendering between server and client in dynamic routes.",
    votes: 89,
    comments: 12,
    status: "disputed",
  },
  {
    id: 3,
    title: "Tailwind 4 CSS Variable Conflict",
    description:
      "Collision between legacy CSS variables and the new T4 design tokens.",
    votes: 56,
    comments: 7,
    status: "active",
  },
];

export function BugDatabase() {
  const { t } = useTranslation();
  return (
    <section
      id="bug-database"
      className="px-4 sm:px-6 py-20 sm:py-28 border-t border-border/30"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 sm:mb-14 space-y-3 animate-fade-in-up">
          <p className="font-mono text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-primary">
            {t("bugs.kicker")}
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t("bugs.title")}
          </h2>
          <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            {t("bugs.description")}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card/40 glass backdrop-blur-sm overflow-hidden hover-lift animate-scale-in stagger-2">
          {/* Terminal header */}
          <div className="flex items-center gap-3 border-b border-border/50 bg-secondary/40 px-4 sm:px-5 py-3.5 sm:py-4">
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs text-muted-foreground truncate">
                bug-database://recent-reports
              </span>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-2 text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-xs">
                {t("bugs.database_active")}
              </span>
            </div>
          </div>

          <div className="divide-y divide-border/30">
            {recentBugs.map((bug, index) => (
              <div
                key={bug.id}
                className="group flex flex-col gap-4 p-5 sm:p-6 transition-all duration-300 sm:flex-row sm:items-center sm:justify-between hover:bg-secondary/30 animate-fade-in"
                style={{ animationDelay: `${index * 100 + 400}ms` }}
              >
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-primary shrink-0">
                      #00{bug.id}
                    </span>
                    <h4 className="font-mono text-sm font-medium tracking-tight transition-colors group-hover:text-gradient truncate">
                      {bug.title}
                    </h4>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider",
                        bug.status === "solved"
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30",
                      )}
                    >
                      {t(`bugs.status.${bug.status}`)}
                    </span>
                  </div>
                  <p className="pl-0 text-xs text-muted-foreground line-clamp-2 sm:line-clamp-1">
                    {bug.description}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span className="font-mono text-xs">{bug.votes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span className="font-mono text-xs">{bug.comments}</span>
                    </button>
                  </div>
                  <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-border group-hover:border-primary/50 transition-colors">
                    <ArrowUpRight className="h-4 w-4 group-hover:text-primary transition-colors" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border/50 bg-secondary/30 px-4 sm:px-5 py-4">
            <div className="flex items-center gap-2 font-mono text-xs text-primary transition-all duration-300">
              <span className="underline-animate cursor-pointer">
                Ver todos os relatos de erros →
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
