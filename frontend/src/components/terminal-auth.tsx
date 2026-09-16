"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Terminal } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRegister } from "@/features/auth/hooks/use-register";
import { ApiClientError } from "@/features/apiClient";

interface TerminalAuthProps {
  mode: "login" | "register" | "forgot-password" | "verify-otp" | "activate";
  onSwitchMode?: (newMode: "visual" | "terminal") => void;
}

type TerminalState =
  | "IDLE"
  | "WAITING_EMAIL"
  | "WAITING_PASSWORD"
  | "WAITING_USERNAME"
  | "WAITING_OTP";

export function TerminalAuth({ mode, onSwitchMode }: TerminalAuthProps) {
  const [history, setHistory] = useState<string[]>([
    `NT Secure Terminal v1.1.0`,
    `Authorization system initialized...`,
    `Type 'help' for commands.`,
    ``,
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [terminalState, setTerminalState] = useState<TerminalState>("IDLE");
  const [sessionData, setSessionData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const registerMutation = useRegister();

  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const addLine = (line: string) => setHistory((prev) => [...prev, line]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const rawInput = input.trim();
    const fullCommand = rawInput.toLowerCase();
    const [cmd, ...args] = fullCommand.split(" ");

    addLine(`> ${input}`);
    setInput("");

    // 1. Handle STATEFUL inputs (manual flows)
    if (terminalState === "WAITING_EMAIL") {
      setSessionData((prev) => ({ ...prev, email: rawInput }));
      addLine(`Email: ${rawInput}`);
      if (mode === "login") {
        addLine("PASSWORD:");
        setTerminalState("WAITING_PASSWORD");
      } else if (mode === "register") {
        addLine("USERNAME:");
        setTerminalState("WAITING_USERNAME");
      } else {
        addLine("Processing recovery...");
        await simulateProcess();
        addLine("OTP code sent to email.");
        setTerminalState("IDLE");
      }
      return;
    }

    if (terminalState === "WAITING_PASSWORD") {
      addLine("Password: ••••••••");
      setIsProcessing(true);

      if (mode === "register") {
        addLine("Registering...");
        try {
          const response = await registerMutation.mutateAsync({
            name: sessionData.username,
            email: sessionData.email,
            password: rawInput,
          });
          addLine(
            `SUCCESS: ${
              response?.data?.message ||
              "Conta criada. Verifica o teu email para activar a conta."
            }`,
          );
          setTerminalState("IDLE");
          setTimeout(
            () =>
              router.push(
                `/verify-otp?email=${encodeURIComponent(sessionData.email)}`,
              ),
            800,
          );
        } catch (error) {
          if (error instanceof ApiClientError) {
            addLine(`ERRO: ${error.getMessage()}`);
          } else {
            addLine("ERRO: Falha na conexao com o servidor.");
          }
          setTerminalState("IDLE");
        } finally {
          setIsProcessing(false);
        }
        return;
      }

      addLine("Authenticating...");
      try {
        const result = await signIn("credentials", {
          email: sessionData.email,
          password: rawInput,
          redirect: false,
        });

        if (result?.error) {
          addLine(`ERRO: ${result.error}`);
          setTerminalState("IDLE");
        } else {
          addLine("SUCCESS: Login granted. Redirecting...");
          setTimeout(() => router.push("/dashboard"), 1000);
        }
      } catch {
        addLine("ERRO: Falha na conexao com o servidor.");
        setTerminalState("IDLE");
      }
      setIsProcessing(false);
      return;
    }

    if (terminalState === "WAITING_USERNAME") {
      setSessionData((prev) => ({ ...prev, username: rawInput }));
      addLine(`User: ${rawInput}`);
      addLine("PASSWORD:");
      setTerminalState("WAITING_PASSWORD");
      return;
    }

    // 2. Handle TOP-LEVEL commands
    setIsProcessing(true);
    await simulateProcess(300);

    switch (cmd) {
      case "help":
        addLine("COMANDOS DISPONÍVEIS:");
        addLine("  help               Exibir esta ajuda");
        addLine("  login              Entrar com email/senha");
        addLine("  login [provider]   Login via Google, Github ou 42");
        addLine("  register           Criar nova conta");
        addLine("  recover            Recuperar senha de conta");
        addLine("  activate           Ativar conta via código");
        addLine("  clear              Limpar terminal");
        addLine("  exit               Voltar para modo visual");
        break;
      case "login":
        const provider = args[0];
        if (!provider) {
          addLine("INICIANDO MANUAL LOGIN...");
          addLine("EMAIL:");
          setTerminalState("WAITING_EMAIL");
        } else if (["google", "github", "42"].includes(provider)) {
          addLine(`REDIRECIONANDO PARA ${provider.toUpperCase()}...`);
          await signIn(provider === "42" ? "42-school" : provider, { callbackUrl: "/dashboard" });
        } else {
          addLine(`ERRO: Provedor '${provider}' não reconhecido.`);
        }
        break;
      case "register":
        addLine("INICIANDO REGISTRO...");
        addLine("EMAIL:");
        setTerminalState("WAITING_EMAIL");
        break;
      case "recover":
        addLine("INICIANDO RECUPERAÇÃO DE CONTA...");
        addLine("EMAIL REGISTRADO:");
        setTerminalState("WAITING_EMAIL");
        break;
      case "activate":
        addLine("INICIANDO ATIVAÇÃO DE CONTA...");
        addLine("EMAIL REGISTRADO:");
        setTerminalState("WAITING_EMAIL");
        break;
      case "clear":
        setHistory([`Terminal Cleared.`, ``]);
        break;
      case "exit":
        onSwitchMode?.("visual");
        break;
      default:
        addLine(`ERRO: Comando '${cmd}' não encontrado. Digite 'help'.`);
    }

    addLine("");
    setIsProcessing(false);
  };

  async function simulateProcess(ms = 500) {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, ms));
    setIsProcessing(false);
  }

  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl border border-primary/30 bg-black/90 glass p-1 shadow-[0_0_30px_rgba(var(--primary),0.15)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
        </div>
        <div className="flex-1 text-center">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-center gap-2">
            <Terminal className="h-3 w-3" />
            secure-auth-terminal@NT
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        ref={scrollRef}
        className="h-[340px] overflow-y-auto p-5 font-mono text-xs leading-relaxed text-primary/80 scrollbar-hide selection:bg-primary/20"
      >
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap mb-1">
            {line.startsWith(">") ? (
              <span className="text-white font-bold opacity-100">{line}</span>
            ) : line.startsWith("ERRO:") ? (
              <span className="text-red-400 font-medium italic">{line}</span>
            ) : line.startsWith("SUCCESS:") ? (
              <span className="text-emerald-400 font-bold">{line}</span>
            ) : line === "EMAIL:" ||
              line === "PASSWORD:" ||
              line === "USERNAME:" ||
              line === "EMAIL REGISTRADO:" ? (
              <span className="text-primary font-bold animate-pulse">
                {line}
              </span>
            ) : (
              <span className="opacity-80">{line}</span>
            )}
          </div>
        ))}
        {isProcessing && (
          <div className="inline-block h-3 w-1.5 bg-primary animate-pulse ml-1 align-middle" />
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleCommand}
        className="flex items-center gap-2 px-5 py-3 border-t border-white/5 bg-white/5"
      >
        <span className="font-mono text-xs text-primary font-bold">
          {terminalState === "IDLE" ? ">" : "::"}
        </span>
        <input
          autoFocus
          type={terminalState === "WAITING_PASSWORD" ? "password" : "text"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isProcessing}
          className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-white placeholder:text-white/10"
          placeholder={
            terminalState === "IDLE"
              ? "digite um comando..."
              : "digite o valor..."
          }
        />
      </form>
    </div>
  );
}
