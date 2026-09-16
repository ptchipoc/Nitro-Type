export type EventCardLabels = {
  official: string;
  participating: string;
  full: string;
  xpActive: string;
  casualPersonal: string;
  ongoing: string;
  finished: string;
  starts: string;
  event: string;
};

export const eventCardLabelsByLocale = {
  pt: {
    official: "Oficial",
    participating: "participando",
    full: "cheio",
    xpActive: "XP Ativo",
    casualPersonal: "Casual & Pessoal",
    ongoing: "A decorrer...",
    finished: "Terminado",
    starts: "Começa",
    event: "Evento",
  },
  en: {
    official: "Official",
    participating: "participating",
    full: "full",
    xpActive: "Active XP",
    casualPersonal: "Casual & Personal",
    ongoing: "In progress...",
    finished: "Finished",
    starts: "Starts",
    event: "Event",
  },
  fr: {
    official: "Officiel",
    participating: "participants",
    full: "rempli",
    xpActive: "XP actif",
    casualPersonal: "Décontracté & Personnel",
    ongoing: "En cours...",
    finished: "Terminé",
    starts: "Commence",
    event: "Événement",
  },
} as const;
