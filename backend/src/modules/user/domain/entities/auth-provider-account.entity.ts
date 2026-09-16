import { AuthProvider } from "@modules/user/domain/entities/enums/auth-provider.enum";
import { randomUUID } from "crypto";

interface Props {
  id?: string;
  userId: string;
  provider: AuthProvider;
  providerId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class AuthProviderAccountEntity {
  public readonly id: string;
  public readonly userId: string;
  public readonly provider: AuthProvider;
  public providerId: string | null;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(p: Props) {
    this.id = p.id ?? randomUUID();
    this.userId = p.userId;
    this.provider = p.provider;
    this.providerId = p.providerId ?? null;
    this.createdAt = p.createdAt ?? new Date();
    this.updatedAt = p.updatedAt ?? new Date();
  }
}
