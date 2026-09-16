import { TypingCategory } from "@/lib/api/endpoints/typing/typing.type";
import { RecentActivity } from "./RecentActivity";

export interface Labels {
  module: string;
  title: string;
  description: string;
  configureSession: string;
  soloMode: string;
  codeCategory: string;
  difficulty: string;
  startSolo: string;
  challengeFriends: string;
  accuracyMap: string;
  accuracySubtitle: string;
  problematic: string;
  excellent: string;
  moduleStatus: string;
  globalProgress: string;
  rankLabel: string;
  moduleXp: string;
  world: string;
  local: string;
  recentActivity: string;
  challengePreview: string;
  challengeText: string;
  timeLimit: string;
  estimatedXp: string;
  sessionsToday: string;
  totalUserXp: string;
  userRank: string;
  lastSessionWpm: string;
  lastSessionAccuracy: string;
  avgAccuracy: string;
  previewHint: string;
  seccion: string;
  performance: string;
  summary: string;
  session: string;
  missionAccomplished: string;
  missionAccomplishedSubtitle: string;
  missionTimeout: string;
  missionTimeoutSubtitle: string;
  missionAbandoned: string;
  missionAbandonedSubtitle: string;
  averageSpeed: string;
  averageSpeedDescription: string;
  globalAccuracy: string;
  globalAccuracyDescription: string;
  charactersTyped: string;
  charactersTypedDescription: string;
  sessionIntegrity: string;
  sessionIntegrityDescription: string;
  experienceAndScore: string;
  experienceXp: string;
  back: string;
  creating: string;
  repeat: string;
  detailedBreakdown: string;
  correctChars: string;
  errorCount: string;
  duration: string;
  soloPractice: string;
  soloSession: string;
  leaveArena: string;
  noRecentActivity: string;
};

