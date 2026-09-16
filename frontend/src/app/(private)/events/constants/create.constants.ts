export type CreateEventLabels = {
  title: string;
  subtitle: string;
  basicInfo: string;
  eventName: string;
  eventNamePlaceholder: string;
  description: string;
  descriptionPlaceholder: string;
  descriptionHint: string;
  privacy: string;
  privacyDescription: string;
  arenaConfig: string;
  roundsCount: string;
  arenaCategory: string;
  difficulty: string;
  betweenRoundsDelay: string;
  betweenRoundsDelayHint: string;
  initialize: string;
  createdSuccessfully: string;
  error: string;
  retryError: string;
  maxParticipants: string;
  maxParticipantsPlaceholder: string;
  maxParticipantsHint: string;
  scheduleEvent: string;
  schedulePlaceholder: string;
  anime: string;
  function: string;
  algorithm: string;
  random: string;
  easy: string;
  medium: string;
  hard: string;
  expert: string;
};

export const labelsByLocale = {
  pt: {
    title: "Criar Novo Evento",
    subtitle: "Configura a tua arena de dactilografia privada",
    basicInfo: "Informação Básica",
    eventName: "Nome do Evento",
    eventNamePlaceholder: "EX: TORNEIO_DE_VERAO_42",
    description: "Descrição",
    descriptionPlaceholder: "OBJETIVOS E REGRAS...",
    descriptionHint: "Descreve o propósito do evento e as regras principais.",
    privacy: "Privacidade",
    privacyDescription: "Esta página cria eventos privados por padrão.",
    arenaConfig: "Configuração da Arena",
    roundsCount: "Número de Rodadas",
    arenaCategory: "Categoria da Arena",
    difficulty: "Dificuldade",
    betweenRoundsDelay: "Delay entre Rodadas (Segundos)",
    betweenRoundsDelayHint: "Mínimo de 5 segundos entre rodadas.",
    initialize: "INICIALIZAR_ARENA",
    createdSuccessfully: "Evento criado com sucesso!",
    error: "Ocorreu um erro inesperado. Tenta novamente.",
    retryError: "Falha ao criar o evento. Por favor tenta novamente.",
    maxParticipants: "Número Máximo de Participantes",
    maxParticipantsPlaceholder: "Deixa vazio para ilimitado",
    maxParticipantsHint: "Define o limite de jogadores que podem participar.",
    scheduleEvent: "Agendar Evento",
    schedulePlaceholder: "Seleciona a data e hora",
    anime: "Anime",
    function: "Função",
    algorithm: "Algoritmo",
    random: "Aleatório",
    easy: "Fácil",
    medium: "Médio",
    hard: "Difícil",
    expert: "Especialista",
  },
  en: {
    title: "Create New Event",
    subtitle: "Configure your private typing arena",
    basicInfo: "Basic Information",
    eventName: "Event Name",
    eventNamePlaceholder: "EX: SUMMER_TOURNAMENT_42",
    description: "Description",
    descriptionPlaceholder: "OBJECTIVES AND RULES...",
    descriptionHint: "Describe the purpose of the event and the main rules.",
    privacy: "Privacy",
    privacyDescription: "This page creates private events by default.",
    arenaConfig: "Arena Configuration",
    roundsCount: "Number of Rounds",
    arenaCategory: "Arena Category",
    difficulty: "Difficulty",
    betweenRoundsDelay: "Delay Between Rounds (Seconds)",
    betweenRoundsDelayHint: "Minimum 5 seconds between rounds.",
    initialize: "INITIALIZE_ARENA",
    createdSuccessfully: "Event created successfully!",
    error: "An unexpected error occurred. Please try again.",
    retryError: "Failed to create event. Please try again.",
    maxParticipants: "Maximum Number of Participants",
    maxParticipantsPlaceholder: "Leave empty for unlimited",
    maxParticipantsHint: "Sets the limit of players who can participate.",
    scheduleEvent: "Schedule Event",
    schedulePlaceholder: "Select the date and time",
    anime: "Anime",
    function: "Function",
    algorithm: "Algorithm",
    random: "Random",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    expert: "Expert",
  },
  fr: {
    title: "Créer un Nouvel Événement",
    subtitle: "Configurez votre arène de dactylographie privée",
    basicInfo: "Informations de Base",
    eventName: "Nom de l'Événement",
    eventNamePlaceholder: "EX: TOURNOI_ETE_42",
    description: "Description",
    descriptionPlaceholder: "OBJECTIFS ET RÈGLES...",
    descriptionHint: "Décrivez l'objectif de l'événement et les règles principales.",
    privacy: "Confidentialité",
    privacyDescription: "Cette page crée des événements privés par défaut.",
    arenaConfig: "Configuration de l'Arène",
    roundsCount: "Nombre de Manches",
    arenaCategory: "Catégorie de l'Arène",
    difficulty: "Difficulté",
    betweenRoundsDelay: "Délai entre les Manches (Secondes)",
    betweenRoundsDelayHint: "Minimum 5 secondes entre les manches.",
    initialize: "INITIALISER_ARENE",
    createdSuccessfully: "Événement créé avec succès!",
    error: "Une erreur inattendue s'est produite. Veuillez réessayer.",
    retryError: "Échec de la création de l'événement. Veuillez réessayer.",
    maxParticipants: "Nombre Maximum de Participants",
    maxParticipantsPlaceholder: "Laissez vide pour illimité",
    maxParticipantsHint: "Définit la limite de joueurs qui peuvent participer.",
    scheduleEvent: "Planifier un Événement",
    schedulePlaceholder: "Sélectionnez la date et l'heure",
    anime: "Anime",
    function: "Fonction",
    algorithm: "Algorithme",
    random: "Aléatoire",
    easy: "Facile",
    medium: "Moyen",
    hard: "Difficile",
    expert: "Expert",
  },
} as const;
