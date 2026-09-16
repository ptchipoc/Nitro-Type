"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal as TerminalIcon,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { useRegister } from "@/features/auth/hooks/use-register";
import { ApiClientError } from "@/features/apiClient";
import { AUTH_ERROR_CODES } from "@/lib/auth/credentials-errors";

const labelsByLocale = {
  pt: {
    init: "A iniciar DevAuth OS v4.2.0...",
    security: "Segurança: AES-256-GCM / NT Protocol Layer Ativo",
    welcome: "Bem-vindo ao NT CLI. Escreva 'help' para ver os comandos.",
    availableCommands: "Comandos disponíveis:",
    cmdLogin: "login           - Iniciar fluxo de login",
    cmdRegister: "register        - Iniciar fluxo de registo",
    cmdLoginGithub: "login github    - Autenticar via GitHub",
    cmdLoginGoogle: "login google    - Autenticar via Google",
    cmdLoginIntra: "login intra     - Autenticar via 42 Intra",
    cmdClear: "clear           - Limpar ecrã do terminal",
    cmdExit: "exit            - Voltar ao modo tradicional",
    redirecting: (provider: string) =>
      `A redirecionar para autenticação ${provider}...`,
    enterEmail: "Introduza o Email:",
    enterPassword: "Introduza a Senha:",
    enterFullName: "Introduza o Nome Completo:",
    commandNotFound: (cmd: string) => `Comando não encontrado: ${cmd}`,
    verifying: "A verificar credenciais...",
    authFailed: (err: string) => `Autenticação falhou: ${err}`,
    authSuccess: "Autenticação bem-sucedida! A carregar perfil...",
    systemError: (err: string) => `Erro de sistema durante auth: ${err}`,
    invalidCredentials: "Credenciais inválidas.",
    emailNotVerified:
      "Email não verificado. Verifica o teu email para continuar.",
    registrationNotImplemented:
      "Processo de registo ainda não implementado no CLI. Use o modo tradicional.",
    registrationSuccess:
      "Conta criada. Verifica o teu email para activar a conta.",
    processing: "A processar pedido...",
    usr: "UTIL: ANÓNIMO",
    host: "HOST: AUTH-NT",
    port: "PORTA: 443",
    online: "● ONLINE",
  },
  en: {
    init: "Initializing DevAuth OS v4.2.0...",
    security: "Security: AES-256-GCM / NT Protocol Layer Active",
    welcome:
      "Welcome to NT CLI. Type 'help' for available commands.",
    availableCommands: "Available commands:",
    cmdLogin: "login           - Start login flow",
    cmdRegister: "register        - Start registration flow",
    cmdLoginGithub: "login github    - Auth via GitHub",
    cmdLoginGoogle: "login google    - Auth via Google",
    cmdLoginIntra: "login intra     - Auth via 42 Intra",
    cmdClear: "clear           - Clear terminal screen",
    cmdExit: "exit            - Return to traditional UI",
    redirecting: (provider: string) =>
      `Redirecting to ${provider} authentication...`,
    enterEmail: "Enter Email:",
    enterPassword: "Enter Password:",
    enterFullName: "Enter Full Name:",
    commandNotFound: (cmd: string) => `Command not found: ${cmd}`,
    verifying: "Verifying credentials...",
    authFailed: (err: string) => `Authentication failed: ${err}`,
    authSuccess: "Authentication successful! Loading profile...",
    systemError: (err: string) => `System error during auth: ${err}`,
    invalidCredentials: "Invalid credentials.",
    emailNotVerified: "Email not verified. Check your email to continue.",
    registrationNotImplemented:
      "Registration process not implemented in CLI yet. Use Traditional mode.",
    registrationSuccess:
      "Account created. Check your email to activate the account.",
    processing: "Processing request...",
    usr: "USR: ANONYMOUS",
    host: "HOST: AUTH-NT",
    port: "PORT: 443",
    online: "● ONLINE",
  },
  fr: {
    init: "Initialisation de DevAuth OS v4.2.0...",
    security: "Sécurité : AES-256-GCM / NT Protocol Layer Actif",
    welcome:
      "Bienvenue sur NT CLI. Tapez 'help' pour voir les commandes.",
    availableCommands: "Commandes disponibles :",
    cmdLogin: "login           - Démarrer la connexion",
    cmdRegister: "register        - Démarrer l'inscription",
    cmdLoginGithub: "login github    - Auth via GitHub",
    cmdLoginGoogle: "login google    - Auth via Google",
    cmdLoginIntra: "login intra     - Auth via 42 Intra",
    cmdClear: "clear           - Effacer l'écran du terminal",
    cmdExit: "exit            - Revenir à l'interface classique",
    redirecting: (provider: string) =>
      `Redirection vers l'auth ${provider}...`,
    enterEmail: "Entrez l'email :",
    enterPassword: "Entrez le mot de passe :",
    enterFullName: "Entrez le nom complet :",
    commandNotFound: (cmd: string) => `Commande introuvable : ${cmd}`,
    verifying: "Vérification des identifiants...",
    authFailed: (err: string) => `Échec d'authentification : ${err}`,
    authSuccess: "Authentification réussie ! Chargement du profil...",
    systemError: (err: string) => `Erreur système pendant l'auth : ${err}`,
    invalidCredentials: "Identifiants invalides.",
    emailNotVerified:
      "Email non verifie. Verifiez votre email pour continuer.",
    registrationNotImplemented:
      "L'inscription n'est pas encore disponible dans le CLI. Utilisez le mode classique.",
    registrationSuccess:
      "Compte cree. Verifiez votre email pour activer le compte.",
    processing: "Traitement de la requête...",
    usr: "USR : ANONYME",
    host: "HÔTE : AUTH-NT",
    port: "PORT : 443",
    online: "● EN LIGNE",
  },
};

