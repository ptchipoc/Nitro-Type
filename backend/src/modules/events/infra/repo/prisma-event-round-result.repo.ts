import { Injectable } from "@nestjs/common";
import { EventRoundResultEntity } from "../../domain/entities/event-round-result.entity";
import { EventRoundResultRepository } from "@modules/events/app/repo/event-round-result.repo";
import { PrismaService } from "@shared/database/prisma.service";

@Injectable()
export class EventRoundResultRepositoryImpl
  implements EventRoundResultRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(result: EventRoundResultEntity): Promise<void> {
    const data = result.publicData();
    await this.prisma.eventRoundResult.upsert({
      where: {
        eventId_userId: { eventId: data.eventId, userId: data.userId },
      },
      create: {
        id: data.id,
        eventId: data.eventId,
        userId: data.userId,
        wpm: data.wpm,
        roundNumber: data.roundNumber,
        accuracy: data.accuracy,
        completionRate: data.completionRate,
        errorRate: data.errorRate,
        completionTime: data.completionTime,
        score: data.score,
        createdAt: data.createdAt,
      },
      update: {
        wpm: data.wpm,
        roundNumber: data.roundNumber,
        accuracy: data.accuracy,
        completionRate: data.completionRate,
        errorRate: data.errorRate,
        completionTime: data.completionTime,
        score: data.score,
      },
    });
  }

  async findByEventAndUser(
    eventId: string,
    userId: string,
  ): Promise<EventRoundResultEntity[]> {
    const rows = await this.prisma.eventRoundResult.findMany({
      where: { eventId, userId },
      orderBy: { createdAt: "asc" },
    });
    return rows.map((r) => this.reconstitute(r));
  }

  async findByEvent(eventId: string): Promise<EventRoundResultEntity[]> {
    const rows = await this.prisma.eventRoundResult.findMany({
      where: { eventId },
      orderBy: { score: "desc" },
    });
    return rows.map((r) => this.reconstitute(r));
  }

  async findByRoundNumberAndUser(
    roundNumber: number,
    userId: string,
    eventId: string,
  ): Promise<EventRoundResultEntity | null> {
    const raw = await this.prisma.eventRoundResult.findFirst({
      where: {
        eventId,
        roundNumber,
        userId,
      },
    });
    if (!raw) return null;
    return this.reconstitute(raw);
  }

  async findByRoundNumber(
    roundNumber: number,
    eventId: string,
  ): Promise<EventRoundResultEntity[]> {
    const rows = await this.prisma.eventRoundResult.findMany({
      where: {
        eventId,
        roundNumber,
      },
    });
    return rows.map((r) => this.reconstitute(r));
  }

  private reconstitute(raw: any): EventRoundResultEntity {
    return EventRoundResultEntity.reconstitute({
      id: raw.id,
      eventId: raw.eventId,
      userId: raw.userId,
      roundNumber: raw.roundNumber,
      wpm: raw.wpm,
      accuracy: raw.accuracy,
      completionRate: raw.completionRate,
      errorRate: raw.errorRate,
      completionTime: raw.completionTime,
      score: raw.score,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? undefined,
    });
  }
}
