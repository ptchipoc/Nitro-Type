import { AlertCircle } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { typingArenaLabels } from "../constants";

interface ArenaErrorProps {
  error: string | null;
  onBack: () => void;
}

/**
 * ArenaError - Componente responsável por exibir estados de erro
 * Mostra mensagem de erro quando a sessão não existe ou expirou
 * Inclui botão para voltar à seleção de sessões
 */
export function ArenaError({ error, onBack }: ArenaErrorProps) {
  const { locale } = useTranslation();
  const labels = typingArenaLabels[locale as keyof typeof typingArenaLabels];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      <AlertCircle className="h-16 w-16 text-destructive opacity-50" />
      <div className="space-y-2">
        <h2 className="text-xl font-bold uppercase tracking-tight text-destructive">
          {error || labels.invalidSession}
        </h2>
        <p className="text-muted-foreground text-sm font-mono uppercase tracking-widest">
          {labels.sessionNotFound}
        </p>
      </div>
      <button
        onClick={onBack}
        className="px-8 py-3 rounded-sm border border-primary/20 bg-primary/5 text-primary font-bold uppercase tracking-widest hover:bg-primary/10 transition-all font-mono"
      >
        {labels.backToSelection}
      </button>
    </div>
  );
}