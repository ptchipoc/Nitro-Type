import {
  ArenaError,
  VirtualKeyboardSection,
} from "@/app/(private)/typing/arena/components";
import { TypingText } from "./TypingText";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SendProgressInput } from "@/features/events/hooks/use-event-socket";
import { useTranslation } from "@/lib/i18n";
import { typingArenaLabels } from "@/app/(private)/typing/arena/constants";

interface ArenaContentProps {
  eventId: string;
  roundNumber: number;
  currentText: string;
  wordCount: number;
  onFinish: () => void;
  hasSubmitted: boolean;
  sendProgress: (data: SendProgressInput) => void;
  timeLeft: number;
}

export function TypingArenaContent({
  currentText,
  eventId,
  wordCount,
  roundNumber,
  timeLeft,
  onFinish,
  sendProgress,
  hasSubmitted,
}: ArenaContentProps) {
  const router = useRouter();
  const { locale } = useTranslation();
  const labels = typingArenaLabels[locale as keyof typeof typingArenaLabels];

  const [error] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const [isKeyboardLocked, setIsKeyboardLocked] = useState(false);

  const sessionStartTimeRef = useRef<number | null>(null);

  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keep onFinish ref in sync so the effect always calls the latest version
  const onFinishRef = useRef(onFinish);
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  // ✅ WPM calculado com base no tempo real desde o primeiro keypress
  useEffect(() => {
    const interval = setInterval(() => {
      if (!sessionStartTimeRef.current) return;
      const timeInMinutes = (Date.now() - sessionStartTimeRef.current) / 60000;
      if (timeInMinutes > 0) {
        setWpm(Math.round(wordCount / timeInMinutes));
      }
    }, 500);

    return () => clearInterval(interval);
  }, [wordCount]);

  const scrollToCurrentLine = (cursorPosition: number) => {
    if (!textContainerRef.current) return;

    const container = textContainerRef.current;
    const cursorSpan = container.querySelector(
      `[data-cursor-position="${cursorPosition}"]`,
    ) as HTMLElement;

    if (cursorSpan) {
      const containerRect = container.getBoundingClientRect();
      const cursorRect = cursorSpan.getBoundingClientRect();

      const isVisible =
        cursorRect.top >= containerRect.top + 50 &&
        cursorRect.bottom <= containerRect.bottom - 50;

      if (!isVisible) {
        cursorSpan.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
      }
    }
  };

  const debouncedScrollToCurrentLine = (cursorPosition: number) => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      scrollToCurrentLine(cursorPosition);
    }, 100);
  };

  const processInputChange = (newValue: string, oldValue: string) => {
    if (timeLeft <= 0) return;
    if (newValue.length > currentText.length) return;

    // ✅ Marca o início da sessão no primeiro keypress
    if (!sessionStartTimeRef.current && newValue.length > 0) {
      sessionStartTimeRef.current = Date.now();
    }

    if (newValue.length > oldValue.length) {
      if (isKeyboardLocked) return;

      if (newValue[newValue.length - 1] !== currentText[newValue.length - 1]) {
        setErrors((p) => p + 1);
        const newConsecutiveErrors = consecutiveErrors + 1;
        setConsecutiveErrors(newConsecutiveErrors);
        if (newConsecutiveErrors >= 6) {
          setIsKeyboardLocked(true);
        }
      } else {
        setConsecutiveErrors(0);
      }
    } else if (newValue.length < oldValue.length) {
      const newConsecutiveErrors = Math.max(0, consecutiveErrors - 1);
      setConsecutiveErrors(newConsecutiveErrors);
      if (isKeyboardLocked && newConsecutiveErrors < 6) {
        setIsKeyboardLocked(false);
      }
    }

    setInput(newValue);

    const correctTypedChars = countCorrectChars(newValue, currentText);
    sendProgress({
      eventId,
      roundNumber,
      typedChars: newValue.length,
      correctTypedChars,
      incorrectTypedChars: newValue.length - correctTypedChars,
      progress: calcProgress(newValue.length, currentText.length),
    });

    setTimeout(() => {
      debouncedScrollToCurrentLine(newValue.length);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const inputEl = inputRef.current;
      if (!inputEl) return;

      const start = inputEl.selectionStart ?? 0;
      const end = inputEl.selectionEnd ?? 0;
      const newValue = input.substring(0, start) + "\t" + input.substring(end);

      processInputChange(newValue, input);

      setTimeout(() => {
        inputEl.selectionStart = inputEl.selectionEnd = start + 1;
      }, 0);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    processInputChange(e.target.value, input);
  };

  // ✅ Dispara onFinish quando o texto está completo ou o tempo acabou
  useEffect(() => {
    if (hasSubmitted) return;

    const textComplete =
      input.length > 0 && input.length === currentText.length;
    const timeUp = timeLeft === 0 && input.length > 0;

    if (textComplete || timeUp) {
      onFinishRef.current();
    }
  }, [
    timeLeft,
    input.length,
    currentText.length,
    hasSubmitted,
    errors,
  ]);

  if (error) {
    return <ArenaError error={error} onBack={() => router.push("/events")} />;
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col items-center pt-10">
      <div className="fixed left-4 lg:left-12 xl:left-24 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-8 text-[10px] font-mono text-muted-foreground/40 font-bold uppercase tracking-widest bg-card/20 glass p-8 rounded-2xl border border-border/10">
        <div>
          <p className="mb-1">{labels.wpm}</p>
          <p className="text-4xl text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.3)]">
            {wpm}
          </p>
        </div>
        <div>
          <p className="mb-1">{labels.errors}</p>
          <p
            className={`text-4xl ${errors > 0 ? "text-destructive" : "text-foreground/40"}`}
          >
            {errors}
          </p>
        </div>
        <div>
          <p className="mb-1">{labels.remaining}</p>
          <p className="text-4xl text-foreground/80">
            {currentText.length - input.length}
          </p>
        </div>
        <div>
          <p className="mb-1">{labels.consecutiveErrors}</p>
          <p
            className={`text-4xl ${
              consecutiveErrors > 0 ? "text-amber-500" : "text-foreground/40"
            } ${isKeyboardLocked ? "text-destructive animate-pulse" : ""}`}
          >
            {consecutiveErrors}/6
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center w-full max-w-4xl relative">
        <div className="w-full mb-16 relative">
          <TypingText
            ref={textContainerRef}
            currentText={currentText}
            input={input}
          />
        </div>

        <VirtualKeyboardSection
          currentText={currentText}
          input={input}
          hasSubmitted={hasSubmitted}
          onFinish={onFinish}
        />
      </div>

      <textarea
        ref={inputRef}
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        className="opacity-0 absolute inset-0 cursor-default resize-none"
        autoFocus
        autoComplete="off"
        spellCheck="false"
      />
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function countCorrectChars(input: string, reference: string): number {
  return input.split("").filter((char, i) => char === reference[i]).length;
}

function calcProgress(inputLength: number, textLength: number): number {
  return textLength > 0 ? Math.round((inputLength / textLength) * 100) : 0;
}
