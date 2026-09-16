"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Layout,
  Keyboard,
  Trophy,
  BookOpen,
  Bug,
  Sparkles,
  Star,
  GitFork,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

const modulesByLocale = {
  pt: {
    kicker: "Módulos",
    title: "Catálogo de Aprendizagem",
    dailySuggestion: "Sugestão do Dia",
    enterModule: "entrar no modulo",
    rankLabel: "Rank",
    modules: [
      {
        id: "typing",
        title: "1. Typing Code",
        description:
          "Treina velocidade, precisão e domínio de digitação técnica através de desafios categorizados por tipo e dificuldade.",
        tags: ["Programação", "Anime", "Funções", "Algoritmos"],
        status: "active",
        xp: 450,
        level: 4,
        rank: 10,
        rankTitle: "Novato",
        icon: Keyboard,
        href: "/typing",
        featured: true,
        highlight: true,
      },
      {
        id: "competitive",
        title: "2. Programação Competitiva",
        description:
          "Resolve exercícios com base em linguagem, tempo, eficiência e número de submissões. Inspirado no LeetCode.",
        tags: ["Lógica", "IA", "Estruturas de Dados"],
        status: "active",
        xp: 1230,
        level: 5,
        rank: 12,
        rankTitle: "Estrategista",
        icon: Trophy,
        href: "/competitive",
        featured: true,
      },
      {
        id: "learn",
        title: "3. Aprender Programação",
        description:
          "Ensino estruturado e otimizado. Explicações teóricas, exemplos otimizados e boas práticas.",
        tags: ["Linguagens", "Conceitos", "Boas Práticas"],
        status: "active",
        xp: 0,
        level: 0,
        rank: 0,
        rankTitle: "Explorador",
        icon: BookOpen,
        href: "/learn",
        featured: false,
      },
      {
        id: "bugs",
        title: "4. Aprender com Bugs",
        description:
          "Aprende através de erros reais e soluções documentadas. Uma base de dados de erros comuns e explicações técnicas.",
        tags: ["Erros Reais", "Soluções", "Comunidade"],
        status: "active",
        xp: 0,
        level: 0,
        rank: 0,
        rankTitle: "Aprendiz",
        icon: Bug,
        href: "/bugs",
        featured: false,
      },
    ],
  },
  en: {
    kicker: "Modules",
    title: "Learning Catalog",
    dailySuggestion: "Suggestion of the Day",
    enterModule: "enter module",
    rankLabel: "Rank",
    modules: [
      {
        id: "typing",
        title: "1. Typing Code",
        description:
          "Train speed, precision and technical typing mastery through challenges categorized by type and difficulty.",
        tags: ["Programming", "Anime", "Functions", "Algorithms"],
        status: "active",
        xp: 450,
        level: 4,
        rank: 10,
        rankTitle: "Rookie",
        icon: Keyboard,
        href: "/typing",
        featured: true,
        highlight: true,
      },
      {
        id: "competitive",
        title: "2. Competitive Programming",
        description:
          "Solve exercises based on language, time, efficiency and number of submissions. Inspired by LeetCode.",
        tags: ["Logic", "AI", "Data Structures"],
        status: "active",
        xp: 1230,
        level: 5,
        rank: 12,
        rankTitle: "Strategist",
        icon: Trophy,
        href: "/competitive",
        featured: true,
      },
      {
        id: "learn",
        title: "3. Learn Programming",
        description:
          "Structured and optimized teaching. Theoretical explanations, optimized examples and best practices.",
        tags: ["Languages", "Concepts", "Best Practices"],
        status: "active",
        xp: 0,
        level: 0,
        rank: 0,
        rankTitle: "Explorer",
        icon: BookOpen,
        href: "/learn",
        featured: false,
      },
      {
        id: "bugs",
        title: "4. Learning from Bugs",
        description:
          "Learn through real mistakes and documented solutions. A database of common errors and technical explanations.",
        tags: ["Real Errors", "Solutions", "Community"],
        status: "active",
        xp: 0,
        level: 0,
        rank: 0,
        rankTitle: "Apprentice",
        icon: Bug,
        href: "/bugs",
        featured: false,
      },
    ],
  },
  fr: {
    kicker: "Modules",
    title: "Catalogue d'apprentissage",
    dailySuggestion: "Suggestion du jour",
    enterModule: "entrer dans le module",
    rankLabel: "Rang",
    modules: [
      {
        id: "typing",
        title: "1. Typing Code",
        description:
          "Entraîner la vitesse, la précision et la maîtrise de la dactylographie technique via des défis par type et difficulté.",
        tags: ["Programmation", "Anime", "Fonctions", "Algorithmes"],
        status: "active",
        xp: 450,
        level: 4,
        rank: 10,
        rankTitle: "Débutant",
        icon: Keyboard,
        href: "/typing",
        featured: true,
        highlight: true,
      },
      {
        id: "competitive",
        title: "2. Programmation compétitive",
        description:
          "Résoudre des exercices selon le langage, le temps, l'efficacité et le nombre de soumissions. Inspiré de LeetCode.",
        tags: ["Logique", "IA", "Structures de données"],
        status: "active",
        xp: 1230,
        level: 5,
        rank: 12,
        rankTitle: "Stratège",
        icon: Trophy,
        href: "/competitive",
        featured: true,
      },
      {
        id: "learn",
        title: "3. Apprendre la programmation",
        description:
          "Enseignement structuré et optimisé. Explications théoriques, exemples optimisés et bonnes pratiques.",
        tags: ["Langages", "Concepts", "Bonnes pratiques"],
        status: "active",
        xp: 0,
        level: 0,
        rank: 0,
        rankTitle: "Explorateur",
        icon: BookOpen,
        href: "/learn",
        featured: false,
      },
      {
        id: "bugs",
        title: "4. Apprendre des bugs",
        description:
          "Apprendre à partir d'erreurs réelles et de solutions documentées. Une base d'erreurs courantes et d'explications techniques.",
        tags: ["Erreurs réelles", "Solutions", "Communauté"],
        status: "active",
        xp: 0,
        level: 0,
        rank: 0,
        rankTitle: "Apprenti",
        icon: Bug,
        href: "/bugs",
        featured: false,
      },
    ],
  },
};

