import { Trophy, ShieldCheck, Timer, AlertCircle } from "lucide-react";
import { TypingSessionStatus } from "@/lib/api/endpoints/typing/typing.type";
import { Labels } from "../../components/constants";

export interface StatusTheme {
  label: string;
  subtitle: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  heroIcon: React.ReactNode;
  statColor: string;
}

export const createStatusThemes = (labels: Labels): Record<TypingSessionStatus, StatusTheme> => ({
  [TypingSessionStatus.COMPLETED]: {
    label: labels.missionAccomplished,
    subtitle: labels.missionAccomplishedSubtitle,
    color: "text-primary",
    bgColor: "bg-primary/5",
    borderColor: "border-primary/20",
    icon: <ShieldCheck className="h-4 w-4" />,
    heroIcon: (
      <Trophy className="h-20 w-20 text-primary mx-auto mb-8 drop-shadow-glow" />
    ),
    statColor: "text-primary",
  },
  [TypingSessionStatus.TIMEOUT]: {
    label: labels.missionTimeout,
    subtitle: labels.missionTimeoutSubtitle,
    color: "text-primary",
    bgColor: "bg-primary/5",
    borderColor: "border-primary/20",
    icon: <Timer className="h-4 w-4" />,
    heroIcon: (
      <Timer className="h-20 w-20 text-primary mx-auto mb-8 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]" />
    ),
    statColor: "text-primary",
  },
  [TypingSessionStatus.ABANDONED]: {
    label: labels.missionAbandoned,
    subtitle: labels.missionAbandonedSubtitle,
    color: "text-destructive",
    bgColor: "bg-destructive/5",
    borderColor: "border-destructive/20",
    icon: <AlertCircle className="h-4 w-4" />,
    heroIcon: (
      <AlertCircle className="h-20 w-20 text-destructive mx-auto mb-8 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]" />
    ),
    statColor: "text-destructive",
  },
});

// Mantém compatibilidade com código existente
export const STATUS_THEMES = createStatusThemes({
  missionAccomplished: "Mission Accomplished",
  missionAccomplishedSubtitle: "Mission completed successfully. Performance data synchronized.",
  missionTimeout: "Mission Timeout",
  missionTimeoutSubtitle: "Time ran out before you could finish the challenge. Try to be faster!",
  missionAbandoned: "Mission Abandoned",
  missionAbandonedSubtitle: "The mission was interrupted prematurely. Progress was limited.",
} as Labels);
