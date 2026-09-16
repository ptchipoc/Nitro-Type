"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Clock,
  Play,
  Send,
  Terminal,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import {
  mockExercises,
  mockTestCases,
  mockUserExerciseProgress,
} from "@/data/mock-data";
import type { CodingExercise } from "@/types";

type TestResult = {
  id: string;
  passed: boolean;
  time: string;
  hidden: boolean;
};

type SubmissionSummary = {
  status: "ACCEPTED" | "WRONG_ANSWER" | "TLE";
  xpEarned: number;
  maxXpReached: boolean;
  domainPointsEarned: number;
  executionTimeMs: number;
  passedCount: number;
  totalCount: number;
};

export type CPArenaState = {
  exerciseId: string;
  exerciseTitle: string;
  bestSolveTime?: number;
  totalTests: number;
  passedTests: number;
  submissionStatus: SubmissionSummary["status"] | "IDLE";
  xpEarned: number;
  domainPointsEarned: number;
};

const labelsByLocale = {
  pt: {
    saved: "Guardado localmente...",
    runTests: "Correr testes",
    submit: "Submeter",
    console: "Saída do console",
    statement: "Enunciado",
    inputFormat: "Input Format",
    outputFormat: "Output Format",
    constraints: "Constraints",
    sampleInput: "Sample Input",
    sampleOutput: "Sample Output",
    languages: "Linguagem",
    timer: "Tempo",
    best: "Melhor",
    testing: "A testar solução...",
    caseLabel: "Caso",
    hiddenCase: "Oculto",
    pass: "PASSOU",
    fail: "FALHA",
    timeout: "TIMEOUT",
    accepted: "Aceite",
    wrongAnswer: "Resposta errada",
    submitResult: "Resultado da submissão",
    totalTests: "Testes",
    executionTime: "Execução",
    xpEarned: "XP ganho",
    domainPoints: "Pontos de domínio",
    maxed: "XP máximo atingido",
    waitingAction: "Corre testes ou submete para ver o feedback.",
  },
  en: {
    saved: "Saved locally...",
    runTests: "Run Tests",
    submit: "Submit",
    console: "Console Output",
    statement: "Statement",
    inputFormat: "Input Format",
    outputFormat: "Output Format",
    constraints: "Constraints",
    sampleInput: "Sample Input",
    sampleOutput: "Sample Output",
    languages: "Language",
    timer: "Time",
    best: "Best",
    testing: "Testing solution...",
    caseLabel: "Case",
    hiddenCase: "Hidden",
    pass: "PASS",
    fail: "FAIL",
    timeout: "TIMEOUT",
    accepted: "Accepted",
    wrongAnswer: "Wrong answer",
    submitResult: "Submission result",
    totalTests: "Tests",
    executionTime: "Execution",
    xpEarned: "XP earned",
    domainPoints: "Domain points",
    maxed: "Max XP reached",
    waitingAction: "Run tests or submit to inspect feedback.",
  },
  fr: {
    saved: "Enregistré localement...",
    runTests: "Lancer les tests",
    submit: "Soumettre",
    console: "Sortie console",
    statement: "Énoncé",
    inputFormat: "Format d'entrée",
    outputFormat: "Format de sortie",
    constraints: "Contraintes",
    sampleInput: "Exemple d'entrée",
    sampleOutput: "Exemple de sortie",
    languages: "Langage",
    timer: "Temps",
    best: "Meilleur",
    testing: "Test de la solution...",
    caseLabel: "Cas",
    hiddenCase: "Masqué",
    pass: "OK",
    fail: "ÉCHEC",
    timeout: "TIMEOUT",
    accepted: "Accepté",
    wrongAnswer: "Réponse incorrecte",
    submitResult: "Résultat de soumission",
    totalTests: "Tests",
    executionTime: "Exécution",
    xpEarned: "XP gagné",
    domainPoints: "Points de domaine",
    maxed: "XP max atteint",
    waitingAction: "Lancez les tests ou soumettez pour voir le retour.",
  },
} as const;

function getExerciseFromQuery(exerciseId: string | null): CodingExercise {
  return (
    mockExercises.find((exercise) => exercise.id === exerciseId) ?? mockExercises[0]
  );
}

