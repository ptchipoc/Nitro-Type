// ─── Community Mock Data ───────────────────────────────────────────────────
import type { Locale } from "@/lib/i18n";
export type MemberRole =
  | "MASTER_ADMIN"
  | "GROUP_OWNER"
  | "GROUP_ADMIN"
  | "GROUP_MEMBER"
  | "GROUP_VIEWER";

export type OnlineStatus = "online" | "away" | "offline" | "dnd";

export interface CommunityMember {
  id: string;
  name: string;
  username: string;
  avatarInitials: string;
  role: MemberRole;
  status: OnlineStatus;
  badge?: string; // e.g. "42 Lisboa"
}

export interface CommunityMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  authorRole: MemberRole;
  content: string;
  createdAt: string; // ISO
  edited?: boolean;
  reactions?: { emoji: string; count: number; reacted: boolean }[];
  mentions?: string[];
  authorAvatarUrl?: string;
}

export interface CommunityChannel {
  id: string;
  name: string;
  slug: string;
  description: string;
  isPlatformManaged: boolean; // true = MASTER_ADMIN only
  memberCount?: number;
  isPrivate: boolean;
  unreadCount?: number;
  lastMessage?: string;
  createdBy?: string;
}

export interface DirectMessage {
  id: string;
  userId: string;
  name: string;
  username: string;
  initials: string;
  status: OnlineStatus;
  lastMessage: string;
  lastAt: string;
  unreadCount?: number;
}

export interface CommunityUser {
  id: string;
  name: string;
  username: string;
  initials: string;
  status: OnlineStatus;
}

export const mockCommunityUsers: CommunityUser[] = [
  {
    id: "u-001",
    name: "Neo Coder",
    username: "neo_coder42",
    initials: "NC",
    status: "online",
  },
  {
    id: "u-002",
    name: "Ana Ferreira",
    username: "ana_f",
    initials: "AF",
    status: "online",
  },
  {
    id: "u-003",
    name: "Pedro Lopes",
    username: "plopes_42",
    initials: "PL",
    status: "away",
  },
  {
    id: "u-004",
    name: "Maria Santos",
    username: "m_santos",
    initials: "MS",
    status: "offline",
  },
  {
    id: "u-005",
    name: "Tiago Alves",
    username: "talves",
    initials: "TA",
    status: "offline",
  },
  {
    id: "u-006",
    name: "Ines Costa",
    username: "ines_c",
    initials: "IC",
    status: "dnd",
  },
  {
    id: "u-007",
    name: "Rui Fontes",
    username: "rui_f42",
    initials: "RF",
    status: "online",
  },
  {
    id: "u-008",
    name: "Beatriz Lima",
    username: "blima",
    initials: "BL",
    status: "away",
  },
];

// ─── Platform Channels (MASTER_ADMIN managed) ─────────────────────────────
export const mockPlatformChannels: CommunityChannel[] = [
  {
    id: "ch-general",
    name: "general",
    slug: "general",
    description: "Discussões gerais da plataforma NT",
    isPlatformManaged: true,
     isPrivate: false,
    unreadCount: 12,
    lastMessage: "Bem-vindos ao NT! 🚀",
  },
  {
    id: "ch-announcements",
    name: "announcements",
    slug: "announcements",
    description: "Anúncios oficiais da plataforma",
    isPlatformManaged: true,
    //memberCount: 0,
    isPrivate: false,
    unreadCount: 3,
    lastMessage: "Nova atualização: módulo competitive lançado!",
  },
  {
    id: "ch-showcase",
    name: "showcase",
    slug: "showcase",
    description: "Partilha os teus projetos e conquistas",
    isPlatformManaged: true,
    //memberCount: 0,
    isPrivate: false,
    lastMessage: "Completei o algoritmo de Dijkstra 🎉",
  },
  {
    id: "ch-feedback",
    name: "feedback",
    slug: "feedback",
    description: "Sugestões e feedback para a equipa",
    isPlatformManaged: true,
    //memberCount: 0,
    isPrivate: false,
  },
];

