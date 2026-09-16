import { ApiEnvelope } from "@/lib/api/api";
import { UserRole, UserStatus } from "@/lib/api/endpoints/user/user.type";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
}

interface AuthData {
  user: AuthUser;
}

export type AuthResponse = ApiEnvelope<AuthData>;
