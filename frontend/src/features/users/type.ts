export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  PROVIDER = "PROVIDER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  INACTIVE = "INACTIVE",
  BANNED = "BANNED",
  SUSPENDED = "SUSPENDED",
}

export enum ProfileVisibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}
export type ApiUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: UserRole;
  status: UserStatus;
  avatarUrl: string | null;
  lastLoginAt: string;
  profile: {
    username: string;
    bio: string | null;
    languages: string[];
    country: string | null;
    socialLinks: {
      platform: string;
      url: string;
    }[];
    visibility: ProfileVisibility;
  } | null;
  progress: {
    id: string;
    userId: string;
    totalXp: number;
    level: number;
    rank: number;
    rankTitle: string;
    lastActivityAt: string;
    totalEvents: number;
    eventsWon: number;
    createdAt: string;
    updatedAt: string;
  } | null;
  rankGlobal: number;
  createdAt: string;
  updatedAt: string;
};

export type ApiGetUsersResponse = {
  data: {
    users: ApiUser[];
  };
}

export type seeRecentTransationsXP = {
  id: string;
  amount: number;
  reason: string;
  referenceId: string | null;
  createdAt: string;
};

export type ApiUserUpdateProfile = {
  name?: string;
  avatarUrl?: string;
  bio?: string;
  country?: string;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
};
