"use client";

import { useTranslation } from "@/lib/i18n";

const labelsByLocale = {
  pt: {
    profileImpact: "Impacto no Perfil",
    impactText: "Este evento alimenta diretamente o teu progresso no módulo",
    impactText2: "O XP ganho contribui para o teu nível e rank global.",
  },
  en: {
    profileImpact: "Profile Impact",
    impactText: "This event directly feeds your progress in the module",
    impactText2: "The XP earned contributes to your level and global rank.",
  },
  fr: {
    profileImpact: "Impact sur le profil",
    impactText:
      "Cet événement alimente directement votre progression dans le module",
    impactText2: "L'XP gagné contribue à votre niveau et à votre rang global.",
  },
};
import { Zap, Info } from "lucide-react";
import { EventReward } from "@/lib/api/endpoints/events/event.type";

interface Props {
  rewards: EventReward[];
  moduleImpact: string;
}

export function RewardShowcase({ rewards, moduleImpact }: Props) {
  const { locale } = useTranslation();
  const labels = labelsByLocale[locale];
  const medals = rewards.filter((r) => r.medal); // Ver
  const xpRewards = rewards.filter((r) => r.xpAmount > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-amber-500">
          Recompensas Oficiais
        </h3>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono font-bold text-amber-500 uppercase">
          <Zap className="h-3 w-3" />
          Prestigio Ativo
        </div>
      </div>

      {/* Medals Grid */}
      <div className="grid grid-cols-2 gap-3">
        {medals.map((medal) => (
          <div
            key={medal.id}
            className="p-3 rounded-sm border border-border bg-card/40 flex items-center gap-3"
          >
            {/* <RewardIcon
              type="MEDAL"
              rarity={medal.}
              size="sm"
              animate={false}
            /> */}
            <div className="min-w-0">
              {/* <p
                className="font-mono text-[11px] font-bold truncate"
                style={{ color: getRarityColor(medal.rarity) }}
              >
                {medal.value}
              </p> */}
              <p className="text-[9px] text-muted-foreground truncate uppercase tracking-tighter">
                {/* {medal.condition} */}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* XP Breakdown & Module Impact */}
      <div className="space-y-3">
        <div className="p-4 rounded-sm border border-dashed border-border bg-muted/10">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
              {labels.profileImpact}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {labels.impactText}{" "}
            <span className="text-foreground font-bold">{moduleImpact}</span>.{" "}
            {labels.impactText2}
          </p>
          <div className="mt-4 space-y-2">
            {xpRewards.map((xp) => (
              <div
                key={xp.id}
                className="flex items-center justify-between py-1 border-b border-border/50 last:border-0"
              >
                <span className="text-[10px] font-mono text-muted-foreground uppercase">
                  {/* {xp.condition} */}
                </span>
                <span className="text-[10px] font-mono font-bold text-primary">
                  {/* +{xp.value} XP */}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