// ─── My Private Groups ─────────────────────────────────────────────────────
export const mockPrivateGroups: CommunityChannel[] = [
  {
    id: "grp-42lisboa",
    name: "42 Lisboa Crew",
    slug: "42-lisboa",
    description: "Grupo privado dos alunos da 42 Lisboa",
    isPlatformManaged: false,
    //memberCount: 38,
    isPrivate: true,
    unreadCount: 5,
    lastMessage: "Alguém para o evento de sexta?",
  },
  {
    id: "grp-algo",
    name: "Algo Masters",
    slug: "algo-masters",
    description: "Estudo de algoritmia avançada",
    isPlatformManaged: false,
    //memberCount: 12,
    isPrivate: true,
    lastMessage: "Binary lifting é insano",
  },
  {
    id: "grp-rust",
    name: "Rustaceans PT",
    slug: "rustaceans-pt",
    description: "Entusiastas de Rust em Portugal",
    isPlatformManaged: false,
    //memberCount: 21,
    isPrivate: true,
    unreadCount: 1,
    lastMessage: "alguem ja usou tokio + axum?",
  },
];

// ─── Direct Messages ───────────────────────────────────────────────────────
export const mockDMs: DirectMessage[] = [
  {
    id: "dm-1",
    userId: "u-002",
    name: "Ana Ferreira",
    username: "ana_f",
    initials: "AF",
    status: "online",
    lastMessage: "Viste o meu PR? 😅",
    lastAt: "2026-03-19T14:32:00Z",
    unreadCount: 2,
  },
  {
    id: "dm-2",
    userId: "u-003",
    name: "Pedro Lopes",
    username: "plopes_42",
    initials: "PL",
    status: "away",
    lastMessage: "Ok, vejo amanhã!",
    lastAt: "2026-03-19T11:10:00Z",
  },
  {
    id: "dm-3",
    userId: "u-004",
    name: "Maria Santos",
    username: "m_santos",
    initials: "MS",
    status: "offline",
    lastMessage: "Obrigada pela ajuda com o sorting!",
    lastAt: "2026-03-18T20:00:00Z",
  },
];

// ─── Channel Members ───────────────────────────────────────────────────────
export const mockChannelMembers: CommunityMember[] = [
  {
    id: "u-admin",
    name: "Admin NT",
    username: "admin_nt",
    avatarInitials: "AN",
    role: "MASTER_ADMIN",
    status: "online",
    badge: "Staff",
  },
  {
    id: "u-001",
    name: "Neo Coder",
    username: "neo_coder42",
    avatarInitials: "NC",
    role: "GROUP_OWNER",
    status: "online",
    badge: "42 Lisboa",
  },
  {
    id: "u-002",
    name: "Ana Ferreira",
    username: "ana_f",
    avatarInitials: "AF",
    role: "GROUP_ADMIN",
    status: "online",
  },
  {
    id: "u-003",
    name: "Pedro Lopes",
    username: "plopes_42",
    avatarInitials: "PL",
    role: "GROUP_MEMBER",
    status: "away",
  },
  {
    id: "u-004",
    name: "Maria Santos",
    username: "m_santos",
    avatarInitials: "MS",
    role: "GROUP_MEMBER",
    status: "offline",
  },
  {
    id: "u-005",
    name: "Tiago Alves",
    username: "talves",
    avatarInitials: "TA",
    role: "GROUP_VIEWER",
    status: "offline",
  },
  {
    id: "u-006",
    name: "Inês Costa",
    username: "ines_c",
    avatarInitials: "IC",
    role: "GROUP_MEMBER",
    status: "dnd",
  },
];

