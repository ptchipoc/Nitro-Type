"use client";

import { motion } from "framer-motion";
import { RewardRarity, RewardType } from "@/data/events-mock";
import { cn } from "@/lib/utils";
import { Trophy, Award, Zap } from "lucide-react";

interface Props {
  type: RewardType;
  rarity?: RewardRarity;
  size?: "sm" | "md" | "lg";
  className?: string;
  animate?: boolean;
}

export function RewardIcon({
  type,
  rarity = "COMMON",
  size = "md",
  className,
  animate = true,
}: Props) {
  const Icon = type === "TROPHY" ? Trophy : type === "MEDAL" ? Award : Zap;

  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
  };

  const rarityColor = {
    COMMON: "text-muted-foreground border-muted-foreground/20",
    RARE: "text-blue-400 border-blue-400/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]",
    EPIC: "text-purple-400 border-purple-400/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]",
    LEGENDARY:
      "text-amber-400 border-amber-400/40 shadow-[0_0_20px_rgba(245,158,11,0.4)]",
  };

  const glowStyles = {
    RARE: "after:bg-blue-400/10",
    EPIC: "after:bg-purple-400/15",
    LEGENDARY: "after:bg-amber-400/20",
    COMMON: "",
  };

  return (
    <motion.div
      initial={animate ? { scale: 0.8, opacity: 0 } : false}
      animate={animate ? { scale: 1, opacity: 1 } : false}
      whileHover={animate ? { scale: 1.1, rotate: 5 } : {}}
      className={cn(
        "relative flex items-center justify-center rounded-full border bg-card/50",
        size === "sm" ? "p-1" : size === "md" ? "p-2" : "p-4",
        rarityColor[rarity],
        rarity !== "COMMON" &&
          "after:absolute after:inset-0 after:rounded-full after:blur-md after:-z-10",
        glowStyles[rarity],
        className,
      )}
    >
      <Icon className={sizeMap[size]} strokeWidth={2.5} />
    </motion.div>
  );
}
