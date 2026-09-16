"use client";

import { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Timer, Zap, AlertCircle } from "lucide-react";
import { CursorGlow } from "@/components/cursor-glow";
import {
  fetchSection,
  fetchActivateSession,
  fetchSubmitSession,
} from "@/lib/api/endpoints/typing/typing.service";
import { TypingSection } from "@/lib/api/endpoints/typing/typing.type";
import { SubmitSessionInput } from "@/lib/api/endpoints/typing/typing.input";
import { VirtualKeyboard } from "@/components/typing/VirtualKeyboard";
import {
  ArenaHeader,
  TypingText,
  VirtualKeyboardSection,
  ArenaLoading,
  ArenaError,
  ArenaSubmitting
} from "./components";
import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";
import { typingArenaLabels } from "./constants";

function ArenaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useTranslation();
  const labels = typingArenaLabels[locale as keyof typeof typingArenaLabels];
  const sectionId = searchParams.get("sectionId");
  const pathname = usePathname();

  const [section, setSection] = useState<TypingSection | null>(null);
  const [loading, setLoading] = useState(true);


  const [input, setInput] = useState("");
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false); // ← NOVO: previne múltiplas submissões
  const [submitFailed, setSubmitFailed] = useState(false); // ← NOVO: previne loop de retry após erro
  const [consecutiveErrors, setConsecutiveErrors] = useState(0); // ← NOVO: contador de erros consecutivos
  const [isKeyboardLocked, setIsKeyboardLocked] = useState(false); // ← NOVO: bloqueia teclado

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Carrega a secção
  useEffect(() => {
    async function load() {
      if (!sectionId) {
        router.push("/typing");
        return;
      }

      // Validar atravez do sessionStorage se esta sessão já foi inicializada nesta janela
      const storageKey = `arena_session_${sectionId}`;
      if (typeof window !== "undefined") {
        if (sessionStorage.getItem(storageKey) && pathname === "/typing/arena") {
          // Já existia na store local = foi feito um refresh na página
          router.push("/typing");
          return;
        }
        // Marcar que já passou por aqui, para evitar segunda execução num refresh futuro
        // sessionStorage.setItem(storageKey, "true");
      }

      try {
        const data = await fetchActivateSession(sectionId);
        setSection(data);
        setTimeLeft(data.timeLimit);
      } catch {
        router.push("/typing");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sectionId, router, pathname]);

  // Countdown timer
  useEffect(() => {
    if (!sessionStartTime || timeLeft === null || isSubmitting || !section) {
      return;
    }

    if (timeLeft <= 0) {
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionStartTime, timeLeft, isSubmitting, section]);

  // Calcula WPM em tempo real
  useEffect(() => {
    if (!sessionStartTime || !section) return;
    const interval = setInterval(() => {
      const timeInMinutes = (Date.now() - sessionStartTime) / 60000;
      if (timeInMinutes > 0) {
        const wordsTyped = input
          .split(/\s+/)
          .filter((w) => w.length > 0).length;
        setWpm(Math.round(wordsTyped / timeInMinutes));
      }
    }, 500);
    return () => clearInterval(interval);
  }, [sessionStartTime, input, section]);

  const scrollToCurrentLine = (cursorPosition: number) => {
    if (!textContainerRef.current) return;

    const container = textContainerRef.current;

    // Encontra o span do cursor atual
    const cursorSpan = textContainerRef.current.querySelector(
      `[data-cursor-position="${cursorPosition}"]`
    ) as HTMLElement;

    if (cursorSpan) {
      const containerRect = container.getBoundingClientRect();
      const cursorRect = cursorSpan.getBoundingClientRect();

      // Verifica se o cursor já está visível (com margem de 50px)
      const isVisible =
        cursorRect.top >= containerRect.top + 50 &&
        cursorRect.bottom <= containerRect.bottom - 50;

      // Só faz scroll se não estiver visível
      if (!isVisible) {
        cursorSpan.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest', // Mudou de 'center' para 'nearest' para menos movimento
          inline: 'nearest'
        });
      }
    }
  };

  const debouncedScrollToCurrentLine = (cursorPosition: number) => {
    // Cancela o timeout anterior
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Agenda um novo scroll com debounce de 100ms
    scrollTimeoutRef.current = setTimeout(() => {
      scrollToCurrentLine(cursorPosition);
    }, 100);
  };

  const processInputChange = (newValue: string, oldValue: string) => {
    if (isSubmitting || !section || (timeLeft !== null && timeLeft <= 0)) {
      return;
    }

    const currentText = section.textContent.text;

    // Nunca deixa digitar mais que o texto
    if (newValue.length > currentText.length) return;

    // Inicia a sessão na primeira letra
    if (!sessionStartTime && newValue.length > 0) {
      setSessionStartTime(Date.now());
    }

    // Lógica de erros consecutivos
    if (newValue.length > oldValue.length) {
      // Adicionou um caracter
      if (isKeyboardLocked) {
        return;
      }

      if (newValue[newValue.length - 1] !== currentText[newValue.length - 1]) {
        // Caracter errado
        setErrors((p) => p + 1);
        const newConsecutiveErrors = consecutiveErrors + 1;
        setConsecutiveErrors(newConsecutiveErrors);

        // Bloqueia se atingir 6 erros consecutivos
        if (newConsecutiveErrors >= 6) {
          setIsKeyboardLocked(true);
        }
      } else {
        // Caracter correto - reseta contador
        setConsecutiveErrors(0);
      }
    } else if (newValue.length < oldValue.length) {
      // Removeu um caracter (backspace) - decrementa contador e desbloqueia se necessário
      const newConsecutiveErrors = Math.max(0, consecutiveErrors - 1);
      setConsecutiveErrors(newConsecutiveErrors);

      // Desbloqueia o teclado quando erros consecutivos < 6
      if (isKeyboardLocked && newConsecutiveErrors < 6) {
        setIsKeyboardLocked(false);
      }
    }

    setInput(newValue);

    // Auto-scroll para manter a linha atual visível
    setTimeout(() => {
      debouncedScrollToCurrentLine(newValue.length);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Permite Tab inserir \t sem mudar foco
    if (e.key === "Tab") {
      e.preventDefault();
      const inputEl = inputRef.current;
      if (!inputEl) return;

      const start = inputEl.selectionStart ?? 0;
      const end = inputEl.selectionEnd ?? 0;
      const newValue =
        input.substring(0, start) + "\t" + input.substring(end);

      processInputChange(newValue, input);

      setTimeout(() => {
        inputEl.selectionStart = inputEl.selectionEnd = start + 1;
      }, 0);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    processInputChange(e.target.value, input);
  };

  /**
   * handleFinish - faz o submit UMA VEZ APENAS
   */
  const handleFinish = useCallback(async () => {
    // ← GUARD: se já foi submetido, não faz nada
    if (hasSubmitted || isSubmitting || !section) return;

    setSubmitFailed(false); // ← Reset flag de erro
    setHasSubmitted(true); // ← MARCA como submetido
    setIsSubmitting(true);

    try {
      // Cria o payload SEM durationSeconds
      const payload: SubmitSessionInput = {
        sessionId: section.id,
        typedChars: input.length,
        correctTypedChars: input.length - errors,
        incorrectTypedChars: errors,
      };


      const result = await fetchSubmitSession(payload);
      router.push(`/typing/results/${result.id}`);
    } catch (err) {
      toast.error(labels.errorSubmitting);
      setSubmitFailed(true); // ← MARCA que houve erro
      setHasSubmitted(false); // ← Se der erro, permite tentar de novo
      setIsSubmitting(false);
    }
  }, [hasSubmitted, isSubmitting, section, input.length, errors, router]);

  // Detecta quando termina (timeout ou completou)
  useEffect(() => {
    if (!section || hasSubmitted || submitFailed) return; // ← NÃO faz retry automático após erro

    const currentText = section.textContent.text;

    // Completou o texto inteiro
    if (input.length > 0 && input.length === currentText.length) {
      handleFinish();
      return;
    }

    // Timeout (tempo acabou)
    if (timeLeft === 0 && input.length > 0) {
      handleFinish();
      return;
    }
  }, [timeLeft, input.length, section, hasSubmitted, submitFailed, handleFinish]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="font-mono text-xs uppercase tracking-widest text-primary animate-pulse">
          {labels.initializingArena}
        </p>
      </div>
    );
  }

  if (!section) {
    return null;
  }

  const currentText = section.textContent.text;

  return (
    <div className="max-w-6xl mx-auto flex flex-col items-center pt-10">
      <Header />
      <ArenaHeader
        section={section}
        timeLeft={timeLeft}
        input={input}
        currentText={currentText}
      />

      {/* Stats Sidebar */}
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
            className={`text-4xl ${consecutiveErrors > 0 ? "text-amber-500" : "text-foreground/40"
              } ${isKeyboardLocked ? "text-destructive animate-pulse" : ""}`}
          >
            {consecutiveErrors}/6
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center w-full max-w-4xl relative">
        {/* Typing Container */}
        <div className="w-full mb-16 relative">
          <TypingText
            ref={textContainerRef}
            section={section}
            input={input}
          />
        </div>

        <VirtualKeyboardSection
          currentText={currentText}
          input={input}
          hasSubmitted={hasSubmitted}
          onFinish={handleFinish}
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

      <ArenaSubmitting isSubmitting={isSubmitting} />
    </div>
  );
}

export default function ArenaPage() {
  return (
    <main className="relative min-h-screen overflow-hidden scanlines">
      <CursorGlow />
      <div className="relative z-10 w-full">
        <div className="pt-28 sm:pt-36 min-h-screen px-6 lg:px-24">
          <Suspense
            fallback={<ArenaLoading />}
          >
            <ArenaContent />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
