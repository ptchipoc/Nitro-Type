import { BaseEntity } from "@shared/entities/base.entity";
import { randomUUID } from "crypto";
import { XpTransactionEntity } from "./xp-transaction.entity";
import { XpCalculator } from "../helpers/xp-calculator.helper";

const RANK_TITLES: Record<number, string> = {
  1: "Arquiteto Supremo",
  2: "Mestre",
  3: "Especialista",
  4: "Competidor",
  5: "Estrategista",
  6: "Desafiador",
  7: "Programador",
  8: "Aprendiz",
  9: "Explorador",
  10: "Novato",
};

interface UserProgressProps {
  id?: string;
  userId: string;
  totalXp?: number;
  level?: number;
  rank?: number;
  rankTitle?: string | null;
  eventsWon?: number;
  totalEvents?: number;
  lastActivityAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  transactions?: XpTransactionEntity[];
}

export class UserProgressEntity extends BaseEntity {
  private _userId: string;
  private _totalXp: number;
  private _level: number;
  private _rank: number;
  private _rankTitle: string;
  private _eventsWon: number;
  private _totalEvents: number;
  private _lastActivityAt: Date | null;
  private _transactions: XpTransactionEntity[] = [];

  constructor(p: UserProgressProps) {
    super(p.id, p.createdAt, p.updatedAt);
    this._userId = p.userId;
    this._totalXp = p.totalXp ?? 0;
    this._level = p.level ?? 1;
    this._rank = p.rank ?? 10;
    this._rankTitle =
      p.rankTitle ?? UserProgressEntity.resolveRankTitle(this._rank);
    this._eventsWon = p.eventsWon ?? 0;
    this._totalEvents = p.totalEvents ?? 0;
    this._lastActivityAt = p.lastActivityAt ?? null;
    this._transactions = p.transactions ?? [];
  }

  static createDefault(userId: string): UserProgressEntity {
    return new UserProgressEntity({
      id: randomUUID(),
      userId,
      totalXp: 0,
      level: 1,
      rank: 10,
      rankTitle: RANK_TITLES[10],
      eventsWon: 0,
      totalEvents: 0,
      lastActivityAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: UserProgressProps): UserProgressEntity {
    return new UserProgressEntity(props);
  }

  static resolveRankTitle(rank: number): string {
    return RANK_TITLES[rank] ?? "Novato";
  }

  get userId(): string {
    return this._userId;
  }
  get totalXp(): number {
    return this._totalXp;
  }
  get totalEvents(): number {
    return this._totalEvents;
  }
  get level(): number {
    return this._level;
  }
  get rank(): number {
    return this._rank;
  }
  get rankTitle(): string {
    return this._rankTitle;
  }
  get eventsWon(): number {
    return this._eventsWon;
  }
  get lastActivityAt(): Date | null {
    return this._lastActivityAt;
  }
  get transactions(): XpTransactionEntity[] {
    return [...this._transactions];
  }

  /**
   * Adiciona XP e verifica level up.
   */
  addXp(amount: number, reason: string, referenceId?: string): void {
    if (amount <= 0) return;

    this._totalXp += amount;
    this._lastActivityAt = new Date();

    // Criar transação
    const transaction = XpTransactionEntity.create({
      userId: this._userId,
      userModuleProgressId: this.id,
      amount,
      reason,
      referenceId,
    });
    this._transactions.push(transaction);

    this.checkLevelUp();
    this.touch();
  }

  /**
   * Incrementa o contador de eventos
   */
  addEvent(): void {
    this._totalEvents += 1;
    this.touch();
  }

  /**
   * Incrementa o contador de eventos vencidos
   */
  incrementEventsWon(): void {
    this._eventsWon += 1;
    this.touch();
  }

  /**
   * Verifica se o utilizador subiu de nível com base no XP total.
   */
  private checkLevelUp(): void {
    let nextLevelXp = XpCalculator.getXpForNextLevel(this._level);

    // XP atual relativo ao nível atual (XP desde que atingiu o nível atual)
    let currentLevelXp =
      this._totalXp - XpCalculator.getTotalXpForLevel(this._level);

    while (currentLevelXp >= nextLevelXp) {
      this._level++;
      nextLevelXp = XpCalculator.getXpForNextLevel(this._level);
      currentLevelXp =
        this._totalXp - XpCalculator.getTotalXpForLevel(this._level);
    }

    // Rank automático baseado no level (exemplo simples: cada 10 levels sobe um rank)
    const newRank = Math.max(1, 10 - Math.floor(this._level / 10));
    if (newRank !== this._rank) {
      this._rank = newRank;
      this._rankTitle = UserProgressEntity.resolveRankTitle(this._rank);
    }
  }

  updateProgress(data: {
    level?: number;
    rank?: number;
    totalXp?: number;
  }): void {
    if (data.totalXp !== undefined) this._totalXp = data.totalXp;
    if (data.level !== undefined) this._level = data.level;
    if (data.rank !== undefined) {
      this._rank = data.rank;
      this._rankTitle = UserProgressEntity.resolveRankTitle(data.rank);
    }
    this._lastActivityAt = new Date();
    this.checkLevelUp();
    this.touch();
  }

  publicData() {
    return {
      id: this.id,
      userId: this._userId,
      totalXp: this._totalXp,
      level: this._level,
      rank: this._rank,
      rankTitle: this._rankTitle,
      totalEvents: this._totalEvents,
      eventsWon: this._eventsWon,
      lastActivityAt: this._lastActivityAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
