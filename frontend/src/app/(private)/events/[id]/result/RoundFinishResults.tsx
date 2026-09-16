import { RoundResultPayload } from "@/features/events/hooks/use-event-socket";
import { motion } from "framer-motion";
import { TrendingUp, Target, Award, Clock, Zap } from "lucide-react";
import { Header } from "@/components/header";

export const RoundFinishResults = ({ result }: { result: RoundResultPayload }) => {
  const stats = [
    {
      label: "WPM",
      value: result.wpm,
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      label: "ACCURACY",
      value: `${result.accuracy}%`,
      icon: Target,
      color: "text-emerald-400",
    },
    {
      label: "SCORE",
      value: result.score,
      icon: Award,
      color: "text-amber-400",
    },
    {
      label: "TIME",
      value: `${result.completionTime}s`,
      icon: Clock,
      color: "text-blue-400",
    },
    {
      label: "PROGRESS",
      value: `${result.completionRate}%`,
      icon: Zap,
      color: "text-purple-400",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto my-auto px-4 sm:px-6 lg:px-8 my-auto"
    >
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/30 glass border border-primary/20 rounded-2xl p-6 sm:p-8 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Award className="w-32 h-32 text-primary" />
        </div>

        <div className="relative z-10">
          <h3 className="text-sm font-mono uppercase tracking-[0.3em] text-primary/60 mb-8 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Resultados da Rodada
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60 uppercase">
                  <stat.icon className="w-3 h-3" />
                  {stat.label}
                </div>
                <div
                  className={`text-3xl font-bold font-mono tracking-tighter ${stat.color}`}
                >
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="h-px bg-linear-to-r from-transparent via-primary/30 to-transparent my-8"
          />

          <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground/40">
            <span>Finalizado com sucesso</span>
            <span className="animate-pulse text-primary/60">
              Aguardando próxima rodada...
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