function buildStarterCode(exercise: CodingExercise, language: string) {
  return (
    exercise.starterCode?.[language] ??
    exercise.starterCode?.JavaScript ??
    "// Write your solution here\n"
  );
}

function evaluateSolution(exercise: CodingExercise, sourceCode: string) {
  const normalizedCode = sourceCode.toLowerCase();
  const rules: Record<string, string[]> = {
    "ex-001": ["map", "target"],
    "ex-002": ["stack", "push"],
    "ex-003": ["priority", "heur"],
    "ex-004": ["merge", "sort"],
    "ex-005": ["visited", "cycle"],
  };
  const requiredTokens = rules[exercise.id] ?? [];
  const matchedTokens = requiredTokens.filter((token) =>
    normalizedCode.includes(token),
  ).length;
  const totalCases = mockTestCases[exercise.id]?.length ?? 0;

  if (sourceCode.trim().length < 40) {
    return {
      status: "TLE" as const,
      passedCount: Math.max(totalCases - 2, 0),
    };
  }

  if (matchedTokens >= Math.max(requiredTokens.length - 1, 1)) {
    return {
      status: "ACCEPTED" as const,
      passedCount: totalCases,
    };
  }

  return {
    status: "WRONG_ANSWER" as const,
    passedCount: Math.max(totalCases - 1, 0),
  };
}

export function CPArena({
  onStateChange,
}: {
  onStateChange?: (state: CPArenaState) => void;
}) {
  const searchParams = useSearchParams();
  const exercise = getExerciseFromQuery(searchParams.get("exerciseId"));
  return (
    <CPArenaInner
      key={exercise.id}
      exercise={exercise}
      onStateChange={onStateChange}
    />
  );
}

