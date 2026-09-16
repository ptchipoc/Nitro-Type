import { BaseEntity } from "@shared/entities/base.entity";
import { randomUUID } from "crypto";

interface XpTransactionProps {
  id?: string;
  userId: string;
  userModuleProgressId: string;
  amount: number;
  reason: string;
  referenceId?: string | null;
  createdAt?: Date;
}

export class XpTransactionEntity extends BaseEntity {
  private _userId: string;
  private _userModuleProgressId: string;
  private _amount: number;
  private _reason: string;
  private _referenceId: string | null;

  constructor(p: XpTransactionProps) {
    super(p.id, p.createdAt);
    this._userId = p.userId;
    this._userModuleProgressId = p.userModuleProgressId;
    this._amount = p.amount;
    this._reason = p.reason;
    this._referenceId = p.referenceId ?? null;
  }

  static create(p: {
    userId: string;
    userModuleProgressId: string;
    amount: number;
    reason: string;
    referenceId?: string;
  }): XpTransactionEntity {
    return new XpTransactionEntity({
      id: randomUUID(),
      userId: p.userId,
      userModuleProgressId: p.userModuleProgressId,
      amount: p.amount,
      reason: p.reason,
      referenceId: p.referenceId,
      createdAt: new Date(),
    });
  }

  get userId(): string {
    return this._userId;
  }
  get userModuleProgressId(): string {
    return this._userModuleProgressId;
  }
  get amount(): number {
    return this._amount;
  }
  get reason(): string {
    return this._reason;
  }
  get referenceId(): string | null {
    return this._referenceId;
  }

  publicData() {
    return {
      id: this.id,
      userId: this._userId,
      userModuleProgressId: this._userModuleProgressId,
      amount: this._amount,
      reason: this._reason,
      referenceId: this._referenceId,
      createdAt: this.createdAt,
    };
  }
}
