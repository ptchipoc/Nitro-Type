import { randomUUID } from 'crypto';
import { createHash } from 'crypto';

interface Props {
  id?:       string;
  userId:    string;
  token:     string;
  expiresAt: Date;
  createdAt?: Date;
}

export class PasswordResetEntity {
  public readonly id:        string;
  public readonly userId:    string;
  public readonly token:     string;
  public readonly expiresAt: Date;
  public readonly createdAt: Date;

  constructor(p: Props) {
    this.id        = p.id        ?? randomUUID();
    this.userId    = p.userId;
    this.token     = p.token;
    this.expiresAt = p.expiresAt;
    this.createdAt = p.createdAt ?? new Date();
  }

  isExpired(): boolean { return new Date() > this.expiresAt; }

  static generate(userId: string, expiresMinutes = 30): PasswordResetEntity {
    const token     = createHash('sha256').update(randomUUID()).digest('hex');
    const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);
    return new PasswordResetEntity({ userId, token, expiresAt });
  }
}
