import { forwardRef } from "react";
import { TypingSection, TypingCategory } from "@/lib/api/endpoints/typing/typing.type";

interface TypingTextProps {
  section: TypingSection;
  input: string;
}

/**
 * Formata código para FUNCTIONS e ALGORITHMS
 * Converte \t em tabs e \n em quebras de linha
 */
function formatCodeText(text: string, category: TypingCategory): string {
  if (category !== TypingCategory.FUNCTIONS && category !== TypingCategory.ALGORITHMS) {
    return text;
  }

  // Converter sequências de escape
  return text
    .replace(/\\t/g, "\t")     // \t para tab real
    .replace(/\\n/g, "\n");    // \n para quebra de linha real
}

export const TypingText = forwardRef<HTMLDivElement, TypingTextProps>(
  ({ section, input }, ref) => {
    const rawText = section.textContent.text;
    const currentText = formatCodeText(rawText, section.category);

    // Se for código (FUNCTIONS/ALGORITHMS), renderizar por linhas
    // Caso contrário, dividir por palavras/espaços
    let tokens: string[];
    let shouldPreserveLineBreaks = false;

    if (section.category === TypingCategory.FUNCTIONS || section.category === TypingCategory.ALGORITHMS) {
      // Para código: preservar estrutura de linhas
      shouldPreserveLineBreaks = true;
      // Dividir por linhas, depois cada linha por palavras
      tokens = currentText.split("\n");
    } else {
      // Para ANIME: dividir por palavras/espaços mantendo delimitadores
      tokens = currentText.split(/(\s+)/);
    }

    let charIndex = 0;

    return (
      <div className="w-full max-w-4xl mb-16">
        <div
          ref={ref}
          className="w-full h-64 bg-card/20 backdrop-blur-sm border border-border/20 rounded-lg p-8 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/30 hover:scrollbar-thumb-border/50 font-mono text-lg leading-relaxed tracking-wide select-none"
        >
          {shouldPreserveLineBreaks ? (
            // Renderização para código (com quebras de linha)
            <div className="space-y-0">
              {tokens.map((line, lineIndex) => {
                // Sincronizar índice para a quebra de linha anterior
                if (lineIndex > 0) {
                  charIndex += 1; // Contar cada \n como 1 caractere
                }

                // Verificar se há quebra de linha após esta linha (não é a última)
                const hasLineBreak = lineIndex < tokens.length - 1;
                const lineBreakCharIndex = charIndex + line.length;

                return (
                  <div key={lineIndex}>
                    <div className="flex flex-wrap gap-0">
                      {line.split(/(\s+)/).map((token, tokenIndex) => {
                        const isWhitespace = /^\s+$/.test(token);
                        const tokenStart = charIndex;
                        const tokenChars = token.split("");
                        charIndex += token.length;

                        return (
                          <span
                            key={tokenIndex}
                            className={isWhitespace ? "" : "whitespace-nowrap"}
                          >
                            {tokenChars.map((char, charPos) => {
                              const i = tokenStart + charPos;
                              let colorClass = "text-muted-foreground";
                              let underlineClass = "";

                              if (i < input.length) {
                                if (input[i] === char) {
                                  colorClass = "text-primary";
                                  underlineClass = "border-b-2 border-primary/30";
                                } else {
                                  colorClass = "text-destructive";
                                  underlineClass =
                                    "border-b-2 border-destructive/50 bg-destructive/10";
                                }
                              } else if (i === input.length) {
                                colorClass = "text-foreground font-bold";
                                underlineClass = "border-b-2 border-primary";
                              }

                              let displayChar = char;
                              if (char === " ") displayChar = "\u00A0";
                              else if (char === "\t") displayChar = "→\u00A0\u00A0\u00A0\u00A0";

                              return (
                                <span
                                  key={charPos}
                                  data-cursor-position={i}
                                  className={`transition-all duration-150 ${colorClass} ${underlineClass}`}
                                >
                                  {displayChar}
                                </span>
                              );
                            })}
                          </span>
                        );
                      })}
                      
                      {/* Indicador visual de quebra de linha */}
                      {hasLineBreak && (
                        <span
                          data-cursor-position={lineBreakCharIndex}
                          className={`transition-all duration-150 text-muted-foreground ${
                            lineBreakCharIndex === input.length ? "font-bold text-foreground border-b-2 border-primary" : ""
                          }`}
                        >
                          ↵
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Renderização para ANIME (sem quebras de linha - comportamento original)
            <div className="flex flex-wrap gap-0 word-break-normal">
              {tokens.map((token, tokenIndex) => {
                const isWhitespace = /^\s+$/.test(token);
                const tokenStart = charIndex;
                const tokenChars = token.split("");
                charIndex += token.length;

                return (
                  <span
                    key={tokenIndex}
                    className={isWhitespace ? "" : "whitespace-nowrap"}
                  >
                    {tokenChars.map((char, charPos) => {
                      const i = tokenStart + charPos;
                      let colorClass = "text-muted-foreground";
                      let underlineClass = "";

                      if (i < input.length) {
                        if (input[i] === char) {
                          colorClass = "text-primary";
                          underlineClass = "border-b-2 border-primary/30";
                        } else {
                          colorClass = "text-destructive";
                          underlineClass =
                            "border-b-2 border-destructive/50 bg-destructive/10";
                        }
                      } else if (i === input.length) {
                        colorClass = "text-foreground font-bold";
                        underlineClass = "border-b-2 border-primary";
                      }

                      let displayChar = char;
                      if (char === " ") displayChar = "\u00A0";
                      else if (char === "\t") displayChar = "→\u00A0\u00A0\u00A0\u00A0";

                      return (
                        <span
                          key={charPos}
                          data-cursor-position={i}
                          className={`transition-all duration-150 ${colorClass} ${underlineClass}`}
                        >
                          {displayChar}
                        </span>
                      );
                    })}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
);

TypingText.displayName = "TypingText";