// ─── Channel Messages ──────────────────────────────────────────────────────
export const mockMessages: Record<string, CommunityMessage[]> = {
  "ch-general": [
    {
      id: "msg-1",
      authorId: "u-admin",
      authorName: "Admin NT",
      authorInitials: "AN",
      authorRole: "MASTER_ADMIN",
      content:
        "Bem-vindos ao canal #general do NT! 🚀 Este é o espaço para discussão geral. Respeitem as regras da comunidade.",
      createdAt: "2026-03-19T08:00:00Z",
    },
    {
      id: "msg-2",
      authorId: "u-002",
      authorName: "Ana Ferreira",
      authorInitials: "AF",
      authorRole: "GROUP_MEMBER",
      content: "Oi pessoal! Alguém aqui a fazer o módulo de Typing?",
      createdAt: "2026-03-19T09:15:00Z",
      reactions: [{ emoji: "👋", count: 4, reacted: false }],
    },
    {
      id: "msg-3",
      authorId: "u-001",
      authorName: "Neo Coder",
      authorInitials: "NC",
      authorRole: "GROUP_OWNER",
      content:
        "Sim! Já cheguei ao nível 27 no typing. O segredo é praticar com código real, não texto normal.",
      createdAt: "2026-03-19T09:18:00Z",
      reactions: [
        { emoji: "🔥", count: 6, reacted: true },
        { emoji: "💯", count: 3, reacted: false },
      ],
    },
    {
      id: "msg-4",
      authorId: "u-003",
      authorName: "Pedro Lopes",
      authorInitials: "PL",
      authorRole: "GROUP_MEMBER",
      content:
        "Alguém tem dicas para o módulo Competitive? Estou preso num problema de grafos 😅",
      createdAt: "2026-03-19T10:30:00Z",
    },
    {
      id: "msg-5",
      authorId: "u-001",
      authorName: "Neo Coder",
      authorInitials: "NC",
      authorRole: "GROUP_OWNER",
      content:
        "Para grafos: começa sempre por modelar bem o problema. BFS para caminhos mínimos não pesados, Dijkstra para grafos pesados. Partilha o problema aqui!",
      createdAt: "2026-03-19T10:45:00Z",
      edited: true,
    },
    {
      id: "msg-6",
      authorId: "u-006",
      authorName: "Inês Costa",
      authorInitials: "IC",
      authorRole: "GROUP_MEMBER",
      content:
        "O novo módulo de bugs é incrível. Já aprendi tanto com os erros dos outros 😂",
      createdAt: "2026-03-19T13:20:00Z",
      reactions: [{ emoji: "😂", count: 8, reacted: true }],
    },
    {
      id: "msg-7",
      authorId: "u-004",
      authorName: "Maria Santos",
      authorInitials: "MS",
      authorRole: "GROUP_MEMBER",
      content:
        "Alguém quer fazer pair programming amanhã? Estou a trabalhar num problema de DP.",
      createdAt: "2026-03-19T14:00:00Z",
    },
  ],
  "ch-announcements": [
    {
      id: "ann-1",
      authorId: "u-admin",
      authorName: "Admin NT",
      authorInitials: "AN",
      authorRole: "MASTER_ADMIN",
      content:
        "🎉 **Novo módulo lançado!** O módulo de Programação Competitiva já está disponível para todos os utilizadores. Comecem com os exercícios básicos e subam de nível!",
      createdAt: "2026-03-18T10:00:00Z",
      reactions: [
        { emoji: "🎉", count: 42, reacted: false },
        { emoji: "🚀", count: 21, reacted: false },
      ],
    },
    {
      id: "ann-2",
      authorId: "u-admin",
      authorName: "Admin NT",
      authorInitials: "AN",
      authorRole: "MASTER_ADMIN",
      content:
        "📢 Manutenção programada para domingo às 03:00 UTC. A plataforma ficará indisponível por ~30 minutos.",
      createdAt: "2026-03-19T09:00:00Z",
    },
  ],
};

const channelTranslations: Partial<
  Record<Locale, Record<string, Partial<CommunityChannel>>>
