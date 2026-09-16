import { Zap } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { typingArenaLabels } from "../constants";

interface ArenaSubmittingProps {
  isSubmitting: boolean;
}

/**
 * ArenaSubmitting - Componente responsável por exibir o overlay de submissão
 * Mostra um overlay com blur quando o resultado está sendo enviado
 * Inclui ícone animado e mensagem de status
 */
export function ArenaSubmitting({ isSubmitting }: ArenaSubmittingProps) {
  const { locale } = useTranslation();
  const labels = typingArenaLabels[locale as keyof typeof typingArenaLabels];

  if (!isSubmitting) return null;

  return (
    <div className="fixed inset-0 z-100 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center gap-4">
      <Zap className="h-12 w-12 text-primary animate-bounce shadow-glow" />
      <p className="font-mono text-sm font-bold uppercase tracking-[0.3em] text-primary">
        {labels.submittingResult}
      </p>
    </div>
  );
}