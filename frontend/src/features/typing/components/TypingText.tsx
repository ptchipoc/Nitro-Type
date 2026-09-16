import { forwardRef } from "react";

interface TypingTextProps {
  currentText: string;
  input: string;
}

export const TypingText = forwardRef<HTMLDivElement, TypingTextProps>(
  ({ currentText, input }, ref) => {
    // Dividir por palavras/espaços mantendo delimitadores
    const tokens = currentText.split(/(\s+)/);
    
    let charIndex = 0;

    return (
      <div className="w-full max-w-4xl mb-16">
        <div
          ref={ref}
          className="w-full h-64 bg-card/20 backdrop-blur-sm border border-border/20 rounded-lg p-8 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/30 hover:scrollbar-thumb-border/50 font-mono text-lg leading-relaxed tracking-wide select-none"
        >
          <div className="flex flex-wrap gap-0">
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
        </div>
      </div>
    );
  }
);

TypingText.displayName = "TypingText";