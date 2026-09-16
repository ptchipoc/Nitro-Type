import { randomUUID } from 'crypto';

export abstract class BaseEntity {
  public readonly id:        string;
  public readonly createdAt: Date;
  public          updatedAt: Date;

  constructor(id?: string, createdAt?: Date, updatedAt?: Date) {
    this.id        = id        ?? randomUUID();
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
  }

  protected touch(): void { this.updatedAt = new Date(); }
}