export function ModuleGrid() {
  const { locale } = useTranslation();
  const content = modulesByLocale[locale];
  return (
    <section id="modules" className="px-4 sm:px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 sm:mb-14 flex flex-col gap-6 sm:gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3 animate-fade-in-up">
            <p className="font-mono text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-primary">
              {content.kicker}
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {content.title}
            </h2>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.modules.map((module, index) => (
            <Link
              key={module.id}
              href={module.href}
              className={cn(
                "group relative overflow-hidden rounded-xl border bg-card/40 p-6 sm:p-7 glass transition-all duration-400 active:scale-[0.99] hover-lift hover:border-primary/40 hover:bg-card/70 animate-fade-in-up",
                module.highlight
                  ? "sm:col-span-2 lg:col-span-2 border-primary/30 bg-gradient-to-br from-primary/8 via-card/50 to-primary/8"
                  : "border-border/60",
                module.featured &&
                  !module.highlight &&
                  "sm:col-span-2 lg:col-span-1",
              )}
              style={{ animationDelay: `${(index % 6) * 100 + 200}ms` }}
            >
              {module.highlight && (
                <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-3.5 py-1.5 animate-pulse-glow">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-primary font-medium">
                    {content.dailySuggestion}
                  </span>
                </div>
              )}

              {/* Status indicator */}
              <div
                className={cn(
                  "absolute right-5 top-5 flex items-center gap-2.5",
                )}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-sm shadow-primary/50" />
                <span className="font-mono text-xs text-muted-foreground">
                  {module.status}
                </span>
              </div>

              <div
                className={cn(
                  "mb-5 font-mono text-xs text-muted-foreground",
                  module.highlight && "mt-10",
                )}
              >
                {module.rankTitle} • Nível {module.level}
              </div>

              <div className="flex items-center gap-3 mb-3">
                <module.icon className="h-6 w-6 text-primary" />
                <h3
                  className={cn(
                    "font-bold tracking-tight transition-all duration-300 group-hover:text-gradient",
                    module.highlight
                      ? "text-xl sm:text-2xl"
                      : "text-lg sm:text-xl",
                  )}
                >
                  {module.title}
                </h3>
              </div>

              <p
                className={cn(
                  "mb-5 text-sm leading-relaxed text-muted-foreground",
                  module.highlight ? "line-clamp-3" : "line-clamp-2",
                )}
              >
                {module.description}
              </p>

              <div className="mb-5 flex items-center gap-5 font-mono text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 transition-colors group-hover:text-primary">
                  <Star className="h-3.5 w-3.5" />
                  {module.xp} XP
                </span>
                <span className="flex items-center gap-1.5 transition-colors group-hover:text-foreground">
                  <Trophy className="h-3.5 w-3.5" />
                  {content.rankLabel} {module.rank}
                </span>
              </div>

              <div className="mb-5 flex flex-wrap gap-2">
                {module.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-border/80 bg-secondary/60 px-2.5 py-1 font-mono text-xs text-secondary-foreground transition-colors hover:border-primary/50 hover:bg-primary/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 font-mono text-xs text-primary transition-all duration-300 group/link">
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                  <span className="underline-animate">{content.enterModule}</span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary via-primary/80 to-transparent transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
