"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { BellOff } from "lucide-react";

export function NotificationEmpty() {
  const { locale } = useTranslation();

  const labels = {
    pt: {
      title: "Silêncio total",
      subtitle:
        "Não tens notificações recentes. Nós avisamos-te quando houver novidades.",
    },
    en: {
      title: "Total silence",
      subtitle:
        "You don't have any recent notifications. We'll let you know when something's up.",
    },
    fr: {
      title: "Silence total",
      subtitle:
        "Vous n'avez pas de notifications récentes. Nous vous préviendrons dès qu'il y aura du nouveau.",
    },
  };

  const currentLabels = labels[locale as keyof typeof labels] || labels.en;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4 border border-dashed border-border">
        <BellOff className="w-8 h-8 text-muted-foreground opacity-50" />
      </div>
      <h3 className="text-lg font-mono font-bold text-foreground mb-2">
        {currentLabels.title.toUpperCase()}
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
        {currentLabels.subtitle}
      </p>
    </motion.div>
  );
}
