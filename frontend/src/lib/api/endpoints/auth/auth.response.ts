import { ApiEnvelope } from "../../api";
import { UserRole, UserStatus } from "../user/user.type";

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