function CPArenaInner({
  exercise,
  onStateChange,
}: {
  exercise: CodingExercise;
  onStateChange?: (state: CPArenaState) => void;
}) {
  const { locale } = useTranslation();
  const labels = labelsByLocale[locale];
  const supportedLanguages = exercise.supportedLanguages ?? ["JavaScript"];
  const [language, setLanguage] = useState(supportedLanguages[0]);
  const [code, setCode] = useState(buildStarterCode(exercise, supportedLanguages[0]));
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [submissionSummary, setSubmissionSummary] =
    useState<SubmissionSummary | null>(null);
  const bestProgress = mockUserExerciseProgress.find(
    (progress) => progress.codingExerciseId === exercise.id,
  );

  const testCases = mockTestCases[exercise.id] ?? [];

  const pushArenaState = (
    next:
      | {
          passedTests?: number;
          submissionStatus?: SubmissionSummary["status"] | "IDLE";
          xpEarned?: number;
          domainPointsEarned?: number;
        }
      | undefined = undefined,
  ) => {
    onStateChange?.({
      exerciseId: exercise.id,
      exerciseTitle: exercise.title,
      bestSolveTime: bestProgress?.bestSolveTime,
      totalTests: testCases.length,
      passedTests: next?.passedTests ?? 0,
      submissionStatus: next?.submissionStatus ?? "IDLE",
      xpEarned: next?.xpEarned ?? 0,
      domainPointsEarned: next?.domainPointsEarned ?? 0,
    });
  };

  useEffect(() => {
    onStateChange?.({
      exerciseId: exercise.id,
      exerciseTitle: exercise.title,
      bestSolveTime: bestProgress?.bestSolveTime,
      totalTests: testCases.length,
      passedTests: 0,
      submissionStatus: "IDLE",
      xpEarned: 0,
      domainPointsEarned: 0,
    });
  }, [
    onStateChange,
    exercise.id,
    exercise.title,
    bestProgress?.bestSolveTime,
    testCases.length,
  ]);

  const runTests = () => {
    setIsRunning(true);
    setSubmissionSummary(null);

    const evaluation = evaluateSolution(exercise, code);

    window.setTimeout(() => {
      const results = testCases.map((testCase, index) => {
        const passed = index < evaluation.passedCount;
        const isTimeout =
          evaluation.status === "TLE" && index === testCases.length - 1;

        return {
          id: testCase.id,
          passed: isTimeout ? false : passed,
          time: isTimeout ? labels.timeout : `${18 + index * 7}ms`,
          hidden: testCase.isHidden,
        };
      });

      setTestResults(results);
      pushArenaState({
        passedTests: results.filter((result) => result.passed).length,
        submissionStatus: "IDLE",
      });
      setIsRunning(false);
    }, 900);
  };

  const handleSubmit = () => {
    setIsRunning(true);

    const evaluation = evaluateSolution(exercise, code);
    const previousXp = bestProgress?.bestXpEarned ?? 0;
    const xpEarned =
      evaluation.status === "ACCEPTED"
        ? Math.max(exercise.baseXp - previousXp, 0)
        : 0;

    window.setTimeout(() => {
      const results = testCases.map((testCase, index) => ({
        id: testCase.id,
        passed: index < evaluation.passedCount,
        time:
          evaluation.status === "TLE" && index === testCases.length - 1
            ? labels.timeout
            : `${20 + index * 5}ms`,
        hidden: testCase.isHidden,
      }));

      setTestResults(results);
      setSubmissionSummary({
        status: evaluation.status,
        xpEarned,
        maxXpReached: previousXp + xpEarned >= exercise.baseXp,
        domainPointsEarned:
          evaluation.status === "ACCEPTED" ? exercise.domainPoints ?? 0 : 0,
        executionTimeMs: 62 + exercise.baseXp,
        passedCount: evaluation.passedCount,
        totalCount: testCases.length,
      });
      pushArenaState({
        passedTests: evaluation.passedCount,
        submissionStatus: evaluation.status,
        xpEarned,
        domainPointsEarned:
          evaluation.status === "ACCEPTED" ? exercise.domainPoints ?? 0 : 0,
      });
      setIsRunning(false);
    }, 1200);
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-between rounded-sm border border-border bg-card/40 p-3">
        <div className="flex items-center gap-4">
          <div className="rounded-sm border border-coral-400/20 bg-coral-400/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-coral-400">
            {exercise.difficulty}
          </div>
          <div>
            <h2 className="font-mono text-sm font-bold">{exercise.title}</h2>
            <p className="font-mono text-[10px] uppercase text-muted-foreground">
              {exercise.category} • {exercise.baseXp} XP
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-sm border border-border bg-muted/20 px-3 py-1">
            <span className="font-mono text-[10px] uppercase text-muted-foreground">
              {labels.timer}:
            </span>
            <span className="text-sm font-mono font-bold">
              {exercise.maxSolveTimeMinutes}:00
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-sm border border-primary/20 bg-primary/10 px-3 py-1">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono text-[10px] uppercase text-primary">
              {labels.best}: {bestProgress?.bestSolveTime ?? "--"} min
            </span>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-4">
        <div className="flex w-1/3 flex-col overflow-hidden rounded-sm border border-border bg-card/20">
          <div className="border-b border-border bg-muted/10 px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {labels.statement}
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto p-6 scrollbar-hide">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {exercise.description}
            </p>

            <InfoSection title={labels.inputFormat} content={exercise.inputFormat ?? "-"} />
            <InfoSection
              title={labels.outputFormat}
              content={exercise.outputFormat ?? "-"}
            />
            <InfoSection
              title={labels.constraints}
              content={exercise.constraints ?? "-"}
            />
            <CodeSection title={labels.sampleInput} content={exercise.sampleInput ?? "-"} />
            <CodeSection
              title={labels.sampleOutput}
              content={exercise.sampleOutput ?? "-"}
              highlight
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="group relative flex flex-1 flex-col overflow-hidden rounded-sm border border-border bg-[#0d0f14]">
            <div className="flex items-center justify-between border-b border-border bg-card/40 px-4 py-2">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-2 font-mono text-[10px] text-primary"
                >
                  <Terminal className="h-3 w-3" />
                  solution.{language === "Python 3.10" ? "py" : language === "C++17" ? "cpp" : language === "Rust 1.60" ? "rs" : "ts"}
                </Button>
                <div className="font-mono text-[10px] text-muted-foreground opacity-60">
                  {labels.saved}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase text-muted-foreground">
                  {labels.languages}
                </span>
                <select
                  className="cursor-pointer bg-transparent font-mono text-[10px] text-muted-foreground outline-none"
                  value={language}
                  onChange={(event) => {
                    const nextLanguage = event.target.value;
                    setLanguage(nextLanguage);
                    setCode(buildStarterCode(exercise, nextLanguage));
                  }}
                >
                  {supportedLanguages.map((entry) => (
                    <option key={entry}>{entry}</option>
                  ))}
                </select>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>

            <textarea
              className="flex-1 resize-none bg-transparent p-6 font-mono text-sm leading-relaxed text-blue-100 outline-none scrollbar-hide"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              spellCheck={false}
            />

            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="h-9 gap-2 border border-border/50 px-4 font-mono text-[10px]"
                onClick={runTests}
                disabled={isRunning}
              >
                <Play className={cn("h-3 w-3", isRunning && "animate-spin")} />
                {labels.runTests}
              </Button>
              <Button
                size="sm"
                className="h-9 gap-2 bg-primary px-6 font-mono text-[10px] text-primary-foreground"
                disabled={isRunning}
                onClick={handleSubmit}
              >
                <Send className="h-3 w-3" />
                {labels.submit}
              </Button>
            </div>
          </div>

          <div className="flex h-56 flex-col overflow-hidden rounded-sm border border-border bg-card/40">
            <div className="border-b border-border bg-muted/10 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {labels.console}
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4 font-mono text-[11px] scrollbar-hide">
              {isRunning ? (
                <div className="flex items-center gap-3 text-primary animate-pulse">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>{labels.testing}</span>
                </div>
              ) : null}

              {testResults?.map((result, index) => (
                <div key={result.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {result.passed ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-rose-500" />
                    )}
                    <span>
                      {labels.caseLabel} #{index + 1}{" "}
                      {result.hidden ? `(${labels.hiddenCase})` : ""}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "font-bold uppercase",
                      result.passed ? "text-green-500" : "text-rose-500",
                    )}
                  >
                    {result.time === labels.timeout
                      ? labels.timeout
                      : result.passed
                        ? labels.pass
                        : labels.fail}{" "}
                    • {result.time}
                  </div>
                </div>
              ))}

              {submissionSummary ? (
                <div className="rounded-sm border border-primary/20 bg-primary/5 p-4">
                  <div className="mb-3 flex items-center gap-2 text-primary">
                    {submissionSummary.status === "ACCEPTED" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <span className="font-bold uppercase">
                      {labels.submitResult}:{" "}
                      {submissionSummary.status === "ACCEPTED"
                        ? labels.accepted
                        : submissionSummary.status === "TLE"
                          ? labels.timeout
                          : labels.wrongAnswer}
                    </span>
                  </div>
                  <div className="grid gap-2 text-[10px] uppercase text-muted-foreground sm:grid-cols-2">
                    <span>
                      {labels.totalTests}: {submissionSummary.passedCount}/
                      {submissionSummary.totalCount}
                    </span>
                    <span>
                      {labels.executionTime}: {submissionSummary.executionTimeMs}ms
                    </span>
                    <span>
                      {labels.xpEarned}: {submissionSummary.xpEarned}
                    </span>
                    <span>
                      {labels.domainPoints}:{" "}
                      {submissionSummary.domainPointsEarned}
                    </span>
                  </div>
                  {submissionSummary.maxXpReached ? (
                    <p className="mt-3 text-[10px] uppercase text-primary">
                      {labels.maxed}
                    </p>
                  ) : null}
                </div>
              ) : !isRunning && !testResults ? (
                <div className="text-muted-foreground">{labels.waitingAction}</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoSection({ title, content }: { title: string; content: string }) {
  return (
    <section className="space-y-2">
      <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest">
        {title}
      </h4>
      <div className="rounded-sm border border-border bg-muted/10 p-3 text-xs font-mono">
        {content}
      </div>
    </section>
  );
}

function CodeSection({
  title,
  content,
  highlight = false,
}: {
  title: string;
  content: string;
  highlight?: boolean;
}) {
  return (
    <section className="space-y-2">
      <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest">
        {title}
      </h4>
      <pre
        className={cn(
          "overflow-x-auto rounded-sm border border-border bg-muted/10 p-3 text-xs font-mono",
          highlight && "text-teal-400",
        )}
      >
        {content}
      </pre>
    </section>
  );
}
