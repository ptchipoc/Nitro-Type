"use client";

import { motion } from "framer-motion";
import { PodiumCard } from "./PodiumCard";

interface RankingPodiumProps {
  topThree: any[];
}

export function RankingPodium({ topThree }: RankingPodiumProps) {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end mb-12">
      {/* Silver - 2nd Place */}
      {topThree[1] && (
        <motion.div variants={itemVariants} className="order-2 md:order-1 scale-100 md:scale-80">
          <PodiumCard user={topThree[1]} position={2} />
        </motion.div>
      )}

      {/* Gold - 1st Place */}
      {topThree[0] && (
        <motion.div variants={itemVariants} className="order-1 md:order-2 scale-100 md:scale-85 z-10">
          <PodiumCard user={topThree[0]} position={1} />
        </motion.div>
      )}

      {/* Bronze - 3rd Place */}
      {topThree[2] && (
        <motion.div variants={itemVariants} className="order-3 md:order-3 scale-100 md:scale-80 z-10">
          <PodiumCard user={topThree[2]} position={3} />
        </motion.div>
      )}
    </div>
  );
}
