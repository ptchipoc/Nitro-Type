"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <div className="mb-8">
          {/* 404 Glitch Effect */}
          <h1 className="text-9xl font-bold mb-4 font-mono relative">
            <span className="glitch inline-block">404</span>
          </h1>
          <div className="h-1 w-32 bg-primary mx-auto mb-8" />
          <h2 className="text-3xl font-bold mb-4">
            {t("errors.not_found.title")}
          </h2>
          <p className="text-muted-foreground text-lg mb-2">
            {t("errors.not_found.subtitle")}
          </p>
          <p className="text-muted-foreground">
            {t("errors.not_found.lead")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            {t("errors.not_found.go_home")}
          </Link>
          <Link
            href="/blog"
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
          >
            {t("errors.not_found.browse_blog")}
          </Link>
          <Link
            href="/projects"
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
          >
            {t("errors.not_found.view_projects")}
          </Link>
        </div>

        <div className="text-sm text-muted-foreground font-mono">
          <span className="text-primary">&gt;</span>{" "}
          {t("errors.not_found.error_code")} 404_NOT_FOUND
        </div>
      </div>
    </div>
  )
}
