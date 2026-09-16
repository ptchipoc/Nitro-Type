import { AlertCircle } from "lucide-react";
import { VirtualKeyboard } from "@/components/typing/VirtualKeyboard";


interface VirtualKeyboardSectionProps {
  currentText: string;
  input: string;
  hasSubmitted: boolean;
  onFinish: () => void;
}

/**
 * VirtualKeyboardSection - Componente responsável pela seção do teclado virtual
 * Contém o teclado virtual que mostra a próxima tecla a ser pressionada
 * e o botão para abandonar a arena (que também serve como botão de finalizar)
 */
export function VirtualKeyboardSection({
  currentText,
  input,
  hasSubmitted,
  onFinish
}: VirtualKeyboardSectionProps) {
  return (
    <div className="w-full max-w-3xl flex flex-col items-center gap-12 pb-12">
      <div className="w-full transform scale-110">
        <VirtualKeyboard activeKey={currentText[input.length] || ""} />
      </div>
    </div>
  );
}