> = {
  pt: {
    "ch-general": {
      name: "geral",
      description: "Discussoes gerais da plataforma NT",
      lastMessage: "Bem-vindos ao NT! 🚀",
    },
    "ch-announcements": {
      name: "anuncios",
      description: "Anuncios oficiais da plataforma",
      lastMessage: "Nova atualizacao: modulo competitive lancado!",
    },
    "ch-showcase": {
      name: "montra",
      description: "Partilha os teus projetos e conquistas",
      lastMessage: "Completei o algoritmo de Dijkstra 🎉",
    },
    "ch-feedback": {
      name: "feedback",
      description: "Sugestoes e feedback para a equipa",
    },
    "grp-42lisboa": {
      name: "42 Lisboa Crew",
      description: "Grupo privado dos alunos da 42 Lisboa",
      lastMessage: "Alguem para o evento de sexta?",
    },
    "grp-algo": {
      name: "Algo Masters",
      description: "Estudo de algoritmia avancada",
      lastMessage: "Binary lifting e insano",
    },
    "grp-rust": {
      name: "Rustaceans PT",
      description: "Entusiastas de Rust em Portugal",
      lastMessage: "alguem ja usou tokio + axum?",
    },
  },
  en: {
    "ch-general": {
      name: "general",
      description: "General discussions about the NT platform",
      lastMessage: "Welcome to NT! 🚀",
    },
    "ch-announcements": {
      name: "announcements",
      description: "Official platform announcements",
      lastMessage: "New update: competitive module released!",
    },
    "ch-showcase": {
      name: "showcase",
      description: "Share your projects and achievements",
      lastMessage: "I finished the Dijkstra algorithm 🎉",
    },
    "ch-feedback": {
      name: "feedback",
      description: "Suggestions and feedback for the team",
    },
    "grp-42lisboa": {
      name: "42 Lisbon Crew",
      description: "Private group for 42 Lisbon students",
      lastMessage: "Anyone up for Friday's event?",
    },
    "grp-algo": {
      name: "Algo Masters",
      description: "Advanced algorithms study group",
      lastMessage: "Binary lifting is wild",
    },
    "grp-rust": {
      name: "Rustaceans PT",
      description: "Rust enthusiasts in Portugal",
      lastMessage: "has anyone used tokio + axum yet?",
    },
  },
  fr: {
    "ch-general": {
      name: "general",
      description: "Discussions generales sur la plateforme NT",
      lastMessage: "Bienvenue sur NT ! 🚀",
    },
    "ch-announcements": {
      name: "annonces",
      description: "Annonces officielles de la plateforme",
      lastMessage: "Nouvelle mise a jour : module competitive lance !",
    },
    "ch-showcase": {
      name: "vitrine",
      description: "Partagez vos projets et reussites",
      lastMessage: "J'ai termine l'algorithme de Dijkstra 🎉",
    },
    "ch-feedback": {
      name: "retours",
      description: "Suggestions et retours pour l'equipe",
    },
    "grp-42lisboa": {
      name: "42 Lisboa Crew",
      description: "Groupe prive des etudiants de 42 Lisbonne",
      lastMessage: "Quelqu'un pour l'evenement de vendredi ?",
    },
    "grp-algo": {
      name: "Algo Masters",
      description: "Groupe d'etude d'algorithmes avances",
      lastMessage: "Le binary lifting est dingue",
    },
    "grp-rust": {
      name: "Rustaceans PT",
      description: "Passionnes de Rust au Portugal",
      lastMessage: "quelqu'un a deja utilise tokio + axum ?",
    },
  },
};

const dmTranslations: Partial<Record<Locale, Record<string, Partial<DirectMessage>>>> = {
  en: {
    "dm-1": { lastMessage: "Did you see my PR? 😅" },
    "dm-2": { lastMessage: "Okay, I'll check tomorrow!" },
    "dm-3": { lastMessage: "Thanks for the help with sorting!" },
  },
  fr: {
    "dm-1": { lastMessage: "Tu as vu ma PR ? 😅" },
    "dm-2": { lastMessage: "D'accord, je regarderai demain !" },
    "dm-3": { lastMessage: "Merci pour l'aide sur le tri !" },
  },
};