export const labelsByLocale = {
  pt: {
    module: "Modulo 1",
    title: "Typing Code",
    description:
      "Seleciona categoria e dificuldade, vê o challenge antes de entrar e inicia a sessão solo com contexto coerente.",
    configureSession: "Configurar Sessão",
    soloMode: "Modo Solo",
    codeCategory: "Categoria de Código",
    difficulty: "Nível de Dificuldade",
    startSolo: "Inicializar Solo",
    challengeFriends: "Jogar com Amigos",
    accuracyMap: "Mapa de Precisão",
    accuracySubtitle: "Últimas sessões e pontos fracos do teclado técnico",
    problematic: "Problemático",
    excellent: "Excelente",
    moduleStatus: "Estado do Módulo",
    globalProgress: "Progressão Global",
    rankLabel: "Rank Atual",
    moduleXp: "XP do Módulo",
    world: "Mundial",
    local: "Local (42LX)",
    recentActivity: "Sessões Recentes",
    challengePreview: "Preview do Challenge",
    challengeText: "Texto ou código sorteado",
    timeLimit: "Tempo limite",
    estimatedXp: "XP estimado",
    sessionsToday: "Sessões Hoje",
    totalUserXp: "XP Total",
    userRank: "Rank Global",
    lastSessionWpm: "Última Velocidade",
    lastSessionAccuracy: "Última Precisão",
    avgAccuracy: "Precisão Global",
    previewHint: "A sessão solo abre com esta configuração.",
    seccion: "Secão",
    performance: "Performance",
    summary: "Resumo",
    session: "Sessão",
    missionAccomplished: "Missão Cumprida",
    missionAccomplishedSubtitle: "Missão terminada com sucesso. Dados de performance sincronizados.",
    missionTimeout: "Tempo Esgotado",
    missionTimeoutSubtitle: "O tempo esgotou antes de terminares o desafio. Tenta ser mais rápido!",
    missionAbandoned: "Missão Abandonada",
    missionAbandonedSubtitle: "A missão foi interrompida prematuramente. O progresso foi limitado.",
    averageSpeed: "Velocidade Média",
    averageSpeedDescription: "Palavras por minuto ao longo da duração total.",
    globalAccuracy: "Precisão Global",
    globalAccuracyDescription: "Percentagem de teclas que corresponderam exatamente.",
    charactersTyped: "Caracteres Digitados",
    charactersTypedDescription: "Quantidade total de entrada processada durante a sessão.",
    sessionIntegrity: "Integridade da Sessão",
    sessionIntegrityDescription: "Estado geral de conclusão e saúde da sessão.",
    experienceAndScore: "Experiência e Pontuação",
    experienceXp: "Experiência XP",
    back: "Voltar",
    creating: "Criando...",
    repeat: "Repetir",
    detailedBreakdown: "Detalhamento",
    correctChars: "Caracteres Corretos",
    errorCount: "Contagem de Erros",
    errorRate: "Taxa de Erro",
    duration: "Duração",
    soloPractice: "PRÁTICA SOLO",
    soloSession: "SESSÃO SOLO",
    leaveArena: "Abandonar Arena",
    noRecentActivity: "Nenhuma Atividade Recente",
  },
  en: {
    module: "Module 1",
    title: "Typing Code",
    description:
      "Select category and difficulty, inspect the challenge before entering, and start the solo session with coherent context.",
    configureSession: "Configure Session",
    soloMode: "Solo Mode",
    codeCategory: "Code Category",
    difficulty: "Difficulty Level",
    startSolo: "Start Solo",
    challengeFriends: "Play with Friends",
    accuracyMap: "Accuracy Map",
    accuracySubtitle:
      "Recent sessions and weak points on the technical keyboard",
    problematic: "Problematic",
    excellent: "Excellent",
    moduleStatus: "Module Status",
    globalProgress: "Global Progress",
    rankLabel: "Current Rank",
    moduleXp: "Module XP",
    world: "Global",
    local: "Local (42LX)",
    recentActivity: "Recent Sessions",
    challengePreview: "Challenge Preview",
    challengeText: "Generated text or code",
    timeLimit: "Time limit",
    estimatedXp: "Estimated XP",
    sessionsToday: "Sessions Today",
    totalUserXp: "Total XP",
    userRank: "Global Rank",
    lastSessionWpm: "Last Speed",
    lastSessionAccuracy: "Last Accuracy",
    avgAccuracy: "Global Accuracy",
    previewHint: "The solo session opens with this exact configuration.",
    seccion: "Section",
    performance: "Performance",
    summary: "Summary",
    session: "Session",
    missionAccomplished: "Mission Accomplished",
    missionAccomplishedSubtitle: "Mission completed successfully. Performance data synchronized.",
    missionTimeout: "Mission Timeout",
    missionTimeoutSubtitle: "Time ran out before you could finish the challenge. Try to be faster!",
    missionAbandoned: "Mission Abandoned",
    missionAbandonedSubtitle: "The mission was interrupted prematurely. Progress was limited.",
    averageSpeed: "Average Speed",
    averageSpeedDescription: "Words per minute across total duration.",
    globalAccuracy: "Global Accuracy",
    globalAccuracyDescription: "Percent of keystrokes that matched exactly.",
    charactersTyped: "Characters Typed",
    charactersTypedDescription: "Total amount of input processed during session.",
    sessionIntegrity: "Session Integrity",
    sessionIntegrityDescription: "Overall session completion and health status.",
    experienceAndScore: "Experience & Score",
    experienceXp: "Experience XP",
    back: "Back",
    creating: "Creating...",
    repeat: "Repeat",
    detailedBreakdown: "Detailed Breakdown",
    correctChars: "Correct Chars",
    errorCount: "Error Count",
    errorRate: "Error Rate",
    duration: "Duration",
    soloPractice: "SOLO PRACTICE",
    soloSession: "SOLO SESSION",
    leaveArena: "Leave Arena",
    noRecentActivity: "No Recent Activity",
  },
  fr: {
    module: "Module 1",
    title: "Typing Code",
    description:
      "Sélectionnez catégorie et difficulté, visualisez le défi antes de entrar e démarrez la session solo avec un contexto cohérent.",
    configureSession: "Configurer la session",
    soloMode: "Mode solo",
    codeCategory: "Catégorie de code",
    difficulty: "Niveau de difficulté",
    startSolo: "Démarrer solo",
    challengeFriends: "Jouer avec des amis",
    accuracyMap: "Carte de précision",
    accuracySubtitle:
      "Sessions récentes et points faibles du clavier technique",
    problematic: "Problématique",
    excellent: "Excellent",
    moduleStatus: "État du module",
    globalProgress: "Progression globale",
    rankLabel: "Rang actuel",
    moduleXp: "XP du module",
    world: "Monde",
    local: "Local (42LX)",
    recentActivity: "Sessions récentes",
    challengePreview: "Aperçu du défi",
    challengeText: "Texte ou code généré",
    timeLimit: "Temps limite",
    estimatedXp: "XP estimé",
    sessionsToday: "Sessions aujourd'hui",
    totalUserXp: "XP Total",
    userRank: "Rang Global",
    lastSessionWpm: "Dernière Vitesse",
    lastSessionAccuracy: "Dernière Précision",
    avgAccuracy: "Précision globale",
    previewHint: "La session solo s'ouvre avec cette configuration.",
    seccion: "Section",
    performance: "Performance",
    summary: "Résumé",
    session: "Session",
    missionAccomplished: "Mission Accomplie",
    missionAccomplishedSubtitle: "Mission terminée avec succès. Données de performance synchronisées.",
    missionTimeout: "Délai Dépassé",
    missionTimeoutSubtitle: "Le temps s'est écoulé avant que vous ne puissiez terminer le défi. Essayez d'être plus rapide !",
    missionAbandoned: "Mission Abandonnée",
    missionAbandonedSubtitle: "La mission a été interrompue prématurément. Le progrès était limité.",
    averageSpeed: "Vitesse Moyenne",
    averageSpeedDescription: "Mots par minute sur la durée totale.",
    globalAccuracy: "Précision Globale",
    globalAccuracyDescription: "Pourcentage de frappes qui correspondaient exactement.",
    charactersTyped: "Caractères Saisis",
    charactersTypedDescription: "Quantité totale d'entrée traitée pendant la session.",
    sessionIntegrity: "Intégrité de la Session",
    sessionIntegrityDescription: "État général d'achèvement et de santé de la session.",
    experienceAndScore: "Expérience et Score",
    experienceXp: "Expérience XP",
    back: "Retour",
    creating: "Création...",
    repeat: "Répéter",
    detailedBreakdown: "Détail",
    correctChars: "Caractères Corrects",
    errorCount: "Nombre d'Erreurs",
    errorRate: "Taux d'Erreur",
    duration: "Durée",
    soloPractice: "PRATIQUE SOLO",
    soloSession: "SESSION SOLO",
    leaveArena: "Quitter l'Arène",
    noRecentActivity: "Aucune Activité Récente",
  },
} as const;

