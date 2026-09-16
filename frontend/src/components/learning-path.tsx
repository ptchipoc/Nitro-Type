"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, BookOpen, GraduationCap, Code2, Cpu } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const pathContentByLocale = {
  pt: {
    kicker: "Caminho de Aprendizado",
    title: "Trilhas Recentes",
    description:
      "Progresso estruturado e objetivos técnicos alcançados recentemente na plataforma.",
    continue: "continuar trilha",
    paths: [
      {
        id: 1,
        title: "Fundamentos de Sistemas",
        excerpt:
          "Aprendizagem sobre compilação de kernel, configuração de BusyBox e criação de ISOs bootáveis.",
        date: "Mar 2026",
        category: "sistemas",
        icon: Cpu,
        color: "from-blue-500/20 to-cyan-500/20",
      },
      {
        id: 2,
        title: "Arquitetura de LLMs",
        excerpt:
          "Implementação do Model Context Protocol para interações fluidas entre modelos de IA e bases vetoriais.",
        date: "Mar 2026",
        category: "IA",
        icon: GraduationCap,
        color: "from-purple-500/20 to-pink-500/20",
      },
      {
        id: 3,
        title: "Next.js 16 & Clean Code",
        excerpt:
          "Exploração das novas funcionalidades do Next.js 16 e aplicação de padrões de código limpo.",
        date: "Mar 2026",
        category: "frontend",
        icon: Code2,
        color: "from-primary/20 to-emerald-500/20",
      },
    ],
  },
  en: {
    kicker: "Learning Path",
    title: "Recent Tracks",
    description:
      "Structured progress and technical goals recently achieved on the platform.",
    continue: "continue track",
    paths: [
      {
        id: 1,
        title: "Systems Fundamentals",
        excerpt:
          "Learning about kernel compilation, BusyBox configuration, and building bootable ISOs.",
        date: "Mar 2026",
        category: "systems",
        icon: Cpu,
        color: "from-blue-500/20 to-cyan-500/20",
      },
      {
        id: 2,
        title: "LLM Architecture",
        excerpt:
          "Implementing the Model Context Protocol for smooth interactions between AI models and vector databases.",
        date: "Mar 2026",
        category: "ai",
        icon: GraduationCap,
        color: "from-purple-500/20 to-pink-500/20",
      },
      {
        id: 3,
        title: "Next.js 16 & Clean Code",
        excerpt:
          "Exploring Next.js 16 features and applying clean code patterns.",
        date: "Mar 2026",
        category: "frontend",
        icon: Code2,
        color: "from-primary/20 to-emerald-500/20",
      },
    ],
  },
  fr: {
    kicker: "Parcours d'apprentissage",
    title: "Parcours récents",
    description:
      "Progrès structuré et objectifs techniques récemment atteints sur la plateforme.",
    continue: "continuer le parcours",
    paths: [
      {
        id: 1,
        title: "Fondamentaux des systèmes",
        excerpt:
          "Apprentissages sur la compilation du noyau, la configuration de BusyBox et la création d'ISO amorçables.",
        date: "Mar 2026",
        category: "systèmes",
        icon: Cpu,
        color: "from-blue-500/20 to-cyan-500/20",
      },
      {
        id: 2,
        title: "Architecture des LLMs",
        excerpt:
          "Mise en œuvre du Model Context Protocol pour des interactions fluides entre modèles d'IA et bases vectorielles.",
        date: "Mar 2026",
        category: "ia",
        icon: GraduationCap,
        color: "from-purple-500/20 to-pink-500/20",
      },
      {
        id: 3,
        title: "Next.js 16 & Code propre",
        excerpt:
          "Exploration des nouvelles fonctionnalités de Next.js 16 et application de patterns de code propre.",
        date: "Mar 2026",
        category: "frontend",
        icon: Code2,
        color: "from-primary/20 to-emerald-500/20",
      },
    ],
  },
};

export function LearningPath() {
  const { locale } = useTranslation();
  const [expandedPath, setExpandedPath] = useState<number | null>(null);
  const content = pathContentByLocale[locale];

  return (
    <section
      id="learning-path"
      className="px-4 sm:px-6 py-20 sm:py-28 border-t border-border/30"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 sm:mb-14 space-y-3 animate-fade-in-up">
          <p className="font-mono text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-primary">
            {content.kicker}
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {content.title}
          </h2>
          <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            {content.description}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {content.paths.map((path, index) => (
            <article
              key={path.id}
              className={cn(
                "group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-card/40 glass p-6 sm:p-7 transition-all duration-400 hover:border-primary/40 hover:bg-card/60 active:scale-[0.99] hover-lift animate-fade-in-up",
                expandedPath === path.id && "border-primary/50 bg-card/70",
              )}
              style={{ animationDelay: `${index * 100 + 200}ms` }}
              onClick={() =>
                setExpandedPath(expandedPath === path.id ? null : path.id)
              }
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                  path.color,
                )}
              />

              <div className="relative z-10">
                <div className="mb-4 sm:mb-5 flex items-center justify-between gap-3">
                  <span className="rounded-lg border border-border/80 bg-secondary/60 px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors group-hover:border-primary/50 group-hover:text-foreground">
                    {path.category}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {path.date}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <path.icon className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold tracking-tight transition-colors duration-300 group-hover:text-gradient">
                    {path.title}
                  </h3>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {path.excerpt}
                </p>

                <div className="mt-5 flex items-center gap-2 font-mono text-xs text-primary transition-all duration-300 sm:opacity-0 sm:translate-x-[-8px] group-hover:opacity-100 group-hover:translate-x-0">
                  <span>{content.continue}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r from-primary to-transparent transition-all duration-500 group-hover:w-full" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
