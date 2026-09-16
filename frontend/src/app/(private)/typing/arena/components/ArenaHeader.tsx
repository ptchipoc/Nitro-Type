import { motion } from "framer-motion";
import { AlertCircle, Timer } from "lucide-react";
import { TypingSection } from "@/lib/api/endpoints/typing/typing.type";
import { useTranslation } from "@/hooks/use-translation";
import { useRouter } from "next/navigation";

interface ArenaHeaderProps {
  section: TypingSection;
  timeLeft: number | null;
  input: string;
  currentText: string;
}

/**
 * Formata tempo em segundos para formato MM:SS
 */
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes === 0 ? "" : `${minutes}:`}${secs.toString().padStart(2, "0")}s`;
}

/**
 * ArenaHeader - Componente responsável por exibir o cabeçalho da arena
 * Contém informações da sessão, timer e barra de progresso
 */
export function ArenaHeader({ section, timeLeft, input, currentText }: ArenaHeaderProps) {
  
  const t = useTranslation();
  const router = useRouter()

  const leaveArena = () => {
    router.push("/typing");
  };

  // Usar timeLeft se disponível, caso contrário usar timeLimit
  const displayTime = timeLeft !== null ? timeLeft : section.timeLimit;

  return (
    <div className="w-full max-w-4xl mb-12 text-center">
      <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary/60 mb-2">
        {t.soloPractice} / {section.category} / {section.difficulty}
      </p>
      <h1 className="text-3xl font-bold mb-4 font-mono uppercase tracking-tighter">
        {t.soloSession} #
        <span className="opacity-50">{section.id.slice(0, 8)}</span>
      </h1>
      <div className="pt-4 border-t border-border/10 flex items-center gap-2 justify-center">
        <Timer className="h-10 w-10 text-amber-500" />
        <span className="text-amber-500 text-4xl font-bold flex items-center gap-2">
          {formatTime(displayTime)}
        </span>
      </div>
      <div className="flex items-center gap-2 justify-center mt-4">
        <button
          onClick={leaveArena}
          className="px-8 py-3 rounded-lg border text-center  relative z-10 border-border/40 bg-secondary cursor-pointer text-[10px] font-mono font-bold uppercase tracking-widest hover:border-destructive/40 hover:text-destructive transition-all flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.leaveArena}{" "}
          <AlertCircle className="h-4 w-4 group-hover:animate-pulse" />
        </button>
      </div>
      <div className="w-full h-1 bg-border/20 rounded-full overflow-hidden mt-8 max-w-sm mx-auto">
        <motion.div
          className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
          initial={{ width: 0 }}
          animate={{
            width: `${(input.length / currentText.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}