export const localizedCategoryNames = {
  pt: {
    [TypingCategory.ANIME]: "Anime",
    [TypingCategory.FUNCTIONS]: "Funções",
    [TypingCategory.ALGORITHMS]: "Algoritmos",
  },
  en: {
    [TypingCategory.ANIME]: "Anime",
    [TypingCategory.FUNCTIONS]: "Functions",
    [TypingCategory.ALGORITHMS]: "Algorithms",
  },
  fr: {
    [TypingCategory.ANIME]: "Anime",
    [TypingCategory.FUNCTIONS]: "Fonctions",
    [TypingCategory.ALGORITHMS]: "Algorithmes",
  },
} as const;

export const localizedDifficultyNames = {
  pt: {
    EASY: "Fácil",
    MEDIUM: "Médio",
    HARD: "Difícil",
    EXTREME: "Extremo",
  },
  en: {
    EASY: "Easy",
    MEDIUM: "Medium",
    HARD: "Hard",
    EXTREME: "Extreme",
  },
  fr: {
    EASY: "Facile",
    MEDIUM: "Moyen",
    HARD: "Difficile",
    EXTREME: "Extrême",
  },
} as const;

export const categoryDescriptions = {
  pt: {
    [TypingCategory.ANIME]:
      "Citações e frases icónicas de personagens de anime.",
    [TypingCategory.FUNCTIONS]:
      "Treina a escrita de funções completas e assinaturas.",
    [TypingCategory.ALGORITHMS]:
      "Algoritmos clássicos e estruturas de dados complexas.",
  },
  en: {
    [TypingCategory.ANIME]: "Iconic quotes and phrases from anime characters.",
    [TypingCategory.FUNCTIONS]:
      "Practice writing full functions and signatures.",
    [TypingCategory.ALGORITHMS]:
      "Classic algorithms and complex data structures.",
  },
  fr: {
    [TypingCategory.ANIME]:
      "Citations et phrases iconiques de personnages d'anime.",
    [TypingCategory.FUNCTIONS]:
      "Pratiquez l'écriture de fonctions et de signatures complètes.",
    [TypingCategory.ALGORITHMS]:
      "Algorithmes classiques et structures de données complexes.",
  },
} as const;
