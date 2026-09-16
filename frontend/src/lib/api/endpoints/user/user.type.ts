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
  lastLoginAt: string;
  profile: {
    username: string;
    avatarUrl: string | null;
    bio: string | null;
    languages: string[];
    country: string | null;
    socialLinks: string[];
    visibility: ProfileVisibility;
  } | null;
  createdAt: string;
  updatedAt: string;
};