type LogType = "system" | "input" | "output" | "error" | "success";

interface LogEntry {
  id: string;
  type: LogType;
  text: string;
  timestamp: Date;
}

type Step =
  | "COMMAND"
  | "LOGIN_EMAIL"
  | "LOGIN_PWD"
  | "REGISTER_NAME"
  | "REGISTER_EMAIL"
  | "REGISTER_PWD";

export function TerminalAuth2() {
  const router = useRouter();
  const { locale } = useTranslation();
  const labels = labelsByLocale[locale];
  const registerMutation = useRegister();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [step, setStep] = useState<Step>("COMMAND");
  const [tempData, setTempData] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addLog = useCallback((text: string, type: LogType = "output") => {
    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        type,
        text,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const getLoginErrorMessage = (code?: string, fallback?: string) => {
    if (code === AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED) {
      return labels.emailNotVerified;
    }

    if (code === AUTH_ERROR_CODES.INVALID_CREDENTIALS) {
      return labels.invalidCredentials;
    }

    return fallback ? labels.authFailed(fallback) : labels.authFailed("unknown");
  };

  // Initial Boot Sequence
  useEffect(() => {
    const bootSequence = [
      { text: labels.init, type: "system" as const },
      { text: "Kernel: 6.12.0-nt-2026-x86_64", type: "system" as const },
      {
        text: labels.security,
        type: "system" as const,
      },
      {
        text: "--------------------------------------------------",
        type: "system" as const,
      },
      {
        text: labels.welcome,
        type: "output" as const,
      },
    ];

    let timer = 0;
    bootSequence.forEach((log) => {
      timer += 100 + Math.random() * 200;
      setTimeout(() => addLog(log.text, log.type), timer);
    });
  }, [addLog, labels]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Focus input on click
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const processCommand = async (cmd: string) => {
    const parts = cmd.trim().toLowerCase().split(" ");
    const action = parts[0];
    const args = parts.slice(1);

    switch (action) {
      case "help":
        addLog(labels.availableCommands, "output");
        addLog(`  ${labels.cmdLogin}`, "output");
        addLog(`  ${labels.cmdRegister}`, "output");
        addLog(`  ${labels.cmdLoginGithub}`, "output");
        addLog(`  ${labels.cmdLoginGoogle}`, "output");
        addLog(`  ${labels.cmdLoginIntra}`, "output");
        addLog(`  ${labels.cmdClear}`, "output");
        addLog(`  ${labels.cmdExit}`, "output");
        break;

      case "clear":
        setLogs([]);
        break;

      case "login":
        if (
          args[0] === "github" ||
          args[0] === "google" ||
          args[0] === "intra"
        ) {
          addLog(labels.redirecting(args[0]), "system");
          setIsProcessing(true);
          const provider = args[0] === "intra" ? "42-school" : args[0];
          await signIn(provider, { callbackUrl: "/dashboard" });
        } else {
          setStep("LOGIN_EMAIL");
          addLog(labels.enterEmail, "output");
        }
        break;

      case "register":
        setStep("REGISTER_NAME");
        addLog(labels.enterFullName, "output");
        break;

      case "exit":
        // This will be handled by the parent component toggling state
        window.dispatchEvent(
          new CustomEvent("switch-auth-mode", { detail: "traditional" }),
        );
        break;

      default:
        if (cmd.trim()) {
          addLog(labels.commandNotFound(cmd), "error");
        }
        break;
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setIsProcessing(true);
    addLog(labels.verifying, "system");
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        addLog(getLoginErrorMessage(result.code, result.error), "error");
        setStep("COMMAND");
      } else {
        addLog(labels.authSuccess, "success");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 800);
      }
    } catch (err) {
      addLog(labels.systemError(String(err)), "error");
      setStep("COMMAND");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRegister = async (data: { name: string; email: string; password: string }) => {
    setIsProcessing(true);
    addLog(labels.processing, "system");
    try {
      const response = await registerMutation.mutateAsync(data);
      const message = response?.data?.message || labels.registrationSuccess;
      addLog(message, "success");
      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        router.refresh();
      }, 800);
    } catch (error) {
      if (error instanceof ApiClientError) {
        addLog(error.getMessage(), "error");
      } else {
        addLog(labels.systemError(String(error)), "error");
      }
      setStep("COMMAND");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() && step === "COMMAND") return;
    if (isProcessing) return;

    const val = inputValue.trim();
    addLog(val, "input");
    setInputValue("");

    if (step === "COMMAND") {
      processCommand(val);
    } else if (step === "LOGIN_EMAIL") {
      setTempData({ ...tempData, email: val });
      setStep("LOGIN_PWD");
      addLog(labels.enterPassword, "output");
    } else if (step === "LOGIN_PWD") {
      handleLogin(tempData.email, val);
    } else if (step === "REGISTER_NAME") {
      setTempData({ ...tempData, name: val });
      setStep("REGISTER_EMAIL");
      addLog(labels.enterEmail, "output");
    } else if (step === "REGISTER_EMAIL") {
      setTempData({ ...tempData, email: val });
      setStep("REGISTER_PWD");
      addLog(labels.enterPassword, "output");
    } else if (step === "REGISTER_PWD") {
      handleRegister({
        name: tempData.name,
        email: tempData.email,
        password: val,
      });
    }
  };

  return (
    <div
      className="w-full h-full bg-[#050505]/80 border border-white/10 rounded-none overflow-hidden shadow-2xl font-mono text-[13px] leading-relaxed relative"
      onClick={handleContainerClick}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <div className="text-white/40 text-[10px] uppercase tracking-widest flex items-center gap-2">
          <TerminalIcon size={12} />
          auth-cli --bash
        </div>
        <div className="w-10" />
      </div>

      {/* Terminal Content */}
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto overflow-x-hidden p-4 custom-scrollbar selection:bg-[#00FF41] selection:text-black"
      >
        <AnimatePresence mode="popLayout">
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-1 flex gap-2"
            >
              {log.type === "input" && (
                <span className="text-[#00FF41]">$</span>
              )}
              {log.type === "system" && (
                <span className="text-[#00B2FF]">[sys]</span>
              )}
              {log.type === "error" && (
                <AlertCircle
                  size={14}
                  className="text-[#FF3B30] mt-1 shrink-0"
                />
              )}
              {log.type === "success" && (
                <CheckCircle2
                  size={14}
                  className="text-[#27c93f] mt-1 shrink-0"
                />
              )}

              <span
                className={cn(
                  log.type === "input"
                    ? "text-white"
                    : log.type === "error"
                      ? "text-[#FF3B30]"
                      : log.type === "success"
                        ? "text-[#27c93f]"
                        : log.type === "system"
                          ? "text-[#00B2FF]/80"
                          : "text-white/80",
                )}
              >
                {log.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Input Line */}
        {!isProcessing && (
          <form onSubmit={handleInputSubmit} className="flex gap-2">
            <span className="text-[#00FF41]">
              {step === "COMMAND" ? "$" : ">"}
            </span>
            <input
              ref={inputRef}
              autoFocus
              type={step.includes("PWD") ? "password" : "text"}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white p-0 h-auto"
              spellCheck={false}
              autoComplete="off"
            />
            {inputValue === "" && (
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-2 h-4 bg-[#00FF41] self-center -ml-[calc(100%-8px)]"
              />
            )}
          </form>
        )}

        {isProcessing && (
          <div className="flex gap-2 text-[#00FF41]">
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              _
            </motion.span>
            <span className="text-white/40 italic">{labels.processing}</span>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-1.5 bg-white/5 border-t border-white/5 flex justify-between items-center text-[9px] text-white/30 uppercase tracking-tighter">
        <div>{labels.usr}</div>
        <div>{labels.host}</div>
        <div className="flex items-center gap-3">
          <span>{labels.port}</span>
          <span className="text-[#27c93f]">{labels.online}</span>
        </div>
      </div>

      {/* Scanline Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10" />
    </div>
  );
}
