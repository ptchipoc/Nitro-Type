export interface RankingHeroLabels {
  hallOfFame: string;
  title: string;
  ranking: string;
  description: string;
}

export interface PodiumCardLabels {
  level: string;
  xpTotal: string;
  events: string;
  victories: string;
  novice: string;
}

export interface RankingTableLabels {
  rankingHeader: string;
  programmerHeader: string;
  levelHeader: string;
  xpTotalHeader: string;
  xpSuffix: string;
  novice: string;
}

export interface RankingErrorLabels {
  title: string;
  description: string;
}

export interface ProfileLabels {
  RankingHero: RankingHeroLabels;
  PodiumCard: PodiumCardLabels;
  RankingTable: RankingTableLabels;
  RankingError: RankingErrorLabels;
}

export const PROFILE_LABELS = {
  pt: {
    RankingHero: {
      hallOfFame: "Hall of Fame",
      title: "Ranking Global",
      ranking: "Ranking",
      description: "A elite do NT. Os programadores que dominam o ecossistema e lideram o progresso técnico.",
    },
    PodiumCard: {
      level: "Nivel",
      xpTotal: "XP Total",
      events: "Eventos",
      victories: "Vitórias",
      novice: "Novato",
    },
    RankingTable: {
      rankingHeader: "Ranking",
      programmerHeader: "Programador",
      levelHeader: "Nivel",
      xpTotalHeader: "XP Total",
      xpSuffix: "XP",
      novice: "Novato",
    },
    RankingError: {
      title: "Falha ao carregar ranking",
      description: "Não foi possível recuperar os dados da elite.",
    },
  },
  en: {
    RankingHero: {
      hallOfFame: "Hall of Fame",
      title: "Global Ranking",
      ranking: "Ranking",
      description: "The elite of NT. Programmers who master the ecosystem and lead technical progress.",
    },
    PodiumCard: {
      level: "Level",
      xpTotal: "XP Total",
      events: "Events",
      victories: "Wins",
      novice: "Novice",
    },
    RankingTable: {
      rankingHeader: "Ranking",
      programmerHeader: "Programmer",
      levelHeader: "Level",
      xpTotalHeader: "XP Total",
      xpSuffix: "XP",
      novice: "Novice",
    },
    RankingError: {
      title: "Failed to load ranking",
      description: "Could not retrieve elite data.",
    },
  },
  fr: {
    RankingHero: {
      hallOfFame: "Hall of Fame",
      title: "Classement Global",
      ranking: "Classement",
      description: "L'élite de NT. Les programmeurs qui maîtrisent l'écosystème et dirigent le progrès technique.",
    },
    PodiumCard: {
      level: "Niveau",
      xpTotal: "XP Total",
      events: "Événements",
      victories: "Victoires",
      novice: "Débutant",
    },
    RankingTable: {
      rankingHeader: "Classement",
      programmerHeader: "Programmeur",
      levelHeader: "Niveau",
      xpTotalHeader: "XP Total",
      xpSuffix: "XP",
      novice: "Débutant",
    },
    RankingError: {
      title: "Erreur lors du chargement du classement",
      description: "Impossible de récupérer les données d'élite.",
    },
  },
} as const;