const messageTranslations: Partial<Record<Locale, Record<string, string>>> = {
  en: {
    "msg-1":
      "Welcome to the #general channel on NT! 🚀 This is the space for general discussion. Please respect the community rules.",
    "msg-2": "Hi everyone! Is anyone here doing the Typing module?",
    "msg-3":
      "Yes! I've already reached level 27 in typing. The secret is to practice with real code, not normal text.",
    "msg-4":
      "Does anyone have tips for the Competitive module? I'm stuck on a graph problem 😅",
    "msg-5":
      "For graphs: always start by modeling the problem well. BFS for unweighted shortest paths, Dijkstra for weighted graphs. Share the problem here!",
    "msg-6":
      "The new bugs module is incredible. I've already learned so much from other people's mistakes 😂",
    "msg-7":
      "Anyone want to do pair programming tomorrow? I'm working on a DP problem.",
    "ann-1":
      "🎉 **New module released!** The Competitive Programming module is now available to all users. Start with the basic exercises and level up!",
    "ann-2":
      "📢 Scheduled maintenance on Sunday at 03:00 UTC. The platform will be unavailable for about 30 minutes.",
  },
  fr: {
    "msg-1":
      "Bienvenue sur le canal #general de NT ! 🚀 Cet espace est dedie aux discussions generales. Merci de respecter les regles de la communaute.",
    "msg-2":
      "Salut tout le monde ! Quelqu'un ici suit le module de Typing ?",
    "msg-3":
      "Oui ! Je suis deja arrive au niveau 27 en typing. Le secret, c'est de s'entrainer avec du vrai code, pas du texte normal.",
    "msg-4":
      "Quelqu'un a des conseils pour le module Competitive ? Je suis bloque sur un probleme de graphes 😅",
    "msg-5":
      "Pour les graphes : commence toujours par bien modeliser le probleme. BFS pour les plus courts chemins non ponderes, Dijkstra pour les graphes ponderes. Partage le probleme ici !",
    "msg-6":
      "Le nouveau module de bugs est incroyable. J'ai deja tellement appris grace aux erreurs des autres 😂",
    "msg-7":
      "Quelqu'un veut faire du pair programming demain ? Je travaille sur un probleme de DP.",
    "ann-1":
      "🎉 **Nouveau module lance !** Le module de programmation competitive est maintenant disponible pour tous les utilisateurs. Commencez par les exercices de base et montez de niveau !",
    "ann-2":
      "📢 Maintenance prevue dimanche a 03:00 UTC. La plateforme sera indisponible pendant environ 30 minutes.",
  },
};

export function getLocalizedPlatformChannels(locale: Locale): CommunityChannel[] {
  return mockPlatformChannels.map((channel) => ({
    ...channel,
    ...channelTranslations[locale]?.[channel.id],
  }));
}

export function getLocalizedPrivateGroups(locale: Locale): CommunityChannel[] {
  return mockPrivateGroups.map((group) => ({
    ...group,
    ...channelTranslations[locale]?.[group.id],
  }));
}

export function getLocalizedDMs(locale: Locale): DirectMessage[] {
  if (locale === "pt") return mockDMs;
  return mockDMs.map((dm) => ({
    ...dm,
    ...dmTranslations[locale]?.[dm.id],
  }));
}

export function getLocalizedMessages(locale: Locale): Record<string, CommunityMessage[]> {
  if (locale === "pt") return mockMessages;
  return Object.fromEntries(
    Object.entries(mockMessages).map(([channelId, messages]) => [
      channelId,
      messages.map((message) => ({
        ...message,
        content: messageTranslations[locale]?.[message.id] ?? message.content,
      })),
    ]),
  );
}

export function formatRelativeTime(isoString: string, locale: Locale = "pt"): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) {
    return locale === "fr" ? "maintenant" : locale === "en" ? "now" : "agora";
  }
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${diffDays}d`;
}

export function formatMessageTime(isoString: string, locale: Locale = "pt"): